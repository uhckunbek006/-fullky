"use client";
import { FC, useEffect, useState } from "react";
import "./News.scss";
import Link from "next/link";

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  author?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const News: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      if (!API_URL) {
        setError("Сервер дареги көрсөтүлгөн эмес.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(`${API_URL}/products/get`);

        if (!res.ok) {
          throw new Error(`Сервер ката кайтарды: ${res.status}`);
        }

        const data: Product[] = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Жүктөөдө ката:", err);
        setError("Жаңылыктарды жүктөөдө ката кетти.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <section id="News">
      <div className="container">
        <div className="News">
          {isLoading && <p>Жүктөлүүдө...</p>}
          {error && <p className="News__error">{error}</p>}
          {!isLoading && !error && products.length === 0 && (
            <p className="News__empty">Азырынча жаңылыктар жок</p>
          )}

          {!isLoading &&
            !error &&
            products.map((item) => (
              <div key={item.id} className="news-card">
                <div className="news-card__image">
                  <Link href={`/news/${item.id}`}>
                    <img src={item.image} alt={item.title} />
                  </Link>
                </div>

                <div className="news-card__body">
                  <span className="news-card__badge">НОВОСТИ</span>

                  <h2 className="news-card__title">{item.title}</h2>

                  <div className="news-card__meta">
                    <span>By {item.author || "admin"}</span>
                    <span className="news-card__dot">·</span>
                    <span>
                      {item.date
                        ? new Date(item.date).toLocaleDateString("ru-RU")
                        : ""}
                    </span>
                  </div>

                  <p className="news-card__desc">{item.description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default News;
