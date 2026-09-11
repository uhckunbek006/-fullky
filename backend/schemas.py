from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime


# ─────────────────────────── AUTH ───────────────────────────

class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Пароль минимум 6 символ болушу керек")
        return v

    @field_validator("username")
    @classmethod
    def username_min_length(cls, v: str) -> str:
        if len(v.strip()) < 2:
            raise ValueError("Аты минимум 2 символ болушу керек")
        return v.strip()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    token: str
    user: "UserOut"


# ─────────────────────────── USER ───────────────────────────

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class UserRoleUpdate(BaseModel):
    role: str

    @field_validator("role")
    @classmethod
    def role_must_be_valid(cls, v: str) -> str:
        if v not in ("USER", "ADMIN"):
            raise ValueError("Роль USER же ADMIN болушу керек")
        return v


# ─────────────────────────── PRODUCT (NEWS) ───────────────────────────

class ProductCreate(BaseModel):
    title: str
    description: str
    image: Optional[str] = None
    author: Optional[str] = "admin"
    date: Optional[datetime] = None


class ProductOut(BaseModel):
    id: int
    title: str
    description: str
    image: Optional[str] = None
    author: Optional[str] = None
    date: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ─────────────────────────── VACANCY ───────────────────────────

class VacancyCreate(BaseModel):
    title: str
    description: str
    requirements: Optional[str] = None
    salary: Optional[str] = None
    department: Optional[str] = "central"
    image: Optional[str] = None
    date: Optional[datetime] = None


class VacancyOut(BaseModel):
    id: int
    title: str
    description: str
    requirements: Optional[str] = None
    salary: Optional[str] = None
    department: Optional[str] = None
    image: Optional[str] = None
    date: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ─────────────────────────── ADMIN PANEL ───────────────────────────

class AdminPanelResponse(BaseModel):
    allUsers: list[UserOut]
    total: int


# Update forward refs
TokenResponse.model_rebuild()
