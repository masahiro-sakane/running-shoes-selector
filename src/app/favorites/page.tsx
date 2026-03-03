import type { Metadata } from "next";
import FavoritesClient from "@/components/favorites/FavoritesClient";

export const metadata: Metadata = {
  title: "お気に入り | ランニングシューズ",
  description: "お気に入りに追加したランニングシューズ一覧。",
};

export default function FavoritesPage() {
  return <FavoritesClient />;
}
