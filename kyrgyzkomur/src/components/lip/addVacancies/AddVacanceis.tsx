"use client";

import React, { useState, useEffect } from "react";
import "./AddVacanceis.scss";

interface Vacancy {
  id: number;
  title: string;
  description?: string;
  requirements?: string;
  salary?: string;
  department: string;
  image?: string;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
}

const DEPARTMENTS = [
  { id: "central", title: "ЦЕНТРАЛЬНЫЙ АППАРАТ" },
  { id: "kara-keche", title: 'Филиал "КАРА-КЕЧЕ"' },
  { id: "issyk-kul", title: 'Филиал "ИССЫК-КУЛЬСКОЕ ПАРОХОДСТВО"' },
  { id: "yuzhnyi", title: 'Филиал "ЮЖНЫЙ"' },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const VACANCIES_URL = `${API_URL}/vacancy`;

const AddVacanceis = () => {
  const today = new Date().toLocaleDateString("sv-SE");

  const [vacTitle, setVacTitle] = useState("");
  const [vacDescription, setVacDescription] = useState("");
  const [vacRequirements, setVacRequirements] = useState("");
  const [vacSalary, setVacSalary] = useState("");
  const [vacDepartment, setVacDepartment] = useState(DEPARTMENTS[0].id);
  const [vacDate, setVacDate] = useState(today);

  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [vacanciesLoading, setVacanciesLoading] = useState(false);

  const fetchVacancies = async () => {
    setVacanciesLoading(true);
    try {
      const response = await fetch(VACANCIES_URL);
      if (response.ok) {
        const data = await response.json();
        const list: Vacancy[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.vacancies)
            ? data.vacancies
            : [];
        setVacancies(list);
      } else {
        console.error("Вакансияларды алуу катасы, status:", response.status);
      }
    } catch (error) {
      console.error("Вакансияларды алууда ката чыкты:", error);
    } finally {
      setVacanciesLoading(false);
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, []);

  const cleanText = (text: string) => text.replace(/\u00a0/g, " ").trim();

  const handleVacancySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vacTitle) {
      alert("Вакансиянын аталышын жазыңыз!");
      return;
    }

    try {
      const response = await fetch(VACANCIES_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: cleanText(vacTitle),
          description: cleanText(vacDescription),
          requirements: cleanText(vacRequirements),
          salary: cleanText(vacSalary),
          department: vacDepartment,
          date: vacDate ? new Date(vacDate).toISOString() : null,
          createdAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        const createdVacancy: Vacancy = responseData.vacancy ?? responseData;

        setVacancies((prev) => [...prev, createdVacancy]);

        alert("Вакансия ийгиликтүү кошулду!");
        setVacTitle("");
        setVacDescription("");
        setVacRequirements("");
        setVacSalary("");
        setVacDepartment(DEPARTMENTS[0].id);
        setVacDate(today);
      } else {
        const errorData = await response.json();
        alert(`Ката: ${errorData.message || "Вакансия кошулган жок"}`);
      }
    } catch (error) {
      console.error("Жөнөтүүдө ката чыкты:", error);
      alert("Серверге туташууда ката чыкты!");
    }
  };

  const handleDeleteVacancy = async (id: number) => {
    if (!window.confirm("Бул вакансияны өчүрүүнү каалайсызбы?")) return;

    try {
      const response = await fetch(`${VACANCIES_URL}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setVacancies((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("Өчүрүүдө ката чыкты!");
      }
    } catch (error) {
      console.error("Өчүрүүдө ката:", error);
    }
  };

  const departmentTitle = (id: string) =>
    DEPARTMENTS.find((d) => d.id === id)?.title || id;

  return (
    <div className="adminGrid">
      <form
        className="modernForm"
        onSubmit={handleVacancySubmit}
        data-aos="fade-up"
        data-aos-duration="3000"
      >
        <div className="sectionTitle">Вакансия маалыматтары</div>

        <div className="formGroup">
          <label>Бөлүм / Филиал</label>
          <select
            value={vacDepartment}
            onChange={(e) => setVacDepartment(e.target.value)}
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.title}
              </option>
            ))}
          </select>
        </div>

        <div className="formGroup">
          <label>Вакансиянын аталышы</label>
          <input
            type="text"
            placeholder="Мисалы: Тоолук инженер"
            value={vacTitle}
            onChange={(e) => setVacTitle(e.target.value)}
          />
        </div>

        <div className="formGroup">
          <label>Сүрөттөмөсү</label>
          <textarea
            rows={3}
            placeholder="Вакансия жөнүндө кыскача маалымат..."
            value={vacDescription}
            onChange={(e) => setVacDescription(e.target.value)}
          />
        </div>

        <div className="formGroup">
          <label>Талаптар (ар бирин жаңы саптан жазыңыз)</label>
          <textarea
            rows={4}
            placeholder={"Жогорку билим...\nИш тажрыйба 2 жыл..."}
            value={vacRequirements}
            onChange={(e) => setVacRequirements(e.target.value)}
          />
        </div>

        <div className="formRow">
          <div className="formGroup flex1">
            <label>Эмгек акы</label>
            <input
              type="text"
              placeholder="Мисалы: 30 000 - 50 000 сом"
              value={vacSalary}
              onChange={(e) => setVacSalary(e.target.value)}
            />
          </div>
          <div className="formGroup flex1">
            <label>Датасы</label>
            <input
              type="date"
              value={vacDate}
              min={today}
              onChange={(e) => setVacDate(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="saveBtn">
          Вакансияны сайтка чыгаруу
        </button>
      </form>

      <div className="livePreview" data-aos="fade-up" data-aos-duration="3000">
        <h3>Сайттагы көрүнүшү:</h3>
        {vacanciesLoading && <p className="emptyText">Жүктөлүп жатат...</p>}
        {!vacanciesLoading && vacancies.length === 0 ? (
          <p className="emptyText">Азырынча кошула элек...</p>
        ) : (
          vacancies.map((item) => (
            <div className="card" key={item.id}>
              <div className="bodyBox">
                <span className="excerpt">
                  <strong>Бөлүм:</strong> {departmentTitle(item.department)}
                </span>
                <h2 className="title">{item.title}</h2>
                <p className="excerpt">{item.description}</p>
                {item.requirements && (
                  <p className="excerpt">
                    <strong>Талаптар:</strong> {item.requirements}
                  </p>
                )}
                {item.salary && (
                  <p className="excerpt">
                    <strong>Эмгек акы:</strong> {item.salary}
                  </p>
                )}
              </div>
              <div className="footerBox">
                <span>
                  {item.date
                    ? new Date(item.date).toLocaleDateString()
                    : item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : ""}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteVacancy(item.id)}
                  style={{
                    marginLeft: "12px",
                    background: "#fee2e2",
                    color: "#dc2626",
                    border: "none",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Өчүрүү
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AddVacanceis;
