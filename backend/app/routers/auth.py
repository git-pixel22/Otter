from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Response, Cookie, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.deps import get_db
from app.models.user import User
from app.schemas.auth import RegisterRequest, RegisterResponse, LoginRequest, TokenResponse
from app.services.auth import (
    hash_password, verify_password,
    create_access_token, generate_refresh_token, refresh_token_expiry,
)
from app.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

REFRESH_COOKIE = "refresh_token"
COOKIE_MAX_AGE = settings.refresh_token_expire_days * 24 * 60 * 60  # seconds


def _set_refresh_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=REFRESH_COOKIE,
        value=token,
        httponly=True,
        samesite="lax",
        max_age=COOKIE_MAX_AGE,
        secure=False,  # set to True in production
    )


def _clear_refresh_cookie(response: Response) -> None:
    response.delete_cookie(key=REFRESH_COOKIE)


@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
async def register(body: RegisterRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == body.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user = User(
        email=body.email,
        password=hash_password(body.password),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest, response: Response, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(body.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = create_access_token(identity=str(user.id))
    refresh_token = generate_refresh_token()

    user.refresh_token = refresh_token
    user.refresh_token_expires_at = refresh_token_expiry()
    await db.commit()

    _set_refresh_cookie(response, refresh_token)

    return TokenResponse(
        access_token=access_token,
        expires_in=settings.access_token_expire_minutes * 60,
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh(
    response: Response,
    refresh_token: str | None = Cookie(default=None),
    db: AsyncSession = Depends(get_db),
):
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No refresh token")

    result = await db.execute(select(User).where(User.refresh_token == refresh_token))
    user = result.scalar_one_or_none()

    if not user or not user.refresh_token_expires_at:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    if user.refresh_token_expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired")

    # rotate
    new_refresh_token = generate_refresh_token()
    user.refresh_token = new_refresh_token
    user.refresh_token_expires_at = refresh_token_expiry()
    await db.commit()

    _set_refresh_cookie(response, new_refresh_token)

    return TokenResponse(
        access_token=create_access_token(identity=str(user.id)),
        expires_in=settings.access_token_expire_minutes * 60,
    )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    response: Response,
    refresh_token: str | None = Cookie(default=None),
    db: AsyncSession = Depends(get_db),
):
    if refresh_token:
        result = await db.execute(select(User).where(User.refresh_token == refresh_token))
        user = result.scalar_one_or_none()
        if user:
            user.refresh_token = None
            user.refresh_token_expires_at = None
            await db.commit()

    _clear_refresh_cookie(response)
