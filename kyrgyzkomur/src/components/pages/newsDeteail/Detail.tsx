"use client";

import { FC, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import "./Detail.scss";
import NewHero from "../hero/NewHero";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type NewsItem = {
  id: number;
  name: string;
  category: string;
  image: string;
  date: string;
  desc: string;
};

const Detail: FC = () => {
  const params = useParams();
  const id = params?.id;

  const [news, setNews] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!API_URL) {
      setError("Адрес сервера не указан.");
      setIsLoading(false);
      return;
    }

    if (!id) {
      setError("Новость не найдена.");
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchNews = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(`${API_URL}/products/get`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Сервер вернул ошибку: ${res.status}`);
        }

        const data = await res.json();

        const found = data.find((p: any) => String(p.id) === String(id));

        if (!found) {
          setError("Такая новость не найдена.");
          setNews(null);
          return;
        }

        const mapped: NewsItem = {
          id: found.id,
          name: found.title,
          category: "НОВОСТИ",
          image: found.image,
          date: found.date
            ? new Date(found.date).toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "",
          desc: found.description,
        };

        setNews(mapped);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Ошибка при загрузке новости:", err);
          setError("Произошла ошибка при загрузке новости.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();

    return () => controller.abort();
  }, [id]);

  return (
    <section id="Detail">
      <div className="container">
        <div className="Detail">
          <Link href="/news" className="Detail__back">
            В Главную
          </Link>

          {isLoading && <p className="Detail__loading">Загрузка...</p>}

          {error && <p className="Detail__error">{error}</p>}

          {!isLoading && !error && !news && (
            <p className="Detail__empty">Новость не найдена</p>
          )}

          {!isLoading && !error && news && (
            <>
              <div className="Detail__image">
                <img src={news.image} alt={news.name} />
                <span>{news.category}</span>
              </div>

              <div className="Detail__content">
                <div className="Detail__date">
                  <span>📅</span>
                  {news.date}
                </div>

                <h1>{news.name}</h1>

                <p>{news.desc}</p>
              </div>
            </>
          )}
          <NewHero />
        </div>
      </div>
    </section>
  );
};

export default Detail;
