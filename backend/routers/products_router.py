from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Product, User
from schemas import ProductCreate, ProductOut
from auth import get_current_user, require_admin

router = APIRouter(prefix="/products", tags=["Products / News"])


@router.get("/get", response_model=List[ProductOut])
def get_all_products(db: Session = Depends(get_db)):
    """Получить все новости (публичный эндпоинт)"""
    return db.query(Product).order_by(Product.date.desc()).all()


@router.get("/get/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Получить одну новость по ID"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Жаңылык табылган жок",
        )
    return product


@router.post("/post", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(
    body: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Создать новость (только ADMIN)"""
    product = Product(
        title=body.title,
        description=body.description,
        image=body.image,
        author=body.author or current_user.username,
        date=body.date,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/update/{product_id}", response_model=ProductOut)
def update_product(
    product_id: int,
    body: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Обновить новость (только ADMIN)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Жаңылык табылган жок")

    product.title = body.title
    product.description = body.description
    product.image = body.image
    product.author = body.author or product.author
    if body.date:
        product.date = body.date

    db.commit()
    db.refresh(product)
    return product


@router.delete("/delete/{product_id}", status_code=status.HTTP_200_OK)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Удалить новость (только ADMIN)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Жаңылык табылган жок")

    db.delete(product)
    db.commit()
    return {"message": "Жаңылык ийгиликтүү өчүрүлдү", "id": product_id}
