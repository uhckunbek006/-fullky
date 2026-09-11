"use client";

import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./NewHero.scss";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type NewsItem = {
  id: number;
  name: string;
  category: string;
  image: string;
  date: string;
  desc: string;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const NewHero = () => {
  const [products, setProducts] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  useEffect(() => {
    if (!API_URL) {
      console.error(
        "NEXT_PUBLIC_API_URL табылган жок (.env файлын текшериңиз).",
      );
      setError("Адрес сервера не указан.");
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(`${API_URL}/products/get`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`Сервер вернул ошибку: ${res.status}`);

        const data = await res.json();

        const sortedData = data
          .sort((a: any, b: any) => {
            return (
              new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
            );
          })
          .slice(0, 6);

        const formattedProducts: NewsItem[] = sortedData.map((p: any) => ({
          id: p.id,
          name: p.title,
          category: "НОВОСТИ",
          image: p.image,
          date: formatDate(p.date),
          desc: p.description,
        }));

        setProducts(formattedProducts);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("Произошла ошибка при загрузке новостей.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!isLoading && products.length > 0) {
      AOS.refresh();
    }
  }, [isLoading, products]);

  return (
    <section id="newHero">
      <div className="container">
        <div className="newHero__top" data-aos="fade-down">
          <div>
            <h2>НОВОСТИ И ПРЕСС-ЦЕНТР</h2>
            <span></span>
          </div>

          <Link href="/news">
            ВСЕ НОВОСТИ <span>→</span>
          </Link>
        </div>

        <div className="newHero">
          {isLoading && <p>Загрузка...</p>}

          {error && <p className="newHero__error">{error}</p>}

          {!isLoading && !error && products.length === 0 && (
            <p className="newHero__empty">Пока нет новостей</p>
          )}

          {!isLoading &&
            !error &&
            products.map((item, index) => (
              <article
                className="newHero__card"
                key={item.id}
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                <div className="newHero__image">
                  <img src={item.image} alt={item.name} />
                  <span>{item.category}</span>
                </div>

                <div className="newHero__content">
                  <div className="newHero__date">
                    <span>📅</span>
                    {item.date}
                  </div>

                  <h3>{item.name}</h3>
                  <p>{item.desc}</p>

                  <Link href={`/news/${item.id}`}>
                    ПОДРОБНЕЕ <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
        </div>
      </div>
    </section>
  );
};

export default NewHero;
