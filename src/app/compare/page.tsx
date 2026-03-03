import type { Metadata } from "next";
import CompareClient from "@/components/compare/CompareClient";
import { getShoeById } from "@/lib/services/shoe-service";
import { formatBrandModel } from "@/lib/utils/formatters";

interface PageProps {
  searchParams: Promise<Record<string, string | string[]>>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const rawIds = params.ids;
  const ids: string[] = rawIds
    ? Array.isArray(rawIds)
      ? rawIds
      : rawIds.split(",").filter(Boolean)
    : [];

  const idsParam = ids.join(",");

  if (ids.length === 0) {
    return {
      title: "シューズ比較",
      description: "ランニングシューズをスペック・トレーニング適性で並べて比較。",
      openGraph: {
        title: "シューズ比較 | RunSelect",
        description: "ランニングシューズをスペック・トレーニング適性で並べて比較。",
        images: [{ url: "/api/og/compare", width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        images: ["/api/og/compare"],
      },
    };
  }

  const shoes = (
    await Promise.all(ids.map((id) => getShoeById(id)))
  ).filter(Boolean);

  const shoeNames = shoes
    .map((s) => (s ? formatBrandModel(s.brand, s.model, s.version) : ""))
    .filter(Boolean);

  const title =
    shoeNames.length >= 2
      ? `${shoeNames.slice(0, -1).join("、")} vs ${shoeNames[shoeNames.length - 1]} 比較`
      : shoeNames.length === 1
        ? `${shoeNames[0]} を比較`
        : "シューズ比較";

  const description = `${shoeNames.join("、")}をスペック・トレーニング適性で並べて比較。`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | RunSelect`,
      description,
      images: [{ url: `/api/og/compare?ids=${idsParam}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      images: [`/api/og/compare?ids=${idsParam}`],
    },
  };
}

export default async function ComparePage({ searchParams }: PageProps) {
  const params = await searchParams;

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
