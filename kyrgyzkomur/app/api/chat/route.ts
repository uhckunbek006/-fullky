import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const BOT_TOKEN = "8516479155:AAGiZFOqNOGJKko5NEqNNB8BgjTW8ycHP54";
const CHAT_ID = "@kyrgyzkomur";

type HistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

type Order = {
  quantity: string | null;
  address: string | null;
  phone: string | null;
};

async function sendTelegramMessage(order: Order) {
  const text = `
🔥 Новый заказ (Самовывоз с базы)

📦 Количество угля: ${order.quantity};
📍 Адрес клиента / Ближайшая база: ${order.address}
📞 Телефон: ${order.phone}

⏰ Новый заказ получен через AI чат.
`;

  const response = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok || !data.ok) {
    console.error("Ошибка Telegram:", data);

    throw new Error("Сообщение не было отправлено в Telegram.");
  }

  return data;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const message = body?.message;

    const history: HistoryMessage[] = Array.isArray(body?.history)
      ? body.history
      : [];

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        {
          error: "Сообщение пустое",
        },
        {
          status: 400,
        },
      );
    }

    const historyText = history
      .map((item) => {
        const role = item.role === "user" ? "Клиент" : "Ассистент";

        return `${role}: ${item.content}`;
      })
      .join("\n");

    const prompt = `
Вы являетесь AI-консультантом в компании «КыргызКомур».

ВАША ОСНОВНАЯ ЗАДАЧА:
1. Помогать клиентам по вопросам компании «КыргызКомур».
2. ВАЖНО: У КОМПАНИИ НЕТ СЛУЖБЫ ДОСТАВКИ. Клиент должен самостоятельно забрать уголь с базы (самовывоз).
3. Если клиент хочет заказать уголь, соберите ТРИ параметра:
   - количество угля (сколько тонн или мешков)
   - адрес или район проживания клиента (чтобы подсказать и подобрать ближайшую базу)
   - контактный номер телефона

САМЫЕ ВАЖНЫЕ ПРАВИЛА:
- Всегда вежливо предупреждайте, что ДОСТАВКИ НЕТ. Спрашивайте адрес/район клиента, чтобы подсказать ближайшую к нему базу.
- Никогда не выдумывайте информацию, которую клиент сам не озвучил.
- Никогда не выдумывайте номер телефона, адрес или количество тонн.
- Если клиент не указал телефон — спросите номер телефона.
- Если клиент не указал адрес/район — спросите адрес, чтобы подсказать ближайшую базу.
- Если клиент не указал объем — спросите, сколько тонн или мешков нужно.
- Пока все три параметра не собраны, не говорите, что заказ готов или отправлен.
- Цены: 1 тонна угля — 7000 сомов, 1 мешок — примерно 250-300 сомов.

Пример диалога:

Клиент:
"Мне нужно 4 тонны угля"

Вы:
"Здравствуйте! Обратите внимание, что у нас нет службы доставки — уголь нужно забирать самостоятельно с базы. Подскажите ваш адрес или район, чтобы я подсказал(а) ближайшую к вам базу?"

Клиент:
"Кулатова 24"

Вы:
"Спасибо! Ближайшая к вам база находится по адресу [Адрес базы]. Оставьте ваш номер телефона для связи."

Предыдущий диалог:
${historyText || "Диалог еще не начат."}

Текущее сообщение:
${message}

Отвечайте на том языке, на котором пишет клиент (на русском или кыргызском).
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const answer = response.text || "Ответ не получен.";

    const allText = `
${historyText}
Клиент: ${message}
`;

    const phoneMatch = allText.match(
      /(?:\+996|0)[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2}/,
    );

    const phone = phoneMatch?.[0] || null;

    const quantityMatch = allText.match(
      /(\d+(?:[.,]\d+)?)\s*(?:тонн|тонны|тонна|т|мешок|мешков|кап)/i,
    );

    const quantity = quantityMatch ? quantityMatch[0] : null;

    const extractionPrompt = `
Найди данные заказа из следующего диалога.

Диалог:
${allText}

Верни ТОЛЬКО JSON:

{
  "address": "адрес/район клиента или неизвестно",
  "quantity": "количество угля или неизвестно",
  "phone": "телефон или неизвестно"
}

Правила:
- Не выдумывай.
- Не добавляй информацию, которой нет в диалоге.
- Бери адрес или район, только если он четко указан.
- Бери телефон, только если он четко указан.
- Бери количество угля, только если оно четко указано.
`;

    const extraction = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: extractionPrompt,
    });

    let extractedOrder: Order = {
      quantity,
      address: null,
      phone,
    };

    try {
      const jsonText = extraction.text
        ?.replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      if (jsonText) {
        const parsed = JSON.parse(jsonText);

        extractedOrder = {
          quantity:
            parsed.quantity !== "неизвестно" ? parsed.quantity : quantity,

          address: parsed.address !== "неизвестно" ? parsed.address : null,

          phone: parsed.phone !== "неизвестно" ? parsed.phone : phone,
        };
      }
    } catch (error) {
      console.error("Ошибка извлечения заказа:", error);
    }

    const isCompleteOrder = Boolean(
      extractedOrder.quantity && extractedOrder.address && extractedOrder.phone,
    );

    if (isCompleteOrder) {
      try {
        await sendTelegramMessage(extractedOrder);

        console.log("Заказ отправлен в Telegram 🎆✔️");
      } catch (telegramError) {
        console.error("Ошибка Telegram:", telegramError);
      }
    }

    return NextResponse.json({
      answer,
      order: extractedOrder,
      orderCompleted: isCompleteOrder,
    });
  } catch (error) {
    console.error("========== ОШИБКА ЧАТА ==========");

    console.error(error);

    console.error("=================================");

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Ошибка сервера",
      },
      {
        status: 500,
      },
    );
  }
}
