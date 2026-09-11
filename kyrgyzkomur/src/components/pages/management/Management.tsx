"use client";

import { FC, useEffect } from "react";
import Link from "next/link";
import { User, ShieldCheck, ChevronRight } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Management.scss";

interface ILeader {
  id: number;
  name: string;
  position: string;
}

const leaders: ILeader[] = [
  {
    id: 1,
    name: "Садыралиев Рустамбек Кадыралиевич",
    position: "Генеральный директор",
  },
  {
    id: 2,
    name: "Аскаров Марс Маданбекович",
    position: "Заместитель генерального директора",
  },
  {
    id: 3,
    name: "Конуров Бахадыр Арунович",
    position: "Заместитель генерального директора",
  },
];

const navLinks = [
  { href: "/news", label: "Новости" },
  { href: "/contact", label: "Контакты" },
  { href: "/about", label: "О компании" },
];

const Management: FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <section id="Management">
      <div className="container">
        <div className="Management">
          <div className="Management__content">
            <div className="Management__header" data-aos="fade-right">
              <h2>Руководство ОАО «Кыргызкөмүр»</h2>
              <div className="Management__line"></div>
            </div>

            <div className="Management__grid">
              {leaders.map((item, index) => (
                <div
                  key={item.id}
                  className="Management__card"
                  data-aos="fade-up"
                  data-aos-delay={100 + index * 100}
                >
                  <div className="Management__icon">
                    <User size={28} />
                  </div>
                  <div className="Management__info">
                    <h3>{item.name}</h3>
                    <p>
                      <ShieldCheck size={16} />
                      <span>{item.position}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="Management__sidebar">
            <div
              className="Management__sidebar-box"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <h3>Навигация</h3>
              <ul>
                {navLinks.map((link, idx) => (
                  <li key={idx}>
                    <Link href={link.href}>
                      <span>{link.label}</span>
                      <ChevronRight size={16} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Management;
