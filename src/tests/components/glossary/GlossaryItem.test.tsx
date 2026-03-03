import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GlossaryItem from "@/components/glossary/GlossaryItem";
import type { GlossaryTerm } from "@/data/glossary";

const mockTerm: GlossaryTerm = {
  id: "test-term",
  term: "テスト用語",
  reading: "てすとようご",
  category: "spec",
  shortDescription: "テスト用の短い説明文です。",
  longDescription: "テスト用の長い説明文です。アコーディオン展開時に表示されます。",
  relatedTermIds: ["related-term"],
};

const relatedTerm: GlossaryTerm = {
  id: "related-term",
  term: "関連用語",
  reading: "かんれんようご",
  category: "spec",
  shortDescription: "関連する用語の説明です。",
  longDescription: "関連する用語の詳細説明です。",
};

const allTerms: GlossaryTerm[] = [mockTerm, relatedTerm];

describe("GlossaryItem", () => {
  it("用語名が表示されること", () => {
    render(<GlossaryItem term={mockTerm} allTerms={allTerms} />);
    expect(screen.getByText("テスト用語")).toBeInTheDocument();
  });

  it("ふりがなが表示されること", () => {
    render(<GlossaryItem term={mockTerm} allTerms={allTerms} />);
    expect(screen.getByText("てすとようご")).toBeInTheDocument();
  });

  it("短い説明が表示されること", () => {
    render(<GlossaryItem term={mockTerm} allTerms={allTerms} />);
    expect(screen.getByText("テスト用の短い説明文です。")).toBeInTheDocument();
  });

  it("初期状態では長い説明が表示されないこと", () => {
    render(<GlossaryItem term={mockTerm} allTerms={allTerms} />);
    expect(screen.queryByText("テスト用の長い説明文です。アコーディオン展開時に表示されます。")).not.toBeInTheDocument();
  });

  it("クリックでアコーディオンが展開されること", () => {
    render(<GlossaryItem term={mockTerm} allTerms={allTerms} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(screen.getByText("テスト用の長い説明文です。アコーディオン展開時に表示されます。")).toBeInTheDocument();
  });

  it("再クリックでアコーディオンが折りたたまれること", () => {
    render(<GlossaryItem term={mockTerm} allTerms={allTerms} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    fireEvent.click(button);
    expect(screen.queryByText("テスト用の長い説明文です。アコーディオン展開時に表示されます。")).not.toBeInTheDocument();
  });

  it("展開時にaria-expanded=trueになること", () => {
    render(<GlossaryItem term={mockTerm} allTerms={allTerms} />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it("展開時にrelatedTermsリンクが表示されること", () => {
    render(<GlossaryItem term={mockTerm} allTerms={allTerms} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    const link = screen.getByRole("link", { name: "関連用語" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#term-related-term");
  });

  it("id属性がterm.idを含む形式で設定されること", () => {
    const { container } = render(<GlossaryItem term={mockTerm} allTerms={allTerms} />);
    expect(container.firstChild).toHaveAttribute("id", "term-test-term");
  });

  it("relatedTermIdsが未定義の場合は関連用語を表示しないこと", () => {
    const termWithoutRelated: GlossaryTerm = {
      ...mockTerm,
      relatedTermIds: undefined,
    };
    render(<GlossaryItem term={termWithoutRelated} allTerms={allTerms} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(screen.queryByText("関連用語")).not.toBeInTheDocument();
  });
});
