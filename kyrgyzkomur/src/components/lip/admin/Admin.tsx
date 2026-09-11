"use client";

import React, { useState, useEffect } from "react";
import "./Admin.scss";
import AddVacanceis from "../addVacancies/AddVacanceis";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
interface ArticleItem {
  id: number;
  title: string;
  category: string;
  excerpt: string;
  mainImage: string;
  contentImage?: string;
  date: string;
  fullTitle: string;
  paragraphs: string[];
}

interface UserItem {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

interface VacancyItem {
  id: number;
  title: string;
  description: string;
  requirements?: string;
  salary?: string;
  date: string;
}

export default function Admin() {
  const [page, setPage] = useState(0);

  const [articles, setArticles] = useState<ArticleItem[]>([]);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("НОВОСТИ");
  const [excerpt, setExcerpt] = useState("");
  const [fullTitle, setFullTitle] = useState("");
  const [fullText, setFullText] = useState("");
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const today = new Date().toISOString().split("T")[0];

  const [mainImgMode, setMainImgMode] = useState<"file" | "url">("file");
  const [mainImage, setMainImage] = useState<string>("");
  const [mainImageUrlInput, setMainImageUrlInput] = useState<string>("");

  const [contentImgMode, setContentImgMode] = useState<"file" | "url">("file");
  const [contentImage, setContentImage] = useState<string>("");
  const [contentImageUrlInput, setContentImageUrlInput] = useState<string>("");

  const loadFromBackend = async () => {
    try {
      const res = await fetch(`${API_URL}/products/get`);
      const data = await res.json();
      const mapped: ArticleItem[] = data.map((p: any) => ({
        id: p.id,
        title: p.title,
        category: "НОВОСТИ",
        excerpt: p.description,
        mainImage: p.image || "",
        contentImage: "",
        date: p.date
          ? new Date(p.date).toLocaleDateString("ru-RU")
          : new Date().toLocaleDateString("ru-RU"),
        fullTitle: p.title,
        paragraphs: [p.description],
      }));
      setArticles(mapped);
    } catch (err) {
      console.error("Жүктөөдө ката:", err);
    }
  };

  const handleMainFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImage(URL.createObjectURL(file));
    }
  };

  const handleMainUrlAdd = () => {
    if (mainImageUrlInput.trim()) {
      setMainImage(mainImageUrlInput.trim());
      setMainImageUrlInput("");
    }
  };

  const handleContentFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setContentImage(URL.createObjectURL(file));
    }
  };

  const handleContentUrlAdd = () => {
    if (contentImageUrlInput.trim()) {
      setContentImage(contentImageUrlInput.trim());
      setContentImageUrlInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !excerpt || !fullTitle || !fullText || !mainImage) {
      alert("Сураныч, негизги талааларды жана башкы сүрөттү кошуңуз!");
      return;
    }

    const paragraphsArray = fullText.split("\n").filter((p) => p.trim() !== "");

    try {
      const res = await fetch(`${API_URL}/products/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
        body: JSON.stringify({
          title,
          description: excerpt,
          image: mainImage,
          date: date ? new Date(date).toISOString() : new Date().toISOString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Backend'ге сактоодо ката чыкты");
        return;
      }
    } catch (err) {
      console.error("Backend'ге жиберүүдө ката:", err);
      alert("Backend менен байланышта ката чыкты");
      return;
    }

    const newArticle: ArticleItem = {
      id: Date.now(),
      title,
      category,
      excerpt,
      mainImage,
      contentImage,
      date: new Date().toLocaleDateString("ru-RU"),
      fullTitle,
      paragraphs: paragraphsArray,
    };

    setArticles([newArticle, ...articles]);

    setTitle("");
    setExcerpt("");
    setFullTitle("");
    setFullText("");
    setMainImage("");
    setContentImage("");
    setDate(today);
    alert("Жаңылык ийгиликтүү кошулду!");
  };

  const [users, setUsers] = useState<UserItem[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [hoveredUserId, setHoveredUserId] = useState<number | null>(null);

  const loadUsers = async () => {
    setUsersLoading(true);
    setUsersError("");
    try {
      const res = await fetch(`${API_URL}/admin/panel`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        setUsersError(data.detail || data.message || "Ката чыкты");
        return;
      }
      setUsers(data.allUsers || []);
    } catch (err) {
      console.error("Колдонуучуларды жүктөөдө ката:", err);
      setUsersError("Backend менен байланышта ката чыкты");
    } finally {
      setUsersLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    const confirmMsg =
      newRole === "ADMIN"
        ? "Бул колдонуучуга АДМИН укугун бергиңиз келеби?"
        : "Бул колдонуучудан АДМИН укугун алып салгыңыз келеби?";
    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Ката чыкты");
        return;
      }
      alert("Ролу ийгиликтүү өзгөртүлдү!");
      loadUsers();
    } catch (err) {
      console.error("Ролду өзгөртүүдө ката:", err);
      alert("Backend менен байланышта ката чыкты");
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (
      !confirm(
        "Бул колдонуучуну өчүргүңүз келеби? Бул аракетти кайтарууга болбойт!",
      )
    )
      return;

    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Ката чыкты");
        return;
      }
      alert("Колдонуучу өчүрүлдү!");
      loadUsers();
    } catch (err) {
      console.error("Колдонуучуну өчүрүүдө ката:", err);
      alert("Backend менен байланышта ката чыкты");
    }
  };

  const [vacTitle, setVacTitle] = useState("");
  const [vacDescription, setVacDescription] = useState("");
  const [vacRequirements, setVacRequirements] = useState("");
  const [vacSalary, setVacSalary] = useState("");
  const [vacDate, setVacDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );

  const [vacancies, setVacancies] = useState<VacancyItem[]>([]);
  const [vacanciesLoading, setVacanciesLoading] = useState(false);

  const loadVacancies = async () => {
    setVacanciesLoading(true);
    try {
      const res = await fetch(`${API_URL}/vacancies/get`);
      const data = await res.json();
      const mapped: VacancyItem[] = (Array.isArray(data) ? data : []).map(
        (v: any) => ({
          id: v.id,
          title: v.title,
          description: v.description,
          requirements: v.requirements || "",
          salary: v.salary || "",
          date: v.date
            ? new Date(v.date).toLocaleDateString("ru-RU")
            : new Date().toLocaleDateString("ru-RU"),
        }),
      );
      setVacancies(mapped);
    } catch (err) {
      console.error("Вакансияларды жүктөөдө ката:", err);
    } finally {
      setVacanciesLoading(false);
    }
  };

  const handleVacancySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vacTitle || !vacDescription) {
      alert("Сураныч, вакансиянын аталышын жана сүрөттөмөсүн толтуруңуз!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/vacancies/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
        body: JSON.stringify({
          title: vacTitle,
          description: vacDescription,
          requirements: vacRequirements,
          salary: vacSalary,
          date: vacDate
            ? new Date(vacDate).toISOString()
            : new Date().toISOString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Backend'ге сактоодо ката чыкты");
        return;
      }

      const newVacancy: VacancyItem = {
        id: data.id || Date.now(),
        title: vacTitle,
        description: vacDescription,
        requirements: vacRequirements,
        salary: vacSalary,
        date: new Date().toLocaleDateString("ru-RU"),
      };
      setVacancies([newVacancy, ...vacancies]);
    } catch (err) {
      console.error("Вакансияны жиберүүдө ката:", err);
      alert("Backend менен байланышта ката чыкты");
      return;
    }

    setVacTitle("");
    setVacDescription("");
    setVacRequirements("");
    setVacSalary("");
    setVacDate(today);
    alert("Вакансия ийгиликтүү кошулду!");
  };

  const handleDeleteVacancy = async (vacancyId: number) => {
    if (!confirm("Бул вакансияны өчүргүңүз келеби?")) return;

    try {
      const res = await fetch(`${API_URL}/vacancies/${vacancyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Ката чыкты");
        return;
      }
      alert("Вакансия өчүрүлдү!");
      loadVacancies();
    } catch (err) {
      console.error("Вакансияны өчүрүүдө ката:", err);
      alert("Backend менен байланышта ката чыкты");
    }
  };

  useEffect(() => {
    loadFromBackend();
  }, []);

  useEffect(() => {
    if (page === 1) {
      loadUsers();
    }
    if (page === 2) {
      loadVacancies();
    }
  }, [page]);

  return (
    <div className="adminDashboard">
      <div className="dashboardHeader">
        <h1>
          Панель управления{" "}
          <span>
            {page === 0
              ? "/ Жаңылык кошуу"
              : page === 1
                ? "/ Катталган колдонуучулар"
                : "/ Вакансия кошуу"}
          </span>
        </h1>

        <nav style={{ marginTop: "12px" }}>
          <button
            type="button"
            onClick={() => setPage(0)}
            style={{
              marginRight: "16px",
              fontWeight: 600,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: page === 0 ? "#2563eb" : "#475569",
              textDecoration: page === 0 ? "underline" : "none",
              fontSize: "14px",
              padding: 0,
            }}
          >
            Жаңылык кошуу
          </button>
          <button
            type="button"
            onClick={() => setPage(1)}
            style={{
              marginRight: "16px",
              fontWeight: 600,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: page === 1 ? "#2563eb" : "#475569",
              textDecoration: page === 1 ? "underline" : "none",
              fontSize: "14px",
              padding: 0,
            }}
          >
            Колдонуучулар
          </button>
          <button
            type="button"
            onClick={() => setPage(2)}
            style={{
              fontWeight: 600,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: page === 2 ? "#2563eb" : "#475569",
              textDecoration: page === 2 ? "underline" : "none",
              fontSize: "14px",
              padding: 0,
            }}
          >
            Вакансия кошуу
          </button>
        </nav>
      </div>

      {page === 0 ? (
        <div className="adminGrid">
          <form
            className="modernForm"
            onSubmit={handleSubmit}
            data-aos="fade-up"
            data-aos-duration="3000"
          >
            <div className="sectionTitle">1. Негизги маалыматтар</div>

            <div className="formRow">
              <div className="formGroup flex1">
                <label>Категория</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <div className="formGroup flex2">
                <label>Заголовок (Карточкадагы аты)</label>
                <input
                  type="text"
                  placeholder="Мисалы: Көмүр кампаларда сатылып баштады"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            <div className="formGroup">
              <label>Датасы</label>
              <input
                type="date"
                value={date}
                min={today}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="formGroup">
              <label>Кыскача сүрөттөмөсү</label>
              <textarea
                rows={2}
                placeholder="«Кыргызкөмүр» кампаларда калкка көмүр сатууну баштады..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
              />
            </div>

            <div className="sectionTitle">2. Башкы сүрөт (Главное фото)</div>

            <div className="formGroup">
              <div className="modeTabs">
                <button
                  type="button"
                  className={mainImgMode === "file" ? "active" : ""}
                  onClick={() => setMainImgMode("file")}
                >
                  📁 Папкадан таңдоо
                </button>
                <button
                  type="button"
                  className={mainImgMode === "url" ? "active" : ""}
                  onClick={() => setMainImgMode("url")}
                >
                  🔗 Ссылка чаптоо
                </button>
              </div>

              {mainImgMode === "file" ? (
                <div className="fileDropzone">
                  <input
                    type="file"
                    accept="image/*"
                    id="mainFileInput"
                    onChange={handleMainFileSelect}
                  />
                  <label htmlFor="mainFileInput" className="dropzoneLabel">
                    📷 Папкадан башкы сүрөт тандоо
                  </label>
                </div>
              ) : (
                <div className="urlInputBox">
                  <input
                    type="text"
                    placeholder="https://site.com/image.jpg"
                    value={mainImageUrlInput}
                    onChange={(e) => setMainImageUrlInput(e.target.value)}
                  />
                  <button type="button" onClick={handleMainUrlAdd}>
                    Кошуу
                  </button>
                </div>
              )}

              {mainImage && (
                <div className="previewBox">
                  <img src={mainImage} alt="Main Preview" />
                  <button type="button" onClick={() => setMainImage("")}>
                    ✕
                  </button>
                </div>
              )}
            </div>

            <div className="sectionTitle">
              3. Макаланын мазмуну жана ички сүрөт
            </div>

            <div className="formGroup">
              <label>Толук макаланын башы (Заголовок)</label>
              <input
                type="text"
                placeholder="Кышка даярдык эрте башталды: калк үчүн көмүр даяр"
                value={fullTitle}
                onChange={(e) => setFullTitle(e.target.value)}
              />
            </div>

            <div className="formGroup">
              <label>Толук текст</label>
              <textarea
                rows={5}
                placeholder="Ар бир абзацты жаңы саптан жазыңыз..."
                value={fullText}
                onChange={(e) => setFullText(e.target.value)}
              />
            </div>

            <div className="formGroup">
              <label>Макаланын ичине сүрөт кошуу (Опционально)</label>
              <div className="modeTabs">
                <button
                  type="button"
                  className={contentImgMode === "file" ? "active" : ""}
                  onClick={() => setContentImgMode("file")}
                >
                  📁 Папкадан таңдоо
                </button>
                <button
                  type="button"
                  className={contentImgMode === "url" ? "active" : ""}
                  onClick={() => setContentImgMode("url")}
                >
                  🔗 Ссылка чаптоо
                </button>
              </div>

              {contentImgMode === "file" ? (
                <div className="fileDropzone">
                  <input
                    type="file"
                    accept="image/*"
                    id="contentFileInput"
                    onChange={handleContentFileSelect}
                  />
                  <label htmlFor="contentFileInput" className="dropzoneLabel">
                    🖼️ Ички сүрөттү файлдан тандоо
                  </label>
                </div>
              ) : (
                <div className="urlInputBox">
                  <input
                    type="text"
                    placeholder="https://site.com/inner-photo.jpg"
                    value={contentImageUrlInput}
                    onChange={(e) => setContentImageUrlInput(e.target.value)}
                  />
                  <button type="button" onClick={handleContentUrlAdd}>
                    Кошуу
                  </button>
                </div>
              )}

              {contentImage && (
                <div className="previewBox">
                  <img src={contentImage} alt="Content Preview" />
                  <button type="button" onClick={() => setContentImage("")}>
                    ✕
                  </button>
                </div>
              )}
            </div>

            <button type="submit" className="saveBtn">
              Жаңылыкты сайтка чыгаруу
            </button>
          </form>

          <div
            className="livePreview"
            data-aos="fade-up"
            data-aos-duration="3000"
          >
            <h3>Сайттагы көрүнүшү:</h3>
            {articles.length === 0 ? (
              <p className="emptyText">Азырынча кошула элек...</p>
            ) : (
              articles.map((item) => (
                <div className="card" key={item.id}>
                  <div className="imageBox">
                    <img src={item.mainImage} alt={item.title} />
                    <span className="badge">{item.category}</span>
                  </div>
                  <div className="bodyBox">
                    <h2 className="title">{item.title}</h2>
                    <p className="excerpt">{item.excerpt}</p>

                    {item.contentImage && (
                      <div className="innerImgBox">
                        <img src={item.contentImage} alt="Inner content" />
                      </div>
                    )}

                    <span className="readMore">КЕНЕНИРЭЭК ОКУУ »</span>
                  </div>
                  <div className="footerBox">
                    <span>{item.date}</span> • <span>Комментарийлер жок</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : page === 1 ? (
        <div style={{ marginTop: "20px" }}>
          {usersLoading && <p>Жүктөлүп жатат...</p>}
          {usersError && <p style={{ color: "red" }}>{usersError}</p>}

          {!usersLoading && !usersError && (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "#fff",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 10px 25px rgba(0,0,0,0.03)",
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "2px solid #e2e8f0",
                    textAlign: "left",
                  }}
                >
                  <th style={{ padding: "12px" }}>ID</th>
                  <th style={{ padding: "12px" }}>Колдонуучу аты</th>
                  <th style={{ padding: "12px" }}>Email</th>
                  <th style={{ padding: "12px" }}>Ролу</th>
                  <th style={{ padding: "12px" }}>Катталган күнү</th>
                  <th style={{ padding: "12px" }}>Аракет</th>
                  <th style={{ padding: "12px", width: "40px" }}></th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      style={{ padding: "16px", color: "#94a3b8" }}
                    >
                      Колдонуучулар табылган жок
                    </td>
                  </tr>
                )}
                {users.map((u) => (
                  <tr
                    key={u.id}
                    onMouseEnter={() => setHoveredUserId(u.id)}
                    onMouseLeave={() => setHoveredUserId(null)}
                    style={{ borderBottom: "1px solid #f1f5f9" }}
                  >
                    <td style={{ padding: "12px" }}>{u.id}</td>
                    <td style={{ padding: "12px" }}>{u.username}</td>
                    <td style={{ padding: "12px" }}>{u.email}</td>
                    <td style={{ padding: "12px" }}>{u.role}</td>
                    <td style={{ padding: "12px" }}>
                      {u.created_at
                        ? new Date(u.created_at).toLocaleDateString("ru-RU")
                        : "—"}
                    </td>
                    <td style={{ padding: "12px" }}>
                      {u.role === "ADMIN" ? (
                        <button
                          type="button"
                          onClick={() => handleRoleChange(u.id, "USER")}
                          style={{
                            background: "#f1f5f9",
                            color: "#0f172a",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Админдиктен алуу
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRoleChange(u.id, "ADMIN")}
                          style={{
                            background: "#2563eb",
                            color: "#fff",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Админ кылуу
                        </button>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        width: "40px",
                      }}
                    >
                      {hoveredUserId === u.id && (
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u.id)}
                          title="Колдонуучуну өчүрүү"
                          style={{
                            background: "#fee2e2",
                            color: "#dc2626",
                            border: "none",
                            width: "26px",
                            height: "26px",
                            borderRadius: "50%",
                            fontSize: "14px",
                            fontWeight: 700,
                            cursor: "pointer",
                            lineHeight: 1,
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <>
          <AddVacanceis />
        </>
      )}
    </div>
  );
}
