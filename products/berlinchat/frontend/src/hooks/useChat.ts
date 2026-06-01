import { useState } from "react";
import { sendMessage as apiSendMessage } from "../api/client";
import type { Message } from "../components/MessageBubble";

export function useChat(language: "ja" | "en" = "ja") {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function sendMessage(content: string) {
    if (!content.trim()) return;

    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await apiSendMessage(content, language);
      const assistantMessage: Message = {
        role: "assistant",
        content: response.message,
        explanation: response.explanation,
        character: response.character,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  return { messages, sendMessage, isLoading };
}
