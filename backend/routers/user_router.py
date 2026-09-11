from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from database import get_db
from models import User
from schemas import UserOut
from auth import get_current_user

router = APIRouter(prefix="/user", tags=["User"])


class ProfileUpdate(BaseModel):
    username: str
    email: EmailStr


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    """Получить текущего пользователя"""
    return current_user


@router.put("/profile", response_model=UserOut)
def update_profile(
    body: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Обновить профиль пользователя"""
    # Проверка что username не занят другим
    existing = db.query(User).filter(
        User.username == body.username,
        User.id != current_user.id
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Бул колдонуучу аты ээленген",
        )

    # Проверка что email не занят другим
    existing_email = db.query(User).filter(
        User.email == body.email,
        User.id != current_user.id
    ).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Бул email менен колдонуучу буга чейин катталган",
        )

    current_user.username = body.username.strip()
    current_user.email = body.email
    db.commit()
    db.refresh(current_user)
    return current_user
