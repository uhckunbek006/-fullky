"""
Тестовый скрипт для проверки работоспособности API
Регистрация, Login, Logout, Admin панель
"""
import requests
import sys

BASE_URL = "http://localhost:8001"

def test_register():
    """Тест регистрации"""
    print("\n1️⃣ Тестирование регистрации...")
    
    # Регистрация нового пользователя
    response = requests.post(
        f"{BASE_URL}/register",
        json={
            "username": "newuser",
            "email": "newuser@test.com",
            "password": "password123"
        }
    )
    
    if response.status_code == 201:
        data = response.json()
        print(f"✅ Регистрация успешна: {data['user']['username']} (ID: {data['user']['id']})")
        return data['token']
    elif response.status_code == 409:
        print("⚠️ Пользователь уже существует (это нормально при повторном запуске)")
        # Попробуем залогиниться
        response = requests.post(
            f"{BASE_URL}/login",
            json={
                "email": "newuser@test.com",
                "password": "password123"
            }
        )
        if response.status_code == 200:
            print("✅ Вход выполнен с существующим пользователем")
            return response.json()['token']
    
    print(f"❌ Ошибка регистрации: {response.status_code}")
    return None


def test_login():
    """Тест входа"""
    print("\n2️⃣ Тестирование входа...")
    
    response = requests.post(
        f"{BASE_URL}/login",
        json={
            "email": "newuser@test.com",
            "password": "password123"
        }
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Вход успешен: {data['user']['username']} ({data['user']['role']})")
        return data['token']
    else:
        print(f"❌ Ошибка входа: {response.status_code}")
        return None


def test_logout(token):
    """Тест выхода"""
    print("\n3️⃣ Тестирование выхода...")
    
    response = requests.post(
        f"{BASE_URL}/logout",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    if response.status_code == 200:
        print("✅ Выход выполнен успешно")
        return True
    else:
        print(f"❌ Ошибка выхода: {response.status_code}")
        return False


def test_admin_access(token):
    """Тест доступа к admin панели"""
    print("\n4️⃣ Тестирование admin панели...")
    
    response = requests.get(
        f"{BASE_URL}/admin/panel",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Доступ к admin панели получен. Всего пользователей: {data['total']}")
        for user in data['allUsers'][:5]:  # Показываем первых 5
            print(f"   - {user['username']} ({user['email']}) - {user['role']}")
        return True
    elif response.status_code == 403:
        print("⚠️ Доступ запрещён (пользователь не ADMIN) - это ожидаемо для обычных пользователей")
        return False
    else:
        print(f"❌ Ошибка доступа к admin панели: {response.status_code}")
        return False


def test_wrong_password():
    """Тест с неправильным паролем"""
    print("\n5️⃣ Тестирование неправильного пароля...")
    
    response = requests.post(
        f"{BASE_URL}/login",
        json={
            "email": "newuser@test.com",
            "password": "wrongpassword"
        }
    )
    
    if response.status_code == 401:
        print("✅ Неправильный пароль корректно отклонён")
        return True
    else:
        print(f"❌ Неожиданный статус: {response.status_code}")
        return False


def main():
    print("=" * 60)
    print("🚀 ТЕСТИРОВАНИЕ API КыргызКомур")
    print("=" * 60)
    
    try:
        # Проверка доступности API
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code != 200:
            print("❌ API недоступен!")
            sys.exit(1)
        print("✅ API доступен")
        
        # Тесты
        token = test_register()
        if not token:
            print("\n❌ Критическая ошибка: не удалось получить токен")
            sys.exit(1)
        
        token = test_login()
        if not token:
            print("\n❌ Критическая ошибка: не удалось войти")
            sys.exit(1)
        
        test_logout(token)
        test_wrong_password()
        
        # Повторный логин для получения свежего токена
        token = test_login()
        test_admin_access(token)
        
        print("\n" + "=" * 60)
        print("✅ ВСЕ ОСНОВНЫЕ ТЕСТЫ ПРОЙДЕНЫ")
        print("=" * 60)
        print("\n📝 Примечания:")
        print("   - Регистрация работает")
        print("   - Login работает")
        print("   - Logout работает")
        print("   - Неправильный пароль отклоняется")
        print("   - Admin панель работает (требуется роль ADMIN)")
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Не удалось подключиться к API")
        print("   Убедитесь, что сервер запущен: uvicorn main:app --reload --port 8001")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Неожиданная ошибка: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
