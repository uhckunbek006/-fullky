from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import User
from schemas import AdminPanelResponse, UserOut, UserRoleUpdate
from auth import require_admin

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/panel", response_model=AdminPanelResponse)
def get_admin_panel(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Получить список всех пользователей (только ADMIN)"""
    all_users = db.query(User).order_by(User.created_at.desc()).all()
    return AdminPanelResponse(
        allUsers=[UserOut.model_validate(u) for u in all_users],
        total=len(all_users),
    )


@router.get("/users/{user_id}", response_model=UserOut)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Получить пользователя по ID (только ADMIN)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Колдонуучу табылган жок")
    return user


@router.patch("/users/{user_id}/role", response_model=UserOut)
def update_user_role(
    user_id: int,
    body: UserRoleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Изменить роль пользователя (только ADMIN)"""
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Өзүңүздүн ролуңузду өзгөртүүгө болбойт",
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Колдонуучу табылган жок")

    user.role = body.role
    db.commit()
    db.refresh(user)
    return user


@router.delete("/users/{user_id}", status_code=status.HTTP_200_OK)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Удалить пользователя (только ADMIN)"""
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Өзүңүздү өчүрүүгө болбойт",
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Колдонуучу табылган жок")

    db.delete(user)
    db.commit()
    return {"message": "Колдонуучу ийгиликтүү өчүрүлдү", "id": user_id}
