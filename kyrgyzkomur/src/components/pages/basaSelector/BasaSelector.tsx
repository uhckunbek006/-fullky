"use client";

import { FC, useEffect, useState } from "react";
import { MapPin, Phone, Clock, Navigation } from "lucide-react";
// import "./BaseSelector.scss";
import "./BasaSelector.scss";
import AOS from "aos";
import "aos/dist/aos.css";
export type CoalBase = {
  id: string;
  name: string;
  address: string;
  region: string;
  lat: number;
  lng: number;
  phone: string;
  workHours: string;
  distance?: number;
};

export const COAL_BASES: CoalBase[] = [
  {
    id: "1",
    name: "Кыргызкөмүр — Кыргыз / Айланма жол",
    region: "Бишкек",
    address: "Кыргыз / Айланма жол көч., контур №902",
    lat: 42.85,
    lng: 74.52,
    phone: "0505-28-07-02",
    workHours: "08:00 - 18:00",
  },
  {
    id: "2",
    name: "Кыргызкөмүр — Мурманская",
    region: "Бишкек",
    address: "Мурманская көч., 1Б",
    lat: 42.84,
    lng: 74.57,
    phone: "0705-71-87-71",
    workHours: "08:00 - 18:00",
  },
  {
    id: "3",
    name: "Кыргызкөмүр — Сарыкулаков",
    region: "Бишкек",
    address: "Сарыкулаков көч., 6Б (Алыкулов)",
    lat: 42.84,
    lng: 74.55,
    phone: "0709-99-06-53",
    workHours: "08:00 - 18:00",
  },
  {
    id: "4",
    name: "Кыргызкөмүр — Достоевский / Анкара",
    region: "Бишкек",
    address: "Достоевский — Анкара, 97К",
    lat: 42.85,
    lng: 74.62,
    phone: "0705-41-48-03",
    workHours: "08:00 - 18:00",
  },
  {
    id: "5",
    name: "Кыргызкөмүр — Кара-Жыгач",
    region: "Бишкек",
    address: "Оберон — Сары-Өзөн көчөлөрүнүн кесилиши",
    lat: 42.88,
    lng: 74.66,
    phone: "0709-40-40-51",
    workHours: "08:00 - 18:00",
  },
  {
    id: "6",
    name: "Кыргызкөмүр — Көк-Жар",
    region: "Бишкек",
    address: "Көк-Жар, Полевая көчөсү (МТФ)",
    lat: 42.84,
    lng: 74.67,
    phone: "0557-09-99-11",
    workHours: "08:00 - 18:00",
  },
  {
    id: "7",
    name: "Кыргызкөмүр — Көк-Жар Мадиев",
    region: "Бишкек",
    address: "Көк-Жар, Мадиев көч., 38",
    lat: 42.83,
    lng: 74.66,
    phone: "0703-97-96-80",
    workHours: "08:00 - 18:00",
  },
  {
    id: "8",
    name: "Кыргызкөмүр — Калыс-Ордо",
    region: "Бишкек",
    address: "Айланма жол, контур №327",
    lat: 42.93,
    lng: 74.56,
    phone: "0507-04-56-78",
    workHours: "08:00 - 18:00",
  },
  {
    id: "9",
    name: "Кыргызкөмүр — Ак-Жар",
    region: "Бишкек",
    address: "Ак-Жар, Айланма жол, контур №1604",
    lat: 42.91,
    lng: 74.68,
    phone: "0700-22-33-71",
    workHours: "08:00 - 18:00",
  },
  {
    id: "10",
    name: "Кыргызкөмүр — Айланма жол / Кыргыз",
    region: "Бишкек",
    address: "Айланма жол — Кыргыз көч., контур №818",
    lat: 42.88,
    lng: 74.54,
    phone: "0706-72-44-44",
    workHours: "08:00 - 18:00",
  },
  {
    id: "11",
    name: "Кыргызкөмүр — Лебединовка",
    region: "Бишкек",
    address: "Лебединовка, Калинина көч., 1-линия 8/1",
    lat: 42.87,
    lng: 74.65,
    phone: "0501-11-11-86",
    workHours: "08:00 - 18:00",
  },
  {
    id: "12",
    name: "Кыргызкөмүр — Ленинское",
    region: "Бишкек",
    address: "Ленинское айылы, Айланма жол, контур №963",
    lat: 42.78,
    lng: 74.52,
    phone: "0705-72-57-55",
    workHours: "08:00 - 18:00",
  },
  {
    id: "13",
    name: "Көмүр сатуу пункту — Токмок",
    region: "Чүй",
    address: "Токмок шаары",
    lat: 42.841,
    lng: 75.301,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "14",
    name: "Көмүр сатуу пункту — Кемин",
    region: "Чүй",
    address: "Кемин шаары",
    lat: 42.786,
    lng: 75.691,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "15",
    name: "Көмүр сатуу пункту — Кант",
    region: "Чүй",
    address: "Кант шаары",
    lat: 42.891,
    lng: 74.85,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "16",
    name: "Көмүр сатуу пункту — Сокулук",
    region: "Чүй",
    address: "Сокулук айылы",
    lat: 42.872,
    lng: 74.309,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "17",
    name: "Көмүр сатуу пункту — Кара-Балта",
    region: "Чүй",
    address: "Кара-Балта шаары",
    lat: 42.814,
    lng: 73.848,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "18",
    name: "Көмүр сатуу пункту — Шопоков",
    region: "Чүй",
    address: "Шопоков шаары",
    lat: 42.838,
    lng: 74.322,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "19",
    name: "Көмүр сатуу пункту — Беловодское",
    region: "Чүй",
    address: "Беловодское айылы",
    lat: 42.833,
    lng: 74.109,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "20",
    name: "Көмүр сатуу пункту — Ивановка",
    region: "Чүй",
    address: "Ивановка айылы",
    lat: 42.887,
    lng: 75.08,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "21",
    name: "Көмүр сатуу пункту — Каракол",
    region: "Ысык-Көл",
    address: "Каракол шаары",
    lat: 42.49,
    lng: 78.393,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "22",
    name: "Көмүр сатуу пункту — Балыкчы",
    region: "Ысык-Көл",
    address: "Балыкчы шаары",
    lat: 42.46,
    lng: 76.185,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "23",
    name: "Көмүр сатуу пункту — Чолпон-Ата",
    region: "Ысык-Көл",
    address: "Чолпон-Ата шаары",
    lat: 42.649,
    lng: 77.082,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "24",
    name: "Көмүр сатуу пункту — Түп",
    region: "Ысык-Көл",
    address: "Түп айылы",
    lat: 42.727,
    lng: 78.365,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "25",
    name: "Көмүр сатуу пункту — Боконбаево",
    region: "Ысык-Көл",
    address: "Боконбаево айылы",
    lat: 42.117,
    lng: 76.993,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "26",
    name: "Көмүр сатуу пункту — Кочкор",
    region: "Ысык-Көл",
    address: "Кочкор айылы",
    lat: 42.215,
    lng: 75.756,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "27",
    name: "Көмүр сатуу пункту — Нарын",
    region: "Нарын",
    address: "Нарын шаары",
    lat: 41.428,
    lng: 75.991,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "28",
    name: "Көмүр сатуу пункту — Ат-Башы",
    region: "Нарын",
    address: "Ат-Башы айылы",
    lat: 41.169,
    lng: 75.81,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "29",
    name: "Көмүр сатуу пункту — Жумгал",
    region: "Нарын",
    address: "Чаек айылы",
    lat: 41.893,
    lng: 74.427,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "30",
    name: "Көмүр сатуу пункту — Кочкор",
    region: "Нарын",
    address: "Кочкор айылы",
    lat: 42.215,
    lng: 75.756,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "31",
    name: "Көмүр сатуу пункту — Ак-Талаа",
    region: "Нарын",
    address: "Баетов айылы",
    lat: 41.493,
    lng: 74.698,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "32",
    name: "Көмүр сатуу пункту — Талас",
    region: "Талас",
    address: "Талас шаары",
    lat: 42.522,
    lng: 72.242,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "33",
    name: "Көмүр сатуу пункту — Бакай-Ата",
    region: "Талас",
    address: "Бакай-Ата айылы",
    lat: 42.489,
    lng: 72.812,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "34",
    name: "Көмүр сатуу пункту — Манас",
    region: "Талас",
    address: "Покровка айылы",
    lat: 42.514,
    lng: 72.748,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "35",
    name: "Көмүр сатуу пункту — Кара-Буура",
    region: "Талас",
    address: "Кызыл-Адыр айылы",
    lat: 42.628,
    lng: 71.593,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "36",
    name: "Көмүр сатуу пункту — Жалал-Абад",
    region: "Жалал-Абад",
    address: "Жалал-Абад шаары",
    lat: 40.933,
    lng: 73.0,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "37",
    name: "Көмүр сатуу пункту — Таш-Көмүр",
    region: "Жалал-Абад",
    address: "Таш-Көмүр шаары",
    lat: 41.346,
    lng: 72.231,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "38",
    name: "Көмүр сатуу пункту — Кара-Көл",
    region: "Жалал-Абад",
    address: "Кара-Көл шаары",
    lat: 41.602,
    lng: 72.671,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "39",
    name: "Көмүр сатуу пункту — Майлуу-Суу",
    region: "Жалал-Абад",
    address: "Майлуу-Суу шаары",
    lat: 41.24,
    lng: 72.45,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "40",
    name: "Көмүр сатуу пункту — Кочкор-Ата",
    region: "Жалал-Абад",
    address: "Кочкор-Ата шаары",
    lat: 40.545,
    lng: 72.8,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "41",
    name: "Көмүр сатуу пункту — Базар-Коргон",
    region: "Жалал-Абад",
    address: "Базар-Коргон шаары",
    lat: 41.037,
    lng: 72.747,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "42",
    name: "Көмүр сатуу пункту — Кербен",
    region: "Жалал-Абад",
    address: "Кербен шаары",
    lat: 41.493,
    lng: 71.758,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "43",
    name: "Көмүр сатуу пункту — Ош",
    region: "Ош",
    address: "Ош шаары",
    lat: 40.513,
    lng: 72.816,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "44",
    name: "Көмүр сатуу пункту — Кара-Суу",
    region: "Ош",
    address: "Кара-Суу шаары",
    lat: 40.705,
    lng: 72.867,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "45",
    name: "Көмүр сатуу пункту — Өзгөн",
    region: "Ош",
    address: "Өзгөн шаары",
    lat: 40.769,
    lng: 73.3,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "46",
    name: "Көмүр сатуу пункту — Ноокат",
    region: "Ош",
    address: "Ноокат шаары",
    lat: 40.265,
    lng: 72.619,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "47",
    name: "Көмүр сатуу пункту — Араван",
    region: "Ош",
    address: "Араван айылы",
    lat: 40.516,
    lng: 72.498,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "48",
    name: "Көмүр сатуу пункту — Кара-Кулжа",
    region: "Ош",
    address: "Кара-Кулжа айылы",
    lat: 40.637,
    lng: 73.452,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "49",
    name: "Көмүр сатуу пункту — Гүлчө",
    region: "Ош",
    address: "Гүлчө айылы",
    lat: 40.313,
    lng: 73.449,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "50",
    name: "Көмүр сатуу пункту — Баткен",
    region: "Баткен",
    address: "Баткен шаары",
    lat: 40.062,
    lng: 70.819,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "51",
    name: "Көмүр сатуу пункту — Кызыл-Кыя",
    region: "Баткен",
    address: "Кызыл-Кыя шаары",
    lat: 40.256,
    lng: 72.127,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "52",
    name: "Көмүр сатуу пункту — Сүлүктү",
    region: "Баткен",
    address: "Сүлүктү шаары",
    lat: 39.937,
    lng: 69.567,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "53",
    name: "Көмүр сатуу пункту — Кадамжай",
    region: "Баткен",
    address: "Кадамжай шаары",
    lat: 40.127,
    lng: 71.724,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "54",
    name: "Көмүр сатуу пункту — Раззаков",
    region: "Баткен",
    address: "Раззаков шаары",
    lat: 39.838,
    lng: 69.527,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "55",
    name: "Көмүр сатуу пункту — Чаткал",
    region: "Жалал-Абад",
    address: "Чаткал району",
    lat: 41.815,
    lng: 71.968,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "56",
    name: "Көмүр сатуу пункту — Токтогул",
    region: "Жалал-Абад",
    address: "Токтогул шаары",
    lat: 41.874,
    lng: 72.941,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "57",
    name: "Көмүр сатуу пункту — Ала-Бука",
    region: "Жалал-Абад",
    address: "Ала-Бука айылы",
    lat: 41.408,
    lng: 71.465,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "58",
    name: "Көмүр сатуу пункту — Сузак",
    region: "Жалал-Абад",
    address: "Сузак айылы",
    lat: 40.899,
    lng: 72.904,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "59",
    name: "Көмүр сатуу пункту — Ноокен",
    region: "Жалал-Абад",
    address: "Массы айылы",
    lat: 40.69,
    lng: 72.76,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "60",
    name: "Көмүр сатуу пункту — Аксы",
    region: "Жалал-Абад",
    address: "Кербен аймагы",
    lat: 41.493,
    lng: 71.758,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "61",
    name: "Көмүр сатуу пункту — Лейлек",
    region: "Баткен",
    address: "Лейлек району",
    lat: 39.72,
    lng: 69.9,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "62",
    name: "Көмүр сатуу пункту — Көк-Таш",
    region: "Баткен",
    address: "Көк-Таш аймагы",
    lat: 39.98,
    lng: 70.35,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "63",
    name: "Көмүр сатуу пункту — Тоң",
    region: "Ысык-Көл",
    address: "Тоң району",
    lat: 42.165,
    lng: 76.3,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "64",
    name: "Көмүр сатуу пункту — Жети-Өгүз",
    region: "Ысык-Көл",
    address: "Жети-Өгүз району",
    lat: 42.34,
    lng: 78.01,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "65",
    name: "Көмүр сатуу пункту — Ак-Суу",
    region: "Ысык-Көл",
    address: "Ак-Суу району",
    lat: 42.5,
    lng: 78.52,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "66",
    name: "Көмүр сатуу пункту — Түп району",
    region: "Ысык-Көл",
    address: "Түп району",
    lat: 42.727,
    lng: 78.365,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "67",
    name: "Көмүр сатуу пункту — Москва району",
    region: "Чүй",
    address: "Москва району",
    lat: 42.77,
    lng: 74.08,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "68",
    name: "Көмүр сатуу пункту — Панфилов",
    region: "Чүй",
    address: "Панфилов району",
    lat: 42.82,
    lng: 73.68,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "69",
    name: "Көмүр сатуу пункту — Ысык-Ата",
    region: "Чүй",
    address: "Ысык-Ата району",
    lat: 42.78,
    lng: 74.9,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
  {
    id: "70",
    name: "Көмүр сатуу пункту — Чүй району",
    region: "Чүй",
    address: "Чүй району",
    lat: 42.82,
    lng: 75.15,
    phone: "Көрсөтүлгөн эмес",
    workHours: "08:00 - 18:00",
  },
];

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

interface BaseSelectorProps {
  onSelectBase: (base: CoalBase) => void;
}

const BaseSelector: FC<BaseSelectorProps> = ({ onSelectBase }) => {
  const [bases, setBases] = useState<CoalBase[]>(COAL_BASES);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          const sortedBases = COAL_BASES.map((base) => ({
            ...base,
            distance: calculateDistance(userLat, userLng, base.lat, base.lng),
          })).sort((a, b) => (a.distance || 0) - (b.distance || 0));

          setBases(sortedBases);
        },
        (error) => {
          console.warn("Геолокация алынган жок:", error.message);
        },
      );
    }
  }, []);

  const filteredBases = bases.filter(
    (base) =>
      base.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      base.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      base.region.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
    });
  }, []);
  return (
    <div className="BaseSelector">
      <div className="BaseSelector--header" data-aos="fade-down">
        <MapPin className="icon" size={20} />
        <div>
          <h4>Выберите ближайшую базу.</h4>
          <p>
            Пожалуйста, укажите пункт, из которого вы самостоятельно заберете
            уголь.
          </p>
        </div>
      </div>

      <div
        className="BaseSelector--search"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по городам Ош, Бишкек или районам..."
        />
      </div>

      <div className="BaseSelector--list">
        {filteredBases.map((base, index) => {
          const isSelected = selectedId === base.id;
          const isNearest = index === 0 && base.distance !== undefined;

          return (
            <div
              key={base.id}
              className={`BaseSelector--card ${isSelected ? "selected" : ""}`}
              onClick={() => {
                setSelectedId(base.id);
                onSelectBase(base);
              }}
              data-aos="fade-up"
              data-aos-delay={index * 100} // Карточкалар биринен сала экинчиси пайда болушу үчүн delay коштук
            >
              <div className="BaseSelector--card_head">
                <span className="region">{base.region}</span>
                {base.distance !== undefined && (
                  <span className="distance">
                    <Navigation size={12} /> ~{base.distance} км
                  </span>
                )}
              </div>

              <h5>
                {base.name}{" "}
                {isNearest && <span className="badge">Ближайший</span>}
              </h5>

              <div className="BaseSelector--card_info">
                <div>
                  <MapPin size={14} /> <span>{base.address}</span>
                </div>
                <div>
                  <Phone size={14} /> <span>{base.phone}</span>
                </div>
                <div>
                  <Clock size={14} /> <span>{base.workHours}</span>
                </div>
              </div>

              <button type="button" className="select-btn">
                {isSelected ? "Выбрано" : "Выбор этой базы"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BaseSelector;
