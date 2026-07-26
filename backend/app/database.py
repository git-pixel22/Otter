from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


def create_engine(database_url: str):
    return create_async_engine(database_url, echo=False)


def create_session_factory(engine):
    return async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
