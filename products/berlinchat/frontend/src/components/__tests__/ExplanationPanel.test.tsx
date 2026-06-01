import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ExplanationPanel from "../ExplanationPanel";

describe("ExplanationPanel", () => {
  it("解説テキストを表示する", () => {
    render(<ExplanationPanel explanation="「doch」は強調の副詞です。" />);
    expect(screen.getByText(/「doch」は強調の副詞です。/)).toBeInTheDocument();
  });

  it("「解説」ラベルを表示する", () => {
    render(<ExplanationPanel explanation="テスト解説" />);
    expect(screen.getByText("解説")).toBeInTheDocument();
  });
});
