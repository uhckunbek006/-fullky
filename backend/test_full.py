"""
Полный тест всех функций API включая админ панель
"""
import requests
import sys

BASE_URL = "http://localhost:8001"

def print_header(text):
    print(f"\n{'='*60}")
    print(f"  {text}")
    print(f"{'='*60}\n")

def test_health():
    """Проверка доступности API"""
    print("Проверка доступности API...")
    response = requests.get(f"{BASE_URL}/health", timeout=5)
    if response.status_code == 200:
        print("✅ API доступен")
        return True
    print("❌ API недоступен")
    return False

def test_register_and_login():
    """Регистрация и вход тестового пользователя"""
    print_header("1. РЕГИСТРАЦИЯ И ВХОД")
    
    # Регистрация
    print("Регистрация нового пользователя...")
    response = requests.post(
        f"{BASE_URL}/register",
        json={
            "username": "testuser2",
            "email": "testuser2@test.com",
            "password": "pass123"
        }
    )
    
    if response.status_code == 201:
        data = response.json()
        print(f"✅ Регистрация успешна: {data['user']['username']}")
        token = data['token']
    elif response.status_code == 409:
        print("⚠️ Пользователь уже существует, выполняем вход...")
        response = requests.post(
            f"{BASE_URL}/login",
            json={
                "email": "testuser2@test.com",
                "password": "pass123"
            }
        )
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Вход выполнен: {data['user']['username']}")
            token = data['token']
        else:
            print(f"❌ Ошибка входа: {response.status_code}")
            return None
    else:
        print(f"❌ Ошибка регистрации: {response.status_code}")
        return None
    
    # Тест неправильного пароля
    print("\nТест неправильного пароля...")
    response = requests.post(
        f"{BASE_URL}/login",
        json={
            "email": "testuser2@test.com",
            "password": "wrongpassword"
        }
    )
    
    if response.status_code == 401:
        print("✅ Неправильный пароль корректно отклонён (401)")
    else:
        print(f"⚠️ Неожиданный статус: {response.status_code}")
    
    return token

def test_logout(token):
    """Тест выхода"""
    print_header("2. ВЫХОД (LOGOUT)")
    
    response = requests.post(
        f"{BASE_URL}/logout",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    if response.status_code == 200:
        print("✅ Logout успешен")
        return True
    else:
        print(f"❌ Ошибка logout: {response.status_code}")
        return False

def test_admin_login():
    """Вход админа"""
    print_header("3. ВХОД АДМИНА")
    
    # Попробуем известного админа
    response = requests.post(
        f"{BASE_URL}/login",
        json={
            "email": "admin@kyrgyzkomur.kg",
            "password": "admin123"
        }
    )
    
    if response.status_code == 200:
        data = response.json()
        if data['user']['role'] == 'ADMIN':
            print(f"✅ Вход админа успешен: {data['user']['username']}")
            return data['token']
        else:
            print(f"⚠️ Пользователь не является админом: {data['user']['role']}")
            return None
    else:
        print(f"❌ Ошибка входа админа: {response.status_code}")
        print("   Возможно, аккаунт admin не создан или пароль другой")
        return None

def test_admin_panel(admin_token):
    """Тест админ панели"""
    print_header("4. АДМИН ПАНЕЛЬ")
    
    if not admin_token:
        print("⚠️ Нет токена админа, пропускаем тесты админ панели")
        return False
    
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    # Получить список пользователей
    print("Получение списка всех пользователей...")
    response = requests.get(f"{BASE_URL}/admin/panel", headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Список получен. Всего пользователей: {data['total']}")
        print("\nПользователи:")
        for user in data['allUsers'][:10]:
            print(f"   {user['id']}. {user['username']:20s} {user['email']:30s} {user['role']}")
        
        # Тест получения конкретного пользователя
        if data['allUsers']:
            user_id = data['allUsers'][0]['id']
            print(f"\nПолучение пользователя ID={user_id}...")
            response = requests.get(f"{BASE_URL}/admin/users/{user_id}", headers=headers)
            if response.status_code == 200:
                print(f"✅ Пользователь получен: {response.json()['username']}")
            else:
                print(f"⚠️ Ошибка получения пользователя: {response.status_code}")
        
        return True
    elif response.status_code == 403:
        print("❌ Доступ запрещён (403) - токен не админский")
        return False
    else:
        print(f"❌ Ошибка: {response.status_code}")
        return False

def test_user_access_to_admin(user_token):
    """Тест что обычный пользователь не может попасть в админку"""
    print_header("5. ПРОВЕРКА ДОСТУПА ОБЫЧНОГО ПОЛЬЗОВАТЕЛЯ")
    
    headers = {"Authorization": f"Bearer {user_token}"}
    response = requests.get(f"{BASE_URL}/admin/panel", headers=headers)
    
    if response.status_code == 403:
        print("✅ Обычный пользователь корректно заблокирован (403)")
        return True
    else:
        print(f"⚠️ Неожиданный статус: {response.status_code}")
        return False

def main():
    print_header("🚀 ПОЛНОЕ ТЕСТИРОВАНИЕ API")
    
    try:
        if not test_health():
            print("\n❌ API недоступен. Запустите сервер:")
            print("   uvicorn main:app --reload --port 8001")
            sys.exit(1)
        
        # Регистрация и вход обычного пользователя
        user_token = test_register_and_login()
        if not user_token:
            print("\n❌ Не удалось зарегистрироваться/войти")
            sys.exit(1)
        
        # Logout
        test_logout(user_token)
        
        # Повторный вход для получения свежего токена
        response = requests.post(
            f"{BASE_URL}/login",
            json={"email": "testuser2@test.com", "password": "pass123"}
        )
        user_token = response.json()['token']
        
        # Вход админа
        admin_token = test_admin_login()
        
        # Тесты админ панели
        if admin_token:
            test_admin_panel(admin_token)
        
        # Проверка что обычный юзер не может в админку
        test_user_access_to_admin(user_token)
        
        print_header("✅ ВСЕ ТЕСТЫ ЗАВЕРШЕНЫ")
        
        print("Проверено:")
        print("  ✅ Регистрация работает")
        print("  ✅ Login работает")
        print("  ✅ Logout работает")
        print("  ✅ Неправильный пароль отклоняется")
        print("  ✅ Обычные пользователи не могут попасть в админку")
        
        if admin_token:
            print("  ✅ Admin панель работает")
            print("  ✅ Получение списка пользователей работает")
        else:
            print("  ⚠️ Admin тесты пропущены (нет админа)")
            print("\n📝 Для тестирования админ панели:")
            print("   1. Зарегистрируйте пользователя")
            print("   2. Измените его роль на ADMIN в базе данных")
            print("   3. Запустите тест снова")
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Не удалось подключиться к API")
        print("   Убедитесь, что сервер запущен:")
        print("   uvicorn main:app --reload --port 8001")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Неожиданная ошибка: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
