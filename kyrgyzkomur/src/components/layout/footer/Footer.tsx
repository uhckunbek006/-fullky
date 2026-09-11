"use client";
import { FC } from "react";
import "./Footer.scss";
import Footerlogo from "@/src/assets/headerlogo.png";
import Image from "next/image";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

const Footer: FC = () => {
  const router = useRouter();
  return (
    <footer id="Footer">
      <div className="container">
        <div className="Footer">
          <div
            className="Footer--left"
            data-aos="fade-up"
            data-aos-duration="800"
          >
            <span className="Footer__logo">
              <Image
                src={Footerlogo}
                alt="ОАО Кыргыз Комур"
                width={32}
                height={32}
              />
              ОАО «Кыргыз Комур»
            </span>
            <p>
              Государственное угледобывающее предприятие Кыргызской Республики.{" "}
              <br />
              Добыча, переработка и поставка каменного угля с <br /> 1928 года.
            </p>
          </div>

          <div
            className="Footer--center"
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay="150"
          >
            <h2 className="Footer__title">Разделы</h2>
            <Link href={"/about"}>Товарищество</Link>
            <Link href={"/management"}>Руководство</Link>
            <Link href={"/news"}>Пресс-центр</Link>
            <Link href={"/vacancies"}>Вакансии</Link>
            <Link href={"/contact"}>Контакты</Link>
            <Link href={"/services"}>Сервис-центр</Link>
          </div>

          <div
            className="Footer--right"
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay="300"
          >
            <h2
              className="Footer__title"
              onClick={() => router.push("/contact")}
            >
              Контакты
            </h2>

            <Link
              href="https://go.2gis.com/vJGJM"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MapPin className="icon" size={18} />
              <span>Кыргызская Республика, г. Бишкек, Кулатова 24</span>
            </Link>
            <Link href={"https://wa.me/996704210706"} target="_blank">
              <Phone className="icon" size={18} />
              <span>+996 (704) 21-07-06</span>
            </Link>
            <Link href={"mailto:info@kyrgyzkomur.kg"}>
              <Mail className="icon" size={18} />
              <span>info@kyrgyzkomur.kg</span>
            </Link>
            <div className="Footer__info-item">
              <Clock className="icon" size={18} />
              <span>Пн–Пт, 09:00 – 18:00</span>
            </div>
          </div>
        </div>

        <div
          className="Footer-bottom"
          // data-aos="fade-up"
          // data-aos-duration="1000"
          // data-aos-delay="400"
        >
          <span>© 2026 ОАО «Кыргыз Комур». Все права защищены.</span>
          <span>Официальный сайт предприятия</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
