from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from dotenv import load_dotenv

load_dotenv()

from database import engine, Base
import models  # Импорт нужен чтобы SQLAlchemy создал таблицы

from routers.auth_router import router as auth_router
from routers.products_router import router as products_router
from routers.vacancy_router import router as vacancy_router
from routers.admin_router import router as admin_router

# ─── Создать таблицы при старте ───
Base.metadata.create_all(bind=engine)

# ─── Приложение ───
app = FastAPI(
    title="КыргызКомур API",
    description="Backend API для сайта Государственного предприятия «Кыргызкомур»",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─── CORS ───
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Статические файлы (загрузки) ───
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# ─── Подключить роутеры ───
app.include_router(auth_router)
app.include_router(products_router)
app.include_router(vacancy_router)
app.include_router(admin_router)


# ─── Health check ───
@app.get("/", tags=["Health"])
def root():
    return {
        "status": "ok",
        "message": "КыргызКомур API иштеп жатат 🔥",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}
