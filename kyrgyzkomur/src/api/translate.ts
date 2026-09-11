export interface TranslateParams {
  text: string;
  targetLang: "ky" | "ru";
}

export const fetchTranslation = async ({
  text,
  targetLang,
}: TranslateParams): Promise<string> => {
  if (!text.trim()) return text;

  const sourceLang = targetLang === "ky" ? "ru" : "ky";
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("В переводе допущена ошибка.");

  const data = await res.json();
  return data[0].map((item: [string]) => item[0]).join("");
};
