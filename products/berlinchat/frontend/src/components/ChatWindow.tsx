import { useChat } from "../hooks/useChat";
import MessageBubble from "./MessageBubble";

interface Props {
  language?: "ja" | "en";
}

export default function ChatWindow({ language = "ja" }: Props) {
  const { messages, sendMessage, isLoading } = useChat(language);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
      </div>
      <form
        className="p-4 border-t flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const input = (e.target as HTMLFormElement).elements.namedItem(
            "message"
          ) as HTMLInputElement;
          sendMessage(input.value);
          input.value = "";
        }}
      >
        <input
          name="message"
          className="flex-1 border rounded px-3 py-2"
          placeholder="Schreib etwas auf Deutsch..."
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={isLoading}
        >
          Senden
        </button>
      </form>
    </div>
  );
}
