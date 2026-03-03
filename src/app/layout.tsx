import type { Metadata } from "next";
import "./globals.css";
import "@atlaskit/css-reset/bundle.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CompareProvider } from "@/contexts/CompareContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://runselect.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "RunSelect | マラソン向けランニングシューズ比較",
    template: "%s | RunSelect",
  },
  description:
    "マラソントレーニングに最適なランニングシューズを比較検討。Nike、adidas、ASICS、HOKAなど主要ブランドの28モデルを網羅。クッション、重量、ドロップなどのスペックで比較できます。",
  keywords: ["ランニングシューズ", "マラソン", "比較", "トレーニング", "Nike", "ASICS", "HOKA", "シューズ選び", "ランニング"],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "RunSelect",
    url: SITE_URL,
    title: "RunSelect | マラソン向けランニングシューズ比較",
    description:
      "マラソントレーニングに最適なランニングシューズを比較検討。Nike、adidas、ASICS、HOKAなど主要ブランドの28モデルを網羅。",
  },
  twitter: {
    card: "summary_large_image",
    title: "RunSelect | マラソン向けランニングシューズ比較",
    description:
      "マラソントレーニングに最適なランニングシューズを比較検討。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <CompareProvider>
          <FavoritesProvider>
            <Header />
            <main style={{ minHeight: "calc(100vh - 120px)", paddingBottom: "48px" }}>
              {children}
            </main>
            <Footer />
          </FavoritesProvider>
        </CompareProvider>
      </body>
    </html>
  );
}
