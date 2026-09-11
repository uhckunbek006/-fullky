"use client";
import { FC, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  PhoneForwarded,
  ChevronDown,
  ChevronUp,
  X,
  Send,
  Upload,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Vacancies.scss";

interface VacancyItem {
  id: number;
  title: string;
  count: number;
}

interface Department {
  id: string;
  title: string;
  vacancies: VacancyItem[];
}

interface BackendVacancy {
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

interface VacancyFormInputs {
  fullName: string;
  phone: string;
  email?: string;
  description: string;
  photo?: FileList;
}


const DEPARTMENTS_META: { id: string; title: string }[] = [
  { id: "central", title: "ЦЕНТРАЛЬНЫЙ АППАРАТ" },
  { id: "kara-keche", title: 'Филиал "КАРА-КЕЧЕ"' },
  { id: "issyk-kul", title: 'Филиал "ИССЫК-КУЛЬСКОЕ ПАРОХОДСТВО"' },
  { id: "yuzhnyi", title: 'Филиал "ЮЖНЫЙ"' },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const VACANCIES_URL = `${API_URL}/vacancy`;

const Vacancies: FC = () => {
  const [openDeptId, setOpenDeptId] = useState<string | null>("yuzhnyi");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedVacancy, setSelectedVacancy] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");

  const [departmentsData, setDepartmentsData] = useState<Department[]>(
    DEPARTMENTS_META.map((d) => ({ ...d, vacancies: [] })),
  );
  const [vacanciesLoading, setVacanciesLoading] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<VacancyFormInputs>();

  const selectedPhoto = watch("photo");

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      easing: "ease-in-out",
    });

    const timer = setTimeout(() => {
      AOS.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchVacancies = async () => {
      setVacanciesLoading(true);
      try {
        const res = await fetch(VACANCIES_URL);
        if (!res.ok) {
          console.error("Ошибка получения вакансий, status:", res.status);
          return;
        }

        const data = await res.json();
        const list: BackendVacancy[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.vacancies)
            ? data.vacancies
            : [];

        const grouped: Department[] = DEPARTMENTS_META.map((dept) => ({
          ...dept,
          vacancies: list
            .filter((v) => v.department === dept.id)
            .map((v) => ({
              id: v.id,
              title: v.title,
              count: 1,
            })),
        }));

        setDepartmentsData(grouped);
      } catch (err) {
        console.error("Ошибка загрузки вакансий:", err);
      } finally {
        setVacanciesLoading(false);
      }
    };

    fetchVacancies();
  }, []);

  const toggleDept = (id: string) => {
    setOpenDeptId((item) => (item === id ? null : id));
    setTimeout(() => {
      AOS.refresh();
    }, 350);
  };

  const handleOpenModal = (deptTitle: string, vacancyTitle: string) => {
    setSelectedVacancy(`${deptTitle} — ${vacancyTitle}`);
    setIsModalOpen(true);
    setSuccess("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
    setSuccess("");
  };

  const onSubmit = async (data: VacancyFormInputs) => {
    setLoading(true);

    const BOT_TOKEN = "8516479155:AAGiZFOqNOGJKko5NEqNNB8BgjTW8ycHP54";
    const CHAT_ID = "@kyrgyzkomur";
    const fileName =
      data.photo && data.photo[0] ? data.photo[0].name : "Не прикреплено";

    const message = `
🚨 Новый отклик на вакансию!
💼 Вакансия: ${selectedVacancy}
👤ФИО: ${data.fullName}
📞 Телефон: ${data.phone}
📧Email: ${data.email || "Не указан"}
📝 О себе / Опыт: ${data.description}
📷 Фото: ${fileName}
    `;

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message,
            parse_mode: "Markdown",
          }),
        },
      );

      if (response.ok) {
        setSuccess(
          "Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.",
        );
        setTimeout(() => {
          handleCloseModal();
        }, 2500);
      } else {
        alert("Произошла ошибка при отправке. Пожалуйста, попробуйте позже.");
      }
    } catch (error) {
      console.error("Telegram error:", error);
      alert("Ошибка подключения к серверу.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="Vacancies">
      <div className="container">
        <div className="Vacancies">
          <h1 data-aos="fade-up">Вакансии</h1>

          <p className="greeting" data-aos="fade-up" data-aos-delay="100">
            Уважаемые соискатели!
          </p>

          <p className="description" data-aos="fade-up" data-aos-delay="150">
            Государственное предприятие «Кыргызкомур» при Министерстве
            энергетики Кыргызской Республики объявляет о наличии вакантных
            должностей в центральном аппарате и филиалах предприятия.
          </p>

          <p className="description" data-aos="fade-up" data-aos-delay="200">
            Для получения подробной информации и подачи документов, просим
            обращаться по следующим контактным номерам:
          </p>

          <ul
            className="Vacancies--block"
            data-aos="fade-up"
            data-aos-delay="250"
          >
            <li className="Vacancies--block__card">
              <div className="card-icon">
                <PhoneForwarded size={20} />
              </div>
              <div className="card-info">
                <span className="card-title">Центральный аппарат:</span>
                <a href="tel:+996701808950" className="card-phone">
                  +996 (701) 808 950
                </a>
              </div>
            </li>

            <li className="Vacancies--block__card">
              <div className="card-icon">
                <PhoneForwarded size={20} />
              </div>
              <div className="card-info">
                <span className="card-title">Филиал «Кара-Кече»:</span>
                <a href="tel:+996702672673" className="card-phone">
                  +996 (702) 672 673
                </a>
              </div>
            </li>

            <li className="Vacancies--block__card">
              <div className="card-icon">
                <PhoneForwarded size={20} />
              </div>
              <div className="card-info">
                <span className="card-title">
                  Филиал «Иссык-Кульское пароходство»:
                </span>
                <a href="tel:+996701106110" className="card-phone">
                  +996 (701) 106 110
                </a>
              </div>
            </li>

            <li className="Vacancies--block__card">
              <div className="card-icon">
                <PhoneForwarded size={20} />
              </div>
              <div className="card-info">
                <span className="card-title">Филиал «Южный»:</span>
                <a href="tel:+996772688740" className="card-phone">
                  +996 (772) 688 740
                </a>
              </div>
            </li>
          </ul>

          <p className="description" data-aos="fade-up">
            Рассмотрение поступающих заявлений и прилагаемых документов
            осуществляется в порядке, установленном внутренними нормативными
            актами ГП «Кыргызкомур».
          </p>

          <p className="description" data-aos="fade-up">
            Благодарим Вас за интерес, проявленный к деятельности нашего
            предприятия, и желаем успехов в трудоустройстве!
          </p>

          <div className="Vacancies--accordion" data-aos="fade-up">
            {vacanciesLoading ? (
              <p style={{ padding: "16px" }}>Загрузка...</p>
            ) : (
              departmentsData.map((el) => {
                const isOpen = openDeptId === el.id;
                return (
                  <div key={el.id} className="accordion-item">
                    <button
                      className={`accordion-header ${isOpen ? "active" : ""}`}
                      onClick={() => toggleDept(el.id)}
                    >
                      <span className="icon">
                        {isOpen ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </span>
                      <span className="title">{el.title}</span>
                    </button>

                    <div
                      className={`accordion-body-wrapper ${isOpen ? "open" : ""}`}
                    >
                      <div className="accordion-body">
                        {el.vacancies.length === 0 ? (
                          <p style={{ padding: "20px", color: "#94a3b8" }}>
                            Пока нет свободных вакансий
                          </p>
                        ) : (
                          <table className="vacancies-table">
                            <thead>
                              <tr>
                                <th className="col-num">№</th>
                                <th className="col-title">Должность</th>
                                <th className="col-count">Вакантное место</th>
                                <th className="col-action">Действие</th>
                              </tr>
                            </thead>
                            <tbody>
                              {el.vacancies.map((item, index) => (
                                <tr key={item.id}>
                                  <td className="col-num">{index + 1}</td>
                                  <td className="col-title">{item.title}</td>
                                  <td className="col-count">{item.count}</td>
                                  <td className="col-action">
                                    <button
                                      className="apply-btn"
                                      onClick={() =>
                                        handleOpenModal(el.title, item.title)
                                      }
                                    >
                                      Откликнуться
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>
              <X size={22} />
            </button>

            <h2>Отклик на вакансию</h2>
            <p className="modal-subtitle">{selectedVacancy}</p>

            {success ? (
              <div className="success-message">{success}</div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
                <div className="form-group">
                  <label>Фамилия и имя *</label>
                  <input
                    type="text"
                    placeholder="Асанбеков Дастан"
                    {...register("fullName", {
                      required: "Укажите ваши имя и фамилию",
                    })}
                  />
                  {errors.fullName && (
                    <span className="error-text">
                      {errors.fullName.message}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label>Номер телефона *</label>
                  <input
                    type="tel"
                    placeholder="+996 (XXX) XX-XX-XX"
                    {...register("phone", {
                      required: "Укажите контактный номер телефона",
                    })}
                  />
                  {errors.phone && (
                    <span className="error-text">{errors.phone.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Электронная почта (Email)</label>
                  <input
                    type="email"
                    placeholder="example@mail.com"
                    {...register("email")}
                  />
                </div>

                <div className="form-group">
                  <label>О себе / Описание опыта *</label>
                  <textarea
                    rows={4}
                    placeholder="Кратко расскажите о вашем опыте работы..."
                    {...register("description", {
                      required: "Расскажите кратко о себе или вашем опыте",
                    })}
                  ></textarea>
                  {errors.description && (
                    <span className="error-text">
                      {errors.description.message}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label>Фотография (необязательно)</label>
                  <label className="file-upload-label">
                    <Upload size={16} />
                    <span>
                      {selectedPhoto && selectedPhoto.length > 0
                        ? selectedPhoto[0].name
                        : "Выберите файл фото"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      {...register("photo")}
                    />
                  </label>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Отправка..." : "Отправить отклик"}{" "}
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Vacancies;
