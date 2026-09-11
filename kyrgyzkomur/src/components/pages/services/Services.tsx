"use client";
import { FC, useState } from "react";
import "./Services.scss";
import logo from "@/src/assets/headerlogo.png";
import Image from "next/image";
import { Lock, User, Eye, EyeOff, LogIn } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface IServices {
  login: string;
  password: string;
  rememberMe: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Services: FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IServices>({
    defaultValues: {
      login: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit: SubmitHandler<IServices> = async (data) => {
    setLoginError("");
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.login,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setLoginError(result.message || "Неверный логин или пароль!");
        return;
      }

      localStorage.setItem("token", result.token);
      if (data.rememberMe) {
        localStorage.setItem("token", result.token);
      } else {
        sessionStorage.setItem("token", result.token);
      }
      // TopBar ар дайым localStorage'дан окуйт, ошондуктан токенди
      // "эстеп калуу" тандалганбы же жокпу дегенге карабай
      // ар дайым localStorage'га сактайбыз.
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      window.dispatchEvent(new Event("authChange"));

      reset();

      if (result.user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("Ошибка входа:", err);
      setLoginError("Ошибка связи с бэкендом");
    }
  };

  return (
    <section id="Services">
      <div className="container">
        <div className="Services">
          <div
            className="Services--block"
            data-aos="zoom-in"
            data-aos-duration="800"
          >
            <div
              className="Services--block__head"
              data-aos="fade-up"
              data-aos-duration="700"
              data-aos-delay="150"
            >
              <Image src={logo} alt="logo" width={60} height={60} />
              <h1>Личный кабинет</h1>
              <span>Вход в систему управления</span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div
                className="Services--block__group"
                data-aos="fade-up"
                data-aos-duration="700"
                data-aos-delay="250"
              >
                <span>Логин</span>
                <div className="Services--block__input">
                  <User className="icon" size={18} />
                  <input
                    type="text"
                    placeholder="gmail...."
                    {...register("login", {
                      required: "Введите логин",
                    })}
                  />
                </div>
                {errors.login && (
                  <p className="Services--block__error">
                    {errors.login.message}
                  </p>
                )}
              </div>

              <div
                className="Services--block__group"
                data-aos="fade-up"
                data-aos-duration="700"
                data-aos-delay="350"
              >
                <span>Пароль</span>
                <div className="Services--block__input">
                  <Lock className="icon" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Пароль...."
                    {...register("password", {
                      required: "Введите пароль",
                      minLength: {
                        value: 6,
                        message: "Минимум 6 символов",
                      },
                    })}
                  />
                  <button
                    type="button"
                    className="Services--block__toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="Services--block__error">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {loginError && (
                <p className="Services--block__error">{loginError}</p>
              )}

              <div
                className="Services--block__actions"
                data-aos="fade-up"
                data-aos-duration="700"
                data-aos-delay="450"
              >
                <label className="Services--block__checkbox">
                  <input type="checkbox" {...register("rememberMe")} />
                  <span>Запомнить меня</span>
                </label>
              </div>

              <button
                type="submit"
                className="Services--block__submit"
                disabled={isSubmitting}
                data-aos="fade-up"
                data-aos-duration="700"
                data-aos-delay="550"
              >
                <span>{isSubmitting ? "Вход..." : "Войти"}</span>
                <LogIn size={18} />
              </button>

              <p
                className="Services--block__register"
                data-aos="fade-up"
                data-aos-duration="700"
                data-aos-delay="600"
              >
                Аккаунтуңуз жокпу?{" "}
                <Link
                  href="/qr_login"
                  className="Services--block__register-link"
                >
                  Регистрация
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
