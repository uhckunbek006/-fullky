# КыргызКомур — FastAPI Backend

REST API бэкенд для сайта ГП «Кыргызкомур».

## Эндпоинты

| Метод | URL | Доступ | Описание |
|-------|-----|--------|----------|
| POST | `/register` | Публичный | Регистрация |
| POST | `/login` | Публичный | Вход, получить JWT |
| GET | `/products/get` | Публичный | Все новости |
| GET | `/products/get/{id}` | Публичный | Одна новость |
| POST | `/products/post` | ADMIN | Создать новость |
| PUT | `/products/update/{id}` | ADMIN | Обновить новость |
| DELETE | `/products/delete/{id}` | ADMIN | Удалить новость |
| GET | `/vacancy` | Публичный | Все вакансии |
| GET | `/vacancy/{id}` | Публичный | Одна вакансия |
| POST | `/vacancy` | ADMIN | Создать вакансию |
| PUT | `/vacancy/{id}` | ADMIN | Обновить вакансию |
| DELETE | `/vacancy/{id}` | ADMIN | Удалить вакансию |
| GET | `/admin/panel` | ADMIN | Список всех пользователей |
| GET | `/admin/users/{id}` | ADMIN | Пользователь по ID |
| PATCH | `/admin/users/{id}/role` | ADMIN | Изменить роль |
| DELETE | `/admin/users/{id}` | ADMIN | Удалить пользователя |

## Установка и запуск

### 1. Перейти в папку бэкенда
```
cd backend
```

### 2. Создать виртуальное окружение
```
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
```

### 3. Установить зависимости
```
pip install -r requirements.txt
```

### 4. Настроить .env
Скопируй `.env.example` → `.env` и заполни:
```
copy .env.example .env
```

### 5. Запустить сервер
```
uvicorn main:app --reload --host 0.0.0.0 --port 5000
```

Сервер запустится на: **http://localhost:5000**  
Документация Swagger: **http://localhost:5000/docs**

---

## Настройка фронтенда

В файле `.env.local` Next.js проекта добавь:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Отделы вакансий (department)

| ID | Название |
|----|----------|
| `central` | Центральный аппарат |
| `kara-keche` | Филиал «Кара-Кече» |
| `issyk-kul` | Филиал «Иссык-Кульское пароходство» |
| `yuzhnyi` | Филиал «Южный» |

---

## Первый ADMIN пользователь

После первой регистрации, зайди в базу данных и вручную измени роль:

**SQLite (через Python):**
```python
from database import SessionLocal
from models import User

db = SessionLocal()
user = db.query(User).filter(User.email == "your@email.com").first()
user.role = "ADMIN"
db.commit()
db.close()
```

Или через SQLite браузер: [DB Browser for SQLite](https://sqlitebrowser.org/)
