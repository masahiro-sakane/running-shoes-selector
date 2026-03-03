import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GlossaryList from "@/components/glossary/GlossaryList";
import type { GlossaryTerm } from "@/data/glossary";

const mockTerms: GlossaryTerm[] = [
  {
    id: "term-structure",
    term: "ミッドソール",
    reading: "みっどそーる",
    category: "structure",
    shortDescription: "シューズ中間層のクッション材。",
    longDescription: "ミッドソールの詳細説明。",
    relatedTermIds: [],
  },
  {
    id: "term-spec",
    term: "ドロップ",
    reading: "どろっぷ",
    category: "spec",
    shortDescription: "かかとと爪先の高さの差。",
    longDescription: "ドロップの詳細説明。",
    relatedTermIds: [],
  },
  {
    id: "term-form",
    term: "プロネーション",
    reading: "ぷろねーしょん",
    category: "form",
    shortDescription: "足首の内側への倒れ込み。",
    longDescription: "プロネーションの詳細説明。",
    relatedTermIds: [],
  },
  {
    id: "term-training",
    term: "インターバル",
    reading: "いんたーばる",
    category: "training",
    shortDescription: "高強度走と回復走を繰り返す練習。",
    longDescription: "インターバルの詳細説明。",
    relatedTermIds: [],
  },
];

describe("GlossaryList", () => {
  it("用語一覧が表示されること", () => {
    render(<GlossaryList initialTerms={mockTerms} />);
    expect(screen.getByText("ミッドソール")).toBeInTheDocument();
    expect(screen.getByText("ドロップ")).toBeInTheDocument();
    expect(screen.getByText("プロネーション")).toBeInTheDocument();
    expect(screen.getByText("インターバル")).toBeInTheDocument();
  });

  it("初期状態では全タブが選択されていること", () => {
    render(<GlossaryList initialTerms={mockTerms} />);
    const allTab = screen.getByRole("tab", { name: /すべて/ });
    expect(allTab).toHaveAttribute("aria-selected", "true");
  });

  it("カテゴリタブで構造・パーツに絞り込みができること", () => {
    render(<GlossaryList initialTerms={mockTerms} />);
    const structureTab = screen.getByRole("tab", { name: /構造・パーツ/ });
    fireEvent.click(structureTab);
    expect(screen.getByText("ミッドソール")).toBeInTheDocument();
    expect(screen.queryByText("ドロップ")).not.toBeInTheDocument();
    expect(screen.queryByText("プロネーション")).not.toBeInTheDocument();
    expect(screen.queryByText("インターバル")).not.toBeInTheDocument();
  });

  it("カテゴリタブでスペック指標に絞り込みができること", () => {
    render(<GlossaryList initialTerms={mockTerms} />);
    const specTab = screen.getByRole("tab", { name: /スペック指標/ });
    fireEvent.click(specTab);
    expect(screen.queryByText("ミッドソール")).not.toBeInTheDocument();
    expect(screen.getByText("ドロップ")).toBeInTheDocument();
    expect(screen.queryByText("プロネーション")).not.toBeInTheDocument();
  });

  it("カテゴリタブで走り方・フォームに絞り込みができること", () => {
    render(<GlossaryList initialTerms={mockTerms} />);
    const formTab = screen.getByRole("tab", { name: /走り方・フォーム/ });
    fireEvent.click(formTab);
    expect(screen.queryByText("ミッドソール")).not.toBeInTheDocument();
    expect(screen.getByText("プロネーション")).toBeInTheDocument();
  });

  it("カテゴリタブでトレーニング種別に絞り込みができること", () => {
    render(<GlossaryList initialTerms={mockTerms} />);
    const trainingTab = screen.getByRole("tab", { name: /トレーニング種別/ });
    fireEvent.click(trainingTab);
    expect(screen.queryByText("ミッドソール")).not.toBeInTheDocument();
    expect(screen.getByText("インターバル")).toBeInTheDocument();
  });

  it("検索で用語名に絞り込みができること", () => {
    render(<GlossaryList initialTerms={mockTerms} />);
    const searchInput = screen.getByRole("searchbox");
    fireEvent.change(searchInput, { target: { value: "ミッドソール" } });
    expect(screen.getByText("ミッドソール")).toBeInTheDocument();
    expect(screen.queryByText("ドロップ")).not.toBeInTheDocument();
  });

  it("検索でshortDescriptionに絞り込みができること", () => {
    render(<GlossaryList initialTerms={mockTerms} />);
    const searchInput = screen.getByRole("searchbox");
    fireEvent.change(searchInput, { target: { value: "クッション材" } });
    expect(screen.getByText("ミッドソール")).toBeInTheDocument();
    expect(screen.queryByText("ドロップ")).not.toBeInTheDocument();
  });

  it("0件時にメッセージが表示されること", () => {
    render(<GlossaryList initialTerms={mockTerms} />);
    const searchInput = screen.getByRole("searchbox");
    fireEvent.change(searchInput, { target: { value: "存在しない用語xyzabc" } });
    expect(screen.getByText("該当する用語が見つかりません")).toBeInTheDocument();
  });

  it("カテゴリと検索を組み合わせてフィルタリングできること", () => {
    render(<GlossaryList initialTerms={mockTerms} />);
    const specTab = screen.getByRole("tab", { name: /スペック指標/ });
    fireEvent.click(specTab);
    const searchInput = screen.getByRole("searchbox");
    fireEvent.change(searchInput, { target: { value: "ドロップ" } });
    expect(screen.getByText("ドロップ")).toBeInTheDocument();
    expect(screen.queryByText("ミッドソール")).not.toBeInTheDocument();
  });

  it("タブにカウントが表示されること", () => {
    render(<GlossaryList initialTerms={mockTerms} />);
    expect(screen.getByRole("tab", { name: /すべて/ })).toHaveTextContent("4");
    expect(screen.getByRole("tab", { name: /構造・パーツ/ })).toHaveTextContent("1");
    expect(screen.getByRole("tab", { name: /スペック指標/ })).toHaveTextContent("1");
  });
});
