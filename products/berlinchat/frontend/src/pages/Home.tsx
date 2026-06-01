import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-2">BerlinChat 🇩🇪</h1>
      <p className="text-gray-600 mb-8">
        ベルリン在住のAIキャラクターとドイツ語を学ぼう
      </p>
      <div className="flex gap-4">
        <Link
          to="/chat"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700"
        >
          チャットを始める
        </Link>
        <Link
          to="/settings"
          className="bg-white border border-gray-300 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50"
        >
          設定
        </Link>
      </div>
    </div>
  );
}
