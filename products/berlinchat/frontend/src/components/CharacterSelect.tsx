type Character = "freya" | "finn";

interface Props {
  selected: Character;
  onSelect: (character: Character) => void;
}

const characters = [
  {
    id: "freya" as Character,
    name: "Freya",
    age: 27,
    role: "SNS Marketing",
    area: "Prenzlauer Berg",
    description: "知的でフレンドリー、ベルリンの文化に精通",
  },
  {
    id: "finn" as Character,
    name: "Finn",
    age: 28,
    role: "Systems Engineer",
    area: "Mitte",
    description: "論理的だが親しみやすく、ユーモアがある",
  },
];

export default function CharacterSelect({ selected, onSelect }: Props) {
  return (
    <div className="flex gap-4 p-4">
      {characters.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={`flex-1 p-4 rounded-xl border-2 text-left transition ${
            selected === c.id
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 hover:border-blue-300"
          }`}
        >
          <div className="font-bold text-lg">{c.name}</div>
          <div className="text-sm text-gray-600">
            {c.age}歳 / {c.role}
          </div>
          <div className="text-sm text-gray-500">{c.area}, Berlin</div>
          <div className="text-sm mt-2">{c.description}</div>
        </button>
      ))}
    </div>
  );
}
