# КыргызКомур — Полный проект

Backend API для сайта ГП «Кыргызкомур» на FastAPI.

## 🚀 Быстрый старт

### 1. Установка

```bash
cd backend
pip install -r requirements.txt
```

### 2. Запуск сервера

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API будет доступен: **http://localhost:8000**

Документация: **http://localhost:8000/docs**

### 3. Создание администратора

```bash
python create_admin.py
```

Следуйте инструкциям на экране.

### 4. Тестирование

```bash
python test_full.py
```

---

## ✅ Что работает

- ✅ **Регистрация** — `/register`
- ✅ **Вход** — `/login`
- ✅ **Выход** — `/logout`
- ✅ **Admin панель** — `/admin/panel`
  - Список всех пользователей
  - Изменение роли пользователя
  - Удаление пользователей
- ✅ **Защита endpoints** — JWT авторизация
- ✅ **Разграничение прав** — USER / ADMIN

---

## 📚 Документация

Полная инструкция: [backend/ИНСТРУКЦИЯ.md](backend/ИНСТРУКЦИЯ.md)

---

## 🔧 Технологии

- **FastAPI** — современный веб-фреймворк
- **SQLAlchemy** — ORM для работы с БД
- **SQLite** — база данных (можно заменить на PostgreSQL)
- **JWT** — авторизация через токены
- **bcrypt** — хеширование паролей
- **Pydantic** — валидация данных

---

## 📝 Endpoints

### Публичные
- `POST /register` — Регистрация
- `POST /login` — Вход
- `GET /products/get` — Все новости
- `GET /vacancy` — Все вакансии

### Авторизованные
- `POST /logout` — Выход

### Только ADMIN
- `GET /admin/panel` — Список пользователей
- `GET /admin/users/{id}` — Получить пользователя
- `PATCH /admin/users/{id}/role` — Изменить роль
- `DELETE /admin/users/{id}` — Удалить пользователя

---

## 🐛 Решение проблем

### Ошибка: ModuleNotFoundError

```bash
pip install -r requirements.txt
```

### Порт занят

```bash
uvicorn main:app --reload --port 8001
```

### 401 Unauthorized

Получите новый токен через `/login`

### 403 Forbidden в /admin

Измените роль пользователя на ADMIN:

```bash
python create_admin.py
```

---

## 📞 Контакты

При возникновении проблем запустите тестовый скрипт:

```bash
python test_full.py
```

Он покажет, что именно не работает.
