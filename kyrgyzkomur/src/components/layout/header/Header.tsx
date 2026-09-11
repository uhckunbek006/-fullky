"use client";

import { FC, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Headerlogo from "@/src/assets/headerlogo.png";
import headergerb from "@/src/assets/gerb.png";
import "./Header.scss";

const Header: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Главная" },
    { href: "/about", label: "Товарищество" },
    { href: "/management", label: "Руководство" },
    { href: "/news", label: "Пресс-центр" },
    { href: "/vacancies", label: "Вакансии" },
    { href: "/contact", label: "Контакты" },
    { href: "/services", label: "Сервис-центр" },
  ];

  return (
    <header id="Header" className={isScrolled ? "isScrolled" : ""}>
      <div className="container">
        <div className="Header">
          <Link href="/" className="Header__brand">
            <Image
              src={Headerlogo}
              alt="Логотип"
              width={45}
              height={45}
              priority
            />
            <span className="Header__title">ОАО «Кыргыз Комур»</span>
          </Link>

          <nav className={`Header__nav ${isOpen ? "isOpen" : ""}`}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`Header__link ${
                  pathname === link.href ? "active" : ""
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="Header__actions">
            <Image
              src={headergerb}
              alt="Герб"
              width={45}
              height={45}
              className="Header__gerb"
              priority
            />
            <button
              className="Header__burger"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Меню"
            >
              {isOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
