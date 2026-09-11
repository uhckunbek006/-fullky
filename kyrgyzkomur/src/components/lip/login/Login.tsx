"use client";

import { useState } from "react";
import "./Register.scss";
import logo from "@/src/assets/headerlogo.png";
import Image from "next/image";
import { Lock, Mail, Eye, EyeOff, LogIn } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ILogin {
  email: string;
  password: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ILogin>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<ILogin> = async (data) => {
    setLoginError("");

    if (!API_URL) {
      setLoginError("API URL конфигурацияланган эмес");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const result = await res.json();

      if (!res.ok) {
        setLoginError(result.detail || "Email же пароль туура эмес");
        return;
      }

      if (result.token) {
        localStorage.setItem("token", result.token);
      }
      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      window.dispatchEvent(new Event("authChange"));
      router.push("/");
    } catch (err) {
      console.error("Login ката:", err);
      setLoginError("Backend менен байланышта ката чыкты");
    }
  };

  return (
    <section id="register">
      <div className="container">
        <div className="Services">
          <div className="Services--block" data-aos="zoom-in" data-aos-duration="800">
            <div className="Services--block__head" data-aos="fade-up" data-aos-duration="700" data-aos-delay="150">
              <Image src={logo} alt="logo" width={60} height={60} />
              <h1>Кирүү</h1>
              <span>Личный кабинет</span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="Services--block__group" data-aos="fade-up" data-aos-duration="700" data-aos-delay="200">
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
                {errors.email && <p className="Services--block__error">{errors.email.message}</p>}
              </div>

              <div className="Services--block__group" data-aos="fade-up" data-aos-duration="700" data-aos-delay="300">
                <span>Пароль</span>
                <div className="Services--block__input">
                  <Lock className="icon" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Пароль...."
                    {...register("password", {
                      required: "Пароль киргизиңиз",
                      minLength: { value: 6, message: "Минимум 6 символ" },
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
                {errors.password && <p className="Services--block__error">{errors.password.message}</p>}
              </div>

              {loginError && <p className="Services--block__error">{loginError}</p>}

              <button
                type="submit"
                className="Services--block__submit"
                disabled={isSubmitting}
                data-aos="fade-up"
                data-aos-duration="700"
                data-aos-delay="400"
              >
                <span>{isSubmitting ? "Кирүүдө..." : "Кирүү"}</span>
                <LogIn size={18} />
              </button>

              <p className="Services--block__register" data-aos="fade-up" data-aos-duration="700" data-aos-delay="500">
                Аккаунтуңуз жокпу?{" "}
                <Link href="/login?mode=register" className="Services--block__register-link">
                  Каттоо
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
