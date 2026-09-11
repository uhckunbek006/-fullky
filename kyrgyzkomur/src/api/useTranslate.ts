import { useMutation } from "@tanstack/react-query";
import { fetchTranslation } from "./translate";

export const useTranslatePage = () => {
  return useMutation({
    mutationFn: async (targetLang: "ky" | "ru") => {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;

            const tagName = parent.tagName.toLowerCase();
            if (
              tagName === "script" ||
              tagName === "style" ||
              parent.closest("#ChatWidget")
            ) {
              return NodeFilter.FILTER_REJECT;
            }

            return node.nodeValue && node.nodeValue.trim().length > 0
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_SKIP;
          },
        },
      );

      const textNodes: Node[] = [];
      let currentNode = walker.nextNode();
      while (currentNode) {
        textNodes.push(currentNode);
        currentNode = walker.nextNode();
      }

      await Promise.all(
        textNodes.map(async (node) => {
          const originalText = node.nodeValue;
          if (originalText) {
            try {
              const translated = await fetchTranslation({
                text: originalText.trim(),
                targetLang,
              });
              node.nodeValue = originalText.replace(
                originalText.trim(),
                translated,
              );
            } catch (err) {
              console.error("Элемент не был перенесен", err);
            }
          }
        }),
      );
    },
  });
};
