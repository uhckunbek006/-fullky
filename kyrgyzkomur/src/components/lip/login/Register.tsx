"use client";

import { useState } from "react";
import "./Register.scss";
import logo from "@/src/assets/headerlogo.png";
import Image from "next/image";
import { Lock, User, Mail, Eye, EyeOff, UserPlus } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface IRegister {
  username: string;
  email: string;
  password: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IRegister>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<IRegister> = async (data) => {
    setRegisterError("");

    if (!API_URL) {
      setRegisterError("API URL конфигурацияланган эмес");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setRegisterError(result.message || "Каттоодо ката кетти!");
        return;
      }

      if (result.token) {
        localStorage.setItem("token", result.token);
      }
      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      window.dispatchEvent(new Event("authChange"));
      reset();
      router.push("/");
    } catch (err) {
      console.error("Register ката:", err);
      setRegisterError("Backend менен байланышта ката чыкты");
    }
  };

  return (
    <section id="register">
      <div className="container">
        <div className="Services">
          <div
            className="Services--block"
          >
            <div
              className="Services--block__head"
            >
              <Image src={logo} alt="logo" width={60} height={60} />
              <h1>Каттоо</h1>
              <span>Жаңы аккаунт түзүү</span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div
                className="Services--block__group"
              >
                <span>Толук аты</span>
                <div className="Services--block__input">
                  <User className="icon" size={18} />
                  <input
                    type="text"
                    placeholder="Аты"
                    {...register("username", {
                      required: "Атыңызды киргизиңиз",
                      minLength: {
                        value: 2,
                        message: "Минимум 2 символ",
                      },
                    })}
                  />
                </div>
                {errors.username && (
                  <p className="Services--block__error">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div
                className="Services--block__group"
              >
                <span>Email</span>
                <div className="Services--block__input">
                  <Mail className="icon" size={18} />
                  <input
                    type="email"
                    placeholder="gmail...."
                    {...register("email", {
                      required: "Email киргизиңиз",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Email туура эмес форматта",
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="Services--block__error">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div
                className="Services--block__group"
              >
                <span>Пароль</span>
                <div className="Services--block__input">
                  <Lock className="icon" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Пароль...."
                    {...register("password", {
                      required: "Пароль киргизиңиз",
                      minLength: {
                        value: 6,
                        message: "Минимум 6 символ",
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

              {registerError && (
                <p className="Services--block__error">{registerError}</p>
              )}

              <button
                type="submit"
                className="Services--block__submit"
                disabled={isSubmitting}
              >
                <span>
                  {isSubmitting
                    ? "Регистрация болууда..."
                    : "Регистрация болду"}
                </span>
                <UserPlus size={18} />
              </button>

              <p
                className="Services--block__register"
              >
                Аккаунтуңуз барбы?{" "}
                <Link href="/login" className="Services--block__register-link">
                  Войти
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
