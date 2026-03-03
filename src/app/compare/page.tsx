import type { Metadata } from "next";
import CompareClient from "@/components/compare/CompareClient";
import { getShoeById } from "@/lib/services/shoe-service";

export const metadata: Metadata = {
  title: "シューズ比較",
  description: "ランニングシューズをスペック・トレーニング適性で並べて比較。",
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[]>>;
}

export default async function ComparePage({ searchParams }: PageProps) {
  const params = await searchParams;

  // URLから ids を読み込んで初期シューズを Server 側でフェッチ
  const rawIds = params.ids;
  const urlIds: string[] = rawIds
    ? Array.isArray(rawIds)
      ? rawIds
      : rawIds.split(",").filter(Boolean)
    : [];

  const urlShoes = urlIds.length > 0
    ? (await Promise.all(urlIds.map((id) => getShoeById(id)))).filter(Boolean)
    : [];

  return <CompareClient initialShoes={urlShoes as NonNullable<typeof urlShoes[number]>[]} initialIds={urlIds} />;
}
