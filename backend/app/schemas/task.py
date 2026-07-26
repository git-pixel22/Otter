from __future__ import annotations
from pydantic import BaseModel
from typing import Optional, List
import uuid
from datetime import datetime


class TaskCreate(BaseModel):
    text: str
    quadrant: Optional[str] = None


class TaskUpdate(BaseModel):
    text: Optional[str] = None
    completed: Optional[bool] = None
    quadrant: Optional[str] = None
    position: Optional[int] = None


class TaskResponse(BaseModel):
    id: uuid.UUID
    text: str
    completed: bool
    quadrant: Optional[str]
    position: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class TaskListResponse(BaseModel):
    tasks: List[TaskResponse]
