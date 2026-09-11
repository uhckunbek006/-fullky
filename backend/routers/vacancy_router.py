from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from models import Vacancy, User
from schemas import VacancyCreate, VacancyOut
from auth import require_admin

router = APIRouter(prefix="/vacancy", tags=["Vacancies"])

VALID_DEPARTMENTS = {"central", "kara-keche", "issyk-kul", "yuzhnyi"}


@router.get("", response_model=List[VacancyOut])
def get_all_vacancies(
    department: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Получить все вакансии (публичный эндпоинт). Можно фильтровать по department."""
    query = db.query(Vacancy)
    if department:
        query = query.filter(Vacancy.department == department)
    return query.order_by(Vacancy.date.desc()).all()


@router.get("/{vacancy_id}", response_model=VacancyOut)
def get_vacancy(vacancy_id: int, db: Session = Depends(get_db)):
    """Получить одну вакансию по ID"""
    vacancy = db.query(Vacancy).filter(Vacancy.id == vacancy_id).first()
    if not vacancy:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Вакансия табылган жок")
    return vacancy


@router.post("", response_model=VacancyOut, status_code=status.HTTP_201_CREATED)
def create_vacancy(
    body: VacancyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Создать вакансию (только ADMIN)"""
    if body.department and body.department not in VALID_DEPARTMENTS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Бөлүм туура эмес. Жарактуулары: {', '.join(VALID_DEPARTMENTS)}",
        )

    vacancy = Vacancy(
        title=body.title,
        description=body.description,
        requirements=body.requirements,
        salary=body.salary,
        department=body.department or "central",
        image=body.image,
        date=body.date,
    )
    db.add(vacancy)
    db.commit()
    db.refresh(vacancy)
    return vacancy


@router.put("/{vacancy_id}", response_model=VacancyOut)
def update_vacancy(
    vacancy_id: int,
    body: VacancyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Обновить вакансию (только ADMIN)"""
    vacancy = db.query(Vacancy).filter(Vacancy.id == vacancy_id).first()
    if not vacancy:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Вакансия табылган жок")

    vacancy.title = body.title
    vacancy.description = body.description
    vacancy.requirements = body.requirements
    vacancy.salary = body.salary
    if body.department:
        vacancy.department = body.department
    vacancy.image = body.image
    if body.date:
        vacancy.date = body.date

    db.commit()
    db.refresh(vacancy)
    return vacancy


@router.delete("/{vacancy_id}", status_code=status.HTTP_200_OK)
def delete_vacancy(
    vacancy_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Удалить вакансию (только ADMIN)"""
    vacancy = db.query(Vacancy).filter(Vacancy.id == vacancy_id).first()
    if not vacancy:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Вакансия табылган жок")

    db.delete(vacancy)
    db.commit()
    return {"message": "Вакансия ийгиликтүү өчүрүлдү", "id": vacancy_id}
