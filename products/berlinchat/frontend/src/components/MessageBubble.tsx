import ExplanationPanel from "./ExplanationPanel";

export interface Message {
  role: "user" | "assistant";
  content: string;
  explanation?: string;
  character?: "freya" | "finn";
}

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[75%] space-y-1`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            isUser
              ? "bg-blue-600 text-white rounded-br-sm"
              : "bg-gray-100 text-gray-900 rounded-bl-sm"
          }`}
        >
          {message.content}
        </div>
        {message.explanation && (
          <ExplanationPanel explanation={message.explanation} />
        )}
      </div>
    </div>
  );
}
