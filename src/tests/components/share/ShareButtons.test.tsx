import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ShareButtons from "@/components/share/ShareButtons";

const BASE_URL = "https://example.com/shoes/1";
const TITLE = "Nike Vaporfly 3をRunSelectで確認";
const HASHTAGS = ["RunSelect", "ランニングシューズ", "Nike"];

describe("ShareButtons", () => {
  it("Xのシェアボタンが表示されること", () => {
    render(<ShareButtons url={BASE_URL} title={TITLE} hashtags={HASHTAGS} />);
    expect(screen.getByText("X")).toBeInTheDocument();
  });

  it("LINEのシェアボタンが表示されること", () => {
    render(<ShareButtons url={BASE_URL} title={TITLE} hashtags={HASHTAGS} />);
    expect(screen.getByText("LINE")).toBeInTheDocument();
  });

  it("はてブのシェアボタンが表示されること", () => {
    render(<ShareButtons url={BASE_URL} title={TITLE} hashtags={HASHTAGS} />);
    expect(screen.getByText("はてブ")).toBeInTheDocument();
  });

  it("X のhrefにURLとtextが含まれること", () => {
    render(<ShareButtons url={BASE_URL} title={TITLE} hashtags={HASHTAGS} />);
    const link = screen.getByText("X").closest("a");
    expect(link).not.toBeNull();
    const href = link!.getAttribute("href") ?? "";
    // URLSearchParams は空白を + でエンコードするため、デコードして検証する
    const decoded = decodeURIComponent(href.replace(/\+/g, " "));
    expect(href).toContain("twitter.com/intent/tweet");
    expect(decoded).toContain(BASE_URL);
    expect(decoded).toContain(TITLE);
  });

  it("X のhrefにhashtagsが含まれること", () => {
    render(<ShareButtons url={BASE_URL} title={TITLE} hashtags={HASHTAGS} />);
    const link = screen.getByText("X").closest("a");
    const href = link!.getAttribute("href") ?? "";
    expect(href).toContain("hashtags=");
    expect(href).toContain("RunSelect");
  });

  it("hashtagsが空の場合もX のhrefが正しいこと", () => {
    render(<ShareButtons url={BASE_URL} title={TITLE} />);
    const link = screen.getByText("X").closest("a");
    const href = link!.getAttribute("href") ?? "";
    expect(href).toContain("twitter.com/intent/tweet");
    expect(href).not.toContain("hashtags=");
  });

  it("LINE のhrefにURLが含まれること", () => {
    render(<ShareButtons url={BASE_URL} title={TITLE} hashtags={HASHTAGS} />);
    const link = screen.getByText("LINE").closest("a");
    const href = link!.getAttribute("href") ?? "";
    expect(href).toContain("social-plugins.line.me/lineit/share");
    expect(href).toContain(encodeURIComponent(BASE_URL));
  });

  it("はてブのhrefにURLとtitleが含まれること", () => {
    render(<ShareButtons url={BASE_URL} title={TITLE} hashtags={HASHTAGS} />);
    const link = screen.getByText("はてブ").closest("a");
    const href = link!.getAttribute("href") ?? "";
    expect(href).toContain("b.hatena.ne.jp/entry/panel/");
    expect(href).toContain(encodeURIComponent(BASE_URL));
    expect(href).toContain(encodeURIComponent(TITLE));
  });

  it("すべてのリンクが target=_blank と rel=noopener noreferrer を持つこと", () => {
    render(<ShareButtons url={BASE_URL} title={TITLE} hashtags={HASHTAGS} />);
    const links = screen.getAllByRole("link");
    for (const link of links) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("3つのシェアボタンが表示されること", () => {
    render(<ShareButtons url={BASE_URL} title={TITLE} hashtags={HASHTAGS} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
  });
});
