from datetime import datetime, timezone
from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.deps import get_db, get_current_user
from app.models.task import Task
from app.models.user import User
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse, TaskListResponse

router = APIRouter(prefix="/tasks", tags=["tasks"])

TASK_LIMIT = 30

VALID_QUADRANTS = {"A", "B", "C", "D"}


def _check_quadrant(quadrant: str | None) -> None:
    if quadrant is not None and quadrant not in VALID_QUADRANTS:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"quadrant must be one of {sorted(VALID_QUADRANTS)}",
        )


@router.get("", response_model=TaskListResponse)
async def list_tasks(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Task)
        .where(Task.user_id == current_user.id, Task.deleted_at.is_(None))
        .order_by(Task.position, Task.created_at)
    )
    tasks = result.scalars().all()
    return TaskListResponse(tasks=tasks)


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    body: TaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _check_quadrant(body.quadrant)

    # enforce task limit
    count_result = await db.execute(
        select(func.count(Task.id)).where(
            Task.user_id == current_user.id, Task.deleted_at.is_(None)
        )
    )
    count = count_result.scalar_one()
    if count >= TASK_LIMIT:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Task limit of {TASK_LIMIT} reached",
        )

    task = Task(
        user_id=current_user.id,
        text=body.text.strip(),
        quadrant=body.quadrant,
        position=count,  # append at end
    )
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task


@router.patch("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: UUID,
    body: TaskUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _check_quadrant(body.quadrant)

    task = await db.get(Task, task_id)
    if not task or task.user_id != current_user.id or task.deleted_at is not None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    if body.text is not None:
        task.text = body.text.strip()
    if body.completed is not None:
        task.completed = body.completed
    if body.quadrant is not None:
        task.quadrant = body.quadrant
    if body.position is not None:
        task.position = body.position

    task.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(task)
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = await db.get(Task, task_id)
    if not task or task.user_id != current_user.id or task.deleted_at is not None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    task.deleted_at = datetime.now(timezone.utc)
    await db.commit()
