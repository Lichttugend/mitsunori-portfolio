import { useState } from "react";

export default function Settings() {
  const [language, setLanguage] = useState<"ja" | "en">("ja");

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">設定</h1>

      <section className="mb-6">
        <h2 className="font-semibold mb-2">解説言語</h2>
        <div className="flex gap-2">
          {(["ja", "en"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-4 py-2 rounded-lg border ${
                language === lang
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-200"
              }`}
            >
              {lang === "ja" ? "日本語" : "English"}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
