interface Props {
  explanation: string;
}

export default function ExplanationPanel({ explanation }: Props) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-sm text-gray-700">
      <span className="font-semibold text-yellow-700 mr-1">解説</span>
      {explanation}
    </div>
  );
}
