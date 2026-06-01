import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MessageBubble from "../MessageBubble";

describe("MessageBubble", () => {
  it("ユーザーメッセージを右寄せで表示する", () => {
    render(
      <MessageBubble
        message={{ role: "user", content: "Hallo!" }}
      />
    );
    expect(screen.getByText("Hallo!")).toBeInTheDocument();
    const wrapper = screen.getByText("Hallo!").closest(".flex");
    expect(wrapper).toHaveClass("justify-end");
  });

  it("アシスタントメッセージを左寄せで表示する", () => {
    render(
      <MessageBubble
        message={{ role: "assistant", content: "Hallo! Wie geht es dir?" }}
      />
    );
    expect(screen.getByText("Hallo! Wie geht es dir?")).toBeInTheDocument();
    const wrapper = screen.getByText("Hallo! Wie geht es dir?").closest(".flex");
    expect(wrapper).toHaveClass("justify-start");
  });

  it("解説がある場合はExplanationPanelを表示する", () => {
    render(
      <MessageBubble
        message={{
          role: "assistant",
          content: "Das ist toll!",
          explanation: "「toll」は「素晴らしい」という意味の形容詞。",
        }}
      />
    );
    expect(screen.getByText(/「toll」は「素晴らしい」/)).toBeInTheDocument();
    expect(screen.getByText("解説")).toBeInTheDocument();
  });

  it("解説がない場合はExplanationPanelを表示しない", () => {
    render(
      <MessageBubble
        message={{ role: "assistant", content: "Danke!" }}
      />
    );
    expect(screen.queryByText("解説")).not.toBeInTheDocument();
  });
});
