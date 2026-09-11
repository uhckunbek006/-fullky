"""
Скрипт для создания первого администратора
"""
from database import SessionLocal
from models import User
from auth import hash_password
import sys

def create_admin(username, email, password):
    """Создать админа или обновить существующего пользователя до админа"""
    db = SessionLocal()
    
    try:
        # Проверить, существует ли пользователь с таким email
        existing_user = db.query(User).filter(User.email == email).first()
        
        if existing_user:
            # Обновить существующего пользователя до админа
            existing_user.role = "ADMIN"
            db.commit()
            print(f"✅ Пользователь {existing_user.username} ({existing_user.email}) повышен до ADMIN")
            return True
        
        # Создать нового админа
        admin = User(
            username=username,
            email=email,
            hashed_password=hash_password(password),
            role="ADMIN",
            is_active=True
        )
        
        db.add(admin)
        db.commit()
        db.refresh(admin)
        
        print(f"✅ Админ создан успешно!")
        print(f"   Username: {admin.username}")
        print(f"   Email: {admin.email}")
        print(f"   Role: {admin.role}")
        print(f"\n🔑 Используйте эти данные для входа:")
        print(f"   Email: {email}")
        print(f"   Password: {password}")
        
        return True
        
    except Exception as e:
        print(f"❌ Ошибка при создании админа: {e}")
        db.rollback()
        return False
    finally:
        db.close()


def main():
    print("="*60)
    print("  СОЗДАНИЕ АДМИНИСТРАТОРА")
    print("="*60)
    
    if len(sys.argv) == 4:
        # Данные переданы через аргументы командной строки
        username = sys.argv[1]
        email = sys.argv[2]
        password = sys.argv[3]
    else:
        # Интерактивный режим
        print("\nВведите данные нового администратора:\n")
        username = input("Username: ").strip()
        email = input("Email: ").strip()
        password = input("Password: ").strip()
        
        if not username or not email or not password:
            print("❌ Все поля обязательны!")
            sys.exit(1)
        
        if len(password) < 6:
            print("❌ Пароль должен быть минимум 6 символов!")
            sys.exit(1)
    
    print("\n" + "-"*60)
    print(f"Username: {username}")
    print(f"Email: {email}")
    print(f"Password: {'*' * len(password)}")
    print("-"*60)
    
    confirm = input("\n✅ Создать админа? (y/n): ").strip().lower()
    
    if confirm == 'y':
        create_admin(username, email, password)
    else:
        print("❌ Отменено")


if __name__ == "__main__":
    main()
