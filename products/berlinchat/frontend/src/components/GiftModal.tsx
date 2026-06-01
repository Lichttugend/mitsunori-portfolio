// TODO: MVP後に実装

interface Props {
  isOpen: boolean;
  onClose: () => void;
  character: "freya" | "finn";
}

export default function GiftModal({ isOpen, onClose, character }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-80">
        <h2 className="text-lg font-bold mb-4">
          {character === "freya" ? "Freya" : "Finn"}にプレゼントを送る
        </h2>
        <p className="text-gray-500 text-sm">この機能はMVP後に実装予定です。</p>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-100 rounded-lg py-2 text-sm"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
