"use client";

import { FC, useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import "./Contact.scss";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";

interface ContactItem {
  label: string;
  phone: string;
}

interface CoalBranch {
  id: number;
  name: string;
  region: string;
  address: string;
  phone?: string;
  position: [number, number];
  verified?: boolean;
}

const mainContacts: ContactItem[] = [
  { label: "Общий отдел", phone: "(0312) 540 451" },
  { label: "Приемная", phone: "(0312) 540 631" },
  { label: "Юридический отдел", phone: "(0312) 540 433" },
  { label: "QR пропуск", phone: "+996 (600) 011 032" },
];

const branches: ContactItem[] = [
  { label: "Филиал Кара-Кече", phone: "+996 (706) 520 959" },
  { label: "Филиал Балыкчы", phone: "+996 (703) 169 025" },
  { label: "Филиал Южный", phone: "+996 (700) 240 679" },
];

const toTelHref = (phone: string) => `tel:${phone.replace(/\D/g, "")}`;

const position: [number, number] = [41.2044, 74.7661];

const placeName = "Кыргызстан";

const ChangeMap = ({ position }: { position: [number, number] }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, 7);
  }, [map, position]);

  return null;
};

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const coalIcon = L.icon({
  iconUrl:
    "https://png.pngtree.com/png-clipart/20250415/original/pngtree-d-shiny-blue-map-marker-icon-high-quality-location-pin-illustration-png-image_20811448.png",
  iconSize: [45, 45],
  iconAnchor: [22, 45],
  popupAnchor: [0, -45],
});

const coalBranches: CoalBranch[] = [
  {
    id: 1,
    name: "Кыргызкөмүр — Кыргыз / Айланма жол",
    region: "Бишкек",
    address: "Кыргыз / Айланма жол көч., контур №902",
    phone: "0505-28-07-02",
    position: [42.85, 74.52],
    verified: true,
  },
  {
    id: 2,
    name: "Кыргызкөмүр — Мурманская",
    region: "Бишкек",
    address: "Мурманская көч., 1Б",
    phone: "0705-71-87-71",
    position: [42.84, 74.57],
    verified: true,
  },
  {
    id: 3,
    name: "Кыргызкөмүр — Сарыкулаков",
    region: "Бишкек",
    address: "Сарыкулаков көч., 6Б (Алыкулов)",
    phone: "0709-99-06-53",
    position: [42.84, 74.55],
    verified: true,
  },
  {
    id: 4,
    name: "Кыргызкөмүр — Достоевский / Анкара",
    region: "Бишкек",
    address: "Достоевский — Анкара, 97К",
    phone: "0705-41-48-03",
    position: [42.85, 74.62],
    verified: true,
  },
  {
    id: 5,
    name: "Кыргызкөмүр — Кара-Жыгач",
    region: "Бишкек",
    address: "Оберон — Сары-Өзөн көчөлөрүнүн кесилиши",
    phone: "0709-40-40-51",
    position: [42.88, 74.66],
    verified: true,
  },
  {
    id: 6,
    name: "Кыргызкөмүр — Көк-Жар",
    region: "Бишкек",
    address: "Көк-Жар, Полевая көчөсү (МТФ)",
    phone: "0557-09-99-11",
    position: [42.84, 74.67],
    verified: true,
  },
  {
    id: 7,
    name: "Кыргызкөмүр — Көк-Жар Мадиев",
    region: "Бишкек",
    address: "Көк-Жар, Мадиев көч., 38",
    phone: "0703-97-96-80",
    position: [42.83, 74.66],
    verified: true,
  },
  {
    id: 8,
    name: "Кыргызкөмүр — Калыс-Ордо",
    region: "Бишкек",
    address: "Айланма жол, контур №327",
    phone: "0507-04-56-78",
    position: [42.93, 74.56],
    verified: true,
  },
  {
    id: 9,
    name: "Кыргызкөмүр — Ак-Жар",
    region: "Бишкек",
    address: "Ак-Жар, Айланма жол, контур №1604",
    phone: "0700-22-33-71",
    position: [42.91, 74.68],
    verified: true,
  },
  {
    id: 10,
    name: "Кыргызкөмүр — Айланма жол / Кыргыз",
    region: "Бишкек",
    address: "Айланма жол — Кыргыз көч., контур №818",
    phone: "0706-72-44-44",
    position: [42.88, 74.54],
    verified: true,
  },
  {
    id: 11,
    name: "Кыргызкөмүр — Лебединовка",
    region: "Бишкек",
    address: "Лебединовка, Калинина көч., 1-линия 8/1",
    phone: "0501-11-11-86",
    position: [42.87, 74.65],
    verified: true,
  },
  {
    id: 12,
    name: "Кыргызкөмүр — Ленинское",
    region: "Бишкек",
    address: "Ленинское айылы, Айланма жол, контур №963",
    phone: "0705-72-57-55",
    position: [42.78, 74.52],
    verified: true,
  },
  {
    id: 13,
    name: "Көмүр сатуу пункту — Токмок",
    region: "Чүй",
    address: "Токмок шаары",
    position: [42.841, 75.301],
  },
  {
    id: 14,
    name: "Көмүр сатуу пункту — Кемин",
    region: "Чүй",
    address: "Кемин шаары",
    position: [42.786, 75.691],
  },
  {
    id: 15,
    name: "Көмүр сатуу пункту — Кант",
    region: "Чүй",
    address: "Кант шаары",
    position: [42.891, 74.85],
  },
  {
    id: 16,
    name: "Көмүр сатуу пункту — Сокулук",
    region: "Чүй",
    address: "Сокулук айылы",
    position: [42.872, 74.309],
  },
  {
    id: 17,
    name: "Көмүр сатуу пункту — Кара-Балта",
    region: "Чүй",
    address: "Кара-Балта шаары",
    position: [42.814, 73.848],
  },
  {
    id: 18,
    name: "Көмүр сатуу пункту — Шопоков",
    region: "Чүй",
    address: "Шопоков шаары",
    position: [42.838, 74.322],
  },
  {
    id: 19,
    name: "Көмүр сатуу пункту — Беловодское",
    region: "Чүй",
    address: "Беловодское айылы",
    position: [42.833, 74.109],
  },
  {
    id: 20,
    name: "Көмүр сатуу пункту — Ивановка",
    region: "Чүй",
    address: "Ивановка айылы",
    position: [42.887, 75.08],
  },
  {
    id: 21,
    name: "Көмүр сатуу пункту — Каракол",
    region: "Ысык-Көл",
    address: "Каракол шаары",
    position: [42.49, 78.393],
  },
  {
    id: 22,
    name: "Көмүр сатуу пункту — Балыкчы",
    region: "Ысык-Көл",
    address: "Балыкчы шаары",
    position: [42.46, 76.185],
  },
  {
    id: 23,
    name: "Көмүр сатуу пункту — Чолпон-Ата",
    region: "Ысык-Көл",
    address: "Чолпон-Ата шаары",
    position: [42.649, 77.082],
  },
  {
    id: 24,
    name: "Көмүр сатуу пункту — Түп",
    region: "Ысык-Көл",
    address: "Түп айылы",
    position: [42.727, 78.365],
  },
  {
    id: 25,
    name: "Көмүр сатуу пункту — Боконбаево",
    region: "Ысык-Көл",
    address: "Боконбаево айылы",
    position: [42.117, 76.993],
  },
  {
    id: 26,
    name: "Көмүр сатуу пункту — Кочкор",
    region: "Ысык-Көл",
    address: "Кочкор айылы",
    position: [42.215, 75.756],
  },
  {
    id: 27,
    name: "Көмүр сатуу пункту — Нарын",
    region: "Нарын",
    address: "Нарын шаары",
    position: [41.428, 75.991],
  },
  {
    id: 28,
    name: "Көмүр сатуу пункту — Ат-Башы",
    region: "Нарын",
    address: "Ат-Башы айылы",
    position: [41.169, 75.81],
  },
  {
    id: 29,
    name: "Көмүр сатуу пункту — Жумгал",
    region: "Нарын",
    address: "Чаек айылы",
    position: [41.893, 74.427],
  },
  {
    id: 30,
    name: "Көмүр сатуу пункту — Кочкор",
    region: "Нарын",
    address: "Кочкор айылы",
    position: [42.215, 75.756],
  },
  {
    id: 31,
    name: "Көмүр сатуу пункту — Ак-Талаа",
    region: "Нарын",
    address: "Баетов айылы",
    position: [41.493, 74.698],
  },
  {
    id: 32,
    name: "Көмүр сатуу пункту — Талас",
    region: "Талас",
    address: "Талас шаары",
    position: [42.522, 72.242],
  },
  {
    id: 33,
    name: "Көмүр сатуу пункту — Бакай-Ата",
    region: "Талас",
    address: "Бакай-Ата айылы",
    position: [42.489, 72.812],
  },
  {
    id: 34,
    name: "Көмүр сатуу пункту — Манас",
    region: "Талас",
    address: "Покровка айылы",
    position: [42.514, 72.748],
  },
  {
    id: 35,
    name: "Көмүр сатуу пункту — Кара-Буура",
    region: "Талас",
    address: "Кызыл-Адыр айылы",
    position: [42.628, 71.593],
  },
  {
    id: 36,
    name: "Көмүр сатуу пункту — Жалал-Абад",
    region: "Жалал-Абад",
    address: "Жалал-Абад шаары",
    position: [40.933, 73.0],
  },
  {
    id: 37,
    name: "Көмүр сатуу пункту — Таш-Көмүр",
    region: "Жалал-Абад",
    address: "Таш-Көмүр шаары",
    position: [41.346, 72.231],
  },
  {
    id: 38,
    name: "Көмүр сатуу пункту — Кара-Көл",
    region: "Жалал-Абад",
    address: "Кара-Көл шаары",
    position: [41.602, 72.671],
  },
  {
    id: 39,
    name: "Көмүр сатуу пункту — Майлуу-Суу",
    region: "Жалал-Абад",
    address: "Майлуу-Суу шаары",
    position: [41.24, 72.45],
  },
  {
    id: 40,
    name: "Көмүр сатуу пункту — Кочкор-Ата",
    region: "Жалал-Абад",
    address: "Кочкор-Ата шаары",
    position: [40.545, 72.8],
  },
  {
    id: 41,
    name: "Көмүр сатуу пункту — Базар-Коргон",
    region: "Жалал-Абад",
    address: "Базар-Коргон шаары",
    position: [41.037, 72.747],
  },
  {
    id: 42,
    name: "Көмүр сатуу пункту — Кербен",
    region: "Жалал-Абад",
    address: "Кербен шаары",
    position: [41.493, 71.758],
  },
  {
    id: 43,
    name: "Көмүр сатуу пункту — Ош",
    region: "Ош",
    address: "Ош шаары",
    position: [40.513, 72.816],
  },
  {
    id: 44,
    name: "Көмүр сатуу пункту — Кара-Суу",
    region: "Ош",
    address: "Кара-Суу шаары",
    position: [40.705, 72.867],
  },
  {
    id: 45,
    name: "Көмүр сатуу пункту — Өзгөн",
    region: "Ош",
    address: "Өзгөн шаары",
    position: [40.769, 73.3],
  },
  {
    id: 46,
    name: "Көмүр сатуу пункту — Ноокат",
    region: "Ош",
    address: "Ноокат шаары",
    position: [40.265, 72.619],
  },
  {
    id: 47,
    name: "Көмүр сатуу пункту — Араван",
    region: "Ош",
    address: "Араван айылы",
    position: [40.516, 72.498],
  },
  {
    id: 48,
    name: "Көмүр сатуу пункту — Кара-Кулжа",
    region: "Ош",
    address: "Кара-Кулжа айылы",
    position: [40.637, 73.452],
  },
  {
    id: 49,
    name: "Көмүр сатуу пункту — Гүлчө",
    region: "Ош",
    address: "Гүлчө айылы",
    position: [40.313, 73.449],
  },
  {
    id: 50,
    name: "Көмүр сатуу пункту — Баткен",
    region: "Баткен",
    address: "Баткен шаары",
    position: [40.062, 70.819],
  },
  {
    id: 51,
    name: "Көмүр сатуу пункту — Кызыл-Кыя",
    region: "Баткен",
    address: "Кызыл-Кыя шаары",
    position: [40.256, 72.127],
  },
  {
    id: 52,
    name: "Көмүр сатуу пункту — Сүлүктү",
    region: "Баткен",
    address: "Сүлүктү шаары",
    position: [39.937, 69.567],
  },
  {
    id: 53,
    name: "Көмүр сатуу пункту — Кадамжай",
    region: "Баткен",
    address: "Кадамжай шаары",
    position: [40.127, 71.724],
  },
  {
    id: 54,
    name: "Көмүр сатуу пункту — Раззаков",
    region: "Баткен",
    address: "Раззаков шаары",
    position: [39.838, 69.527],
  },
  {
    id: 55,
    name: "Көмүр сатуу пункту — Чаткал",
    region: "Жалал-Абад",
    address: "Чаткал району",
    position: [41.815, 71.968],
  },
  {
    id: 56,
    name: "Көмүр сатуу пункту — Токтогул",
    region: "Жалал-Абад",
    address: "Токтогул шаары",
    position: [41.874, 72.941],
  },
  {
    id: 57,
    name: "Көмүр сатуу пункту — Ала-Бука",
    region: "Жалал-Абад",
    address: "Ала-Бука айылы",
    position: [41.408, 71.465],
  },
  {
    id: 58,
    name: "Көмүр сатуу пункту — Сузак",
    region: "Жалал-Абад",
    address: "Сузак айылы",
    position: [40.899, 72.904],
  },
  {
    id: 59,
    name: "Көмүр сатуу пункту — Ноокен",
    region: "Жалал-Абад",
    address: "Массы айылы",
    position: [40.69, 72.76],
  },
  {
    id: 60,
    name: "Көмүр сатуу пункту — Аксы",
    region: "Жалал-Абад",
    address: "Кербен аймагы",
    position: [41.493, 71.758],
  },
  {
    id: 61,
    name: "Көмүр сатуу пункту — Лейлек",
    region: "Баткен",
    address: "Лейлек району",
    position: [39.72, 69.9],
  },
  {
    id: 62,
    name: "Көмүр сатуу пункту — Көк-Таш",
    region: "Баткен",
    address: "Көк-Таш аймагы",
    position: [39.98, 70.35],
  },
  {
    id: 63,
    name: "Көмүр сатуу пункту — Тоң",
    region: "Ысык-Көл",
    address: "Тоң району",
    position: [42.165, 76.3],
  },
  {
    id: 64,
    name: "Көмүр сатуу пункту — Жети-Өгүз",
    region: "Ысык-Көл",
    address: "Жети-Өгүз району",
    position: [42.34, 78.01],
  },
  {
    id: 65,
    name: "Көмүр сатуу пункту — Ак-Суу",
    region: "Ысык-Көл",
    address: "Ак-Суу району",
    position: [42.5, 78.52],
  },
  {
    id: 66,
    name: "Көмүр сатуу пункту — Түп району",
    region: "Ысык-Көл",
    address: "Түп району",
    position: [42.727, 78.365],
  },
  {
    id: 67,
    name: "Көмүр сатуу пункту — Москва району",
    region: "Чүй",
    address: "Москва району",
    position: [42.77, 74.08],
  },
  {
    id: 68,
    name: "Көмүр сатуу пункту — Панфилов",
    region: "Чүй",
    address: "Панфилов району",
    position: [42.82, 73.68],
  },
  {
    id: 69,
    name: "Көмүр сатуу пункту — Ысык-Ата",
    region: "Чүй",
    address: "Ысык-Ата району",
    position: [42.78, 74.9],
  },
  {
    id: 70,
    name: "Көмүр сатуу пункту — Чүй району",
    region: "Чүй",
    address: "Чүй району",
    position: [42.82, 75.15],
  },
];

const Contact: FC = () => {
  const [page, setPage] = useState(0);

  useEffect(() => {
    // const interval = setInterval(() => {
    //   setPage((prev) => (prev === 0 ? 1 : 0));
    // }, 5000);
    // return () => clearInterval(interval);
  }, []);

  return (
    <section id="Contact">
      <div className="container">
        <h1 className="header" data-aos="zoom-in" data-aos-duration="700">
          Контакты и Филиалы
        </h1>

        <div className="Contact">
          <div className="Contact--head">
            <div
              className="Contact--head__right"
              data-aos="fade-right"
              data-aos-duration="800"
            >
              <ShieldAlert className="defence" />

              <div className="Contact--head__right--card">
                <h3>Антикоррупция / Телефон доверия</h3>
                <p className="phone">+996 (772) 575 777</p>
                <p className="subtext">E-mail: kyrgyzkomur@gmail.com</p>
              </div>
            </div>

            <div
              className="Contact--head__left"
              data-aos="fade-left"
              data-aos-duration="800"
            >
              <Building2 className="icon" />

              <div className="Contact--head__block--card">
                <h3>Приобретение угля на социальных топливных базах</h3>
                <p className="phone">+996 (509) 222 033</p>
              </div>
            </div>
          </div>
          <div className="Contact--body">
            <div
              className="Contact--body__left"
              data-aos="fade-right"
              data-aos-duration="800"
              data-aos-delay="100"
            >
              <h3>
                <Building2 />
                Основные отделы
              </h3>

              <ul>
                {mainContacts.map((el) => (
                  <li key={el.label}>
                    <span>{el.label}</span>
                    <Link href={toTelHref(el.phone)}>{el.phone}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="Contact--body__right"
              data-aos="fade-left"
              data-aos-duration="800"
              data-aos-delay="100"
            >
              <h3>
                <MapPin />
                Филиалы
              </h3>

              <ul>
                {branches.map((el) => (
                  <li key={el.label}>
                    <span>{el.label}</span>
                    <Link href={toTelHref(el.phone)}>{el.phone}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button onClick={() => setPage(page === 1? 0 : page + 1)}>
            <ChevronRight />
          </button>
          {page === 0 ? (
            <div
              className="Contact--footer"
              data-aos="zoom-in"
              data-aos-duration="800"
            >
              <div className="Contact--footer__head">
                <h3>Мы на карте</h3>

                <Link
                  href="https://go.2gis.com/vJGJM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="Contact--footer__link"
                >
                  <MapPin size={16} />
                  Открыть в 2GIS
                </Link>
              </div>

              <div className="Contact--footer__map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2924.621400134707!2d74.6062892759583!3d42.859726771150996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x389eb633161a2095%3A0xfbb1bbd9c1a3fbf2!2zMjQg0YPQuy4g0JrRg9C70LDRgtC-0LLQsCwg0JHQuNGI0LrQtdC6!5e0!3m2!1sru!2skg!4v1786954653106!5m2!1sru!2skg"
                  style={{ border: 0, width: "100%", height: "100%" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </div>
          ) : null}
          ,
          {page === 1 ? (
            <div
              className="Contact--footer"
              data-aos="fade-right"
              data-aos-duration="800"
              data-aos-delay="100"
            >
              <div className="Contact--footer__map">
                <MapContainer
                  center={position}
                  zoom={7}
                  scrollWheelZoom={true}
                  style={{ height: "500px", width: "100%" }}
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <ChangeMap position={position} />

                  <Marker position={position}>
                    <Popup>📍 {placeName}</Popup>
                  </Marker>

                  {coalBranches.map((branch) => (
                    <Marker
                      key={branch.id}
                      position={branch.position}
                      icon={coalIcon}
                    >
                      <Popup>
                        <strong>{branch.name}</strong>
                        <br />
                        🗺️ {branch.region}
                        <br />
                        📍 {branch.address}
                        {branch.phone && (
                          <>
                            <br />
                            📞 {branch.phone}
                          </>
                        )}
                        <br />
                        🔥 Көмүр сатылат
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          ) : null}
          <button onClick={() => setPage(page > 0 ? page - 1 : 1)}>
            <ChevronLeft />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Contact;
