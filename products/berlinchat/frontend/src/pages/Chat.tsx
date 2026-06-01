import { useState } from "react";
import CharacterSelect from "../components/CharacterSelect";
import ChatWindow from "../components/ChatWindow";

export default function Chat() {
  const [character, setCharacter] = useState<"freya" | "finn">("freya");
  const language =
    (localStorage.getItem("language") as "ja" | "en") ?? "ja";

  return (
    <div className="flex flex-col h-screen">
      <CharacterSelect selected={character} onSelect={setCharacter} />
      <div className="flex-1 overflow-hidden">
        <ChatWindow language={language} />
      </div>
    </div>
  );
}
