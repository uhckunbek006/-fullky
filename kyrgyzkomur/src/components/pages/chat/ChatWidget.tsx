"use client";

import { FC, FormEvent, useState } from "react";
import { BotMessageSquare, MapPin, X } from "lucide-react";
import Image from "next/image";

import "./ChatWidget.scss";

import { useTranslatePage } from "@/src/api/useTranslate";
import whatsApp from "@/src/assets/WhatsApp_Logo_green.svg.webp";
import BaseSelector, { CoalBase } from "../basaSelector/BasaSelector";

type ChatMode = "bot" | "translate" | "bases" | null;

type Language = "ky" | "ru" | null;

type Message = {
  role: "user" | "assistant";
  content: string;
};

const ChatWidget: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<ChatMode>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const { mutate: translatePage } = useTranslatePage();

  const phone = "996704210706";

  const whatsappMessage = encodeURIComponent(
    "Здравствуйте! Я хотел бы получить информацию об угле.",
  );

  const waUrl = `https://wa.me/${phone}?text=${whatsappMessage}`;

  const handleMainButton = () => {
    if (activeMode) {
      setActiveMode(null);
      return;
    }

    setIsOpen((prev) => !prev);
  };

  const handleMode = (mode: ChatMode) => {
    setActiveMode(mode);
    setIsOpen(false);
  };

  const handleClose = () => {
    setActiveMode(null);
    setIsOpen(false);
  };
  const handleSelectBase = (base: CoalBase) => {
    const text = `Мен көмүрдү "${base.name}" базасынан (${base.address}) алып кетейин.`;
    setActiveMode("bot");
    sendCustomMessage(text);
  };

  const sendCustomMessage = async (customText: string) => {
    if (!customText || loading) return;

    const userMessage: Message = {
      role: "user",
      content: customText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const history = messages.map((message) => ({
        role: message.role,
        content: message.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: customText,
          history,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Сервердик ката");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.answer,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("========== CHAT ERROR ==========", error);
      const errorText =
        error instanceof Error ? error.message : "Белгисиз ката";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Ката чыкты: ${errorText}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguage = (lang: Language) => {
    if (!lang) return;

    translatePage(lang);

    handleClose();
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();

    const text = input.trim();

    if (!text || loading) return;

    const userMessage: Message = {
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.map((message) => ({
        role: message.role,
        content: message.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          history,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Ответ от сервера не получен");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data?.answer || "К сожалению, не удалось получить ответ.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("========== ОШИБКА ЧАТА ==========", error);

      const errorText =
        error instanceof Error ? error.message : "Неизвестная ошибка";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Ошибка: ${errorText}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ChatWidget">
      <div className="container">
        <div className="ChatWidget">
          {isOpen && !activeMode && (
            <div className="ChatWidget--options">
              <button
                type="button"
                className="ChatWidget--options_bot"
                onClick={() => handleMode("bot")}
              >
                <span>🤖</span>
                <div>
                  <strong>AI Ассистент</strong>
                  <small>Задать вопрос</small>
                </div>
              </button>

              <button
                type="button"
                className="ChatWidget--options_bot"
                onClick={() => handleMode("bases")}
              >
                <span>📍</span>
                <div>
                  <strong>Базалар</strong>
                  <small>Жакын базаны тандоо</small>
                </div>
              </button>

              <button
                type="button"
                className="ChatWidget--options_translate"
                onClick={() => handleMode("translate")}
              >
                <span>🌐</span>
                <div>
                  <strong>Переводчик</strong>
                  <small>Перевести сайт</small>
                </div>
              </button>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ChatWidget--options_bot"
                onClick={handleClose}
              >
                <Image src={whatsApp} alt="WhatsApp" width={20} height={20} />
                <div>
                  <strong>WhatsApp</strong>
                  <small>Связаться с нами</small>
                </div>
              </a>
            </div>
          )}

          {activeMode === "bot" && (
            <div className="ChatWidget--bot">
              <div className="ChatWidget--bot_header">
                <div className="ChatWidget--bot_title">
                  <div className="ChatWidget--bot_icon">🤖</div>
                  <div>
                    <h3>AI Ассистент</h3>
                    <span>{loading ? "Готовит ответ..." : "В сети"}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="ChatWidget--window_close"
                  aria-label="Закрыть"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="ChatWidget--bot_messages">
                {messages.length === 0 && (
                  <div className="ChatWidget--welcome">
                    <div className="ChatWidget--welcome_icon">🤖</div>
                    <h4>Здравствуйте! 👋</h4>
                    <p>Я AI-ассистент сайта КыргызКомур.</p>
                    <p>
                      Вы можете задать вопрос о компании, угле, ценах, доставке
                      и услугах.
                    </p>
                  </div>
                )}

                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`ChatWidget--message ${message.role}`}
                  >
                    {message.content}
                  </div>
                ))}

                {loading && (
                  <div className="ChatWidget--message assistant">
                    <span className="ChatWidget--typing">
                      ИИ готовит ответ...
                    </span>
                  </div>
                )}
              </div>

              <form
                className="ChatWidget--bot_input"
                onSubmit={handleSendMessage}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Напишите ваш вопрос..."
                  disabled={loading}
                />

                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Отправить"
                >
                  ➤
                </button>
              </form>
            </div>
          )}

          {activeMode === "bases" && (
            <div className="ChatWidget--bases_modal">
              <div className="ChatWidget--bot_header">
                <div className="ChatWidget--bot_title">
                  <MapPin size={20} />
                  <h3>Көмүр базалары</h3>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="ChatWidget--window_close"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="ChatWidget--bases_body">
                <BaseSelector onSelectBase={handleSelectBase} />
              </div>
            </div>
          )}

          {activeMode === "translate" && (
            <div className="ChatWidget--language">
              <div className="ChatWidget--language_header">
                <div>
                  <span>🌐</span>
                  <div>
                    <h3>Переводчик сайта</h3>
                    <small>Выберите язык</small>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="ChatWidget--window_close"
                  aria-label="Закрыть"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="ChatWidget--language_body">
                <p>На какой язык перевести сайт?</p>

                <button
                  type="button"
                  className="ChatWidget--language_item"
                  onClick={() => handleLanguage("ky")}
                >
                  <span className="flag">🇰🇬</span>
                  <div>
                    <strong>Кыргызский</strong>
                    <small>Кыргызча</small>
                  </div>
                </button>

                <button
                  type="button"
                  className="ChatWidget--language_item"
                  onClick={() => handleLanguage("ru")}
                >
                  <span className="flag">🇷🇺</span>
                  <div>
                    <strong>Русский</strong>
                    <small>Русский</small>
                  </div>
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            className={`ChatWidget--main ${
              isOpen || activeMode ? "active" : ""
            }`}
            onClick={handleMainButton}
            aria-label="Чат"
          >
            {isOpen || activeMode ? (
              <X size={25} />
            ) : (
              <BotMessageSquare size={26} />
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ChatWidget;
