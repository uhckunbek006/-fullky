"use client";

import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Hero.scss";

const cardsData = [
  {
    id: 1,
    title: "Уголь Кара-Кече",
    desc: "Высококалорийный сорт",
    img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Удобный самовывоз",
    desc: "Быстрая отгрузка со склада",
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Сервисный центр",
    desc: "Гарантия качества и веса",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Отборный сорт",
    desc: "Крупная и мелкая фракция",
    img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Официальный договор",
    desc: "Работа с НДС и без, полный пакет документов",
    img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Поддержка 24/7",
    desc: "+996 (0312) 540 648",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
  },
];

const Hero = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <section id="Hero">
      <div className="hero-bg-image"></div>
      <div className="hero-bg-overlay"></div>

      <div className="container">
        <div className="hero-wrapper">
          <div className="hero-text" data-aos="fade-right">
            <h1 data-aos="fade-up" data-aos-delay="200">
              Тепло и уют в ваш дом: <br />
              <span className="gradient-text">Отборный уголь</span> с доставкой
            </h1>

            <p data-aos="fade-up" data-aos-delay="300">
              Поставляем высококалорийный уголь Кара-Кече прямо к вашему порогу.
              Быстро, надежно и по честным ценам.
            </p>
          </div>

          <div
            className="carousel-3d-scene"
            data-aos="fade-left"
            data-aos-delay="300"
          >
            <div className="carousel-3d-spinner">
              {cardsData.map((card, index) => (
                <div
                  key={card.id}
                  className="carousel-card"
                  style={{ "--index": index } as React.CSSProperties}
                >
                  <img src={card.img} alt={card.title} />
                  <div className="card-overlay">
                    <h3>{card.title}</h3>
                    <p>{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
