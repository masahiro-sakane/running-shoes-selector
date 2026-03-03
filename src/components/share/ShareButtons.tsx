"use client";

interface ShareButtonsProps {
  url: string;
  title: string;
  hashtags?: string[];
}

interface SharePlatform {
  label: string;
  background: string;
  buildHref: (url: string, title: string, hashtags: string[]) => string;
}

const SHARE_PLATFORMS: SharePlatform[] = [
  {
    label: "X",
    background: "#000000",
    buildHref: (url, title, hashtags) => {
      const base = "https://twitter.com/intent/tweet";
      const params = `url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}${
        hashtags.length > 0 ? `&hashtags=${encodeURIComponent(hashtags.join(","))}` : ""
      }`;
      return `${base}?${params}`;
    },
  },
  {
    label: "LINE",
    background: "#06c755",
    buildHref: (url) => {
      return `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`;
    },
  },
  {
    label: "はてブ",
    background: "#00a4de",
    buildHref: (url, title) => {
      return `https://b.hatena.ne.jp/entry/panel/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    },
  },
];

export default function ShareButtons({ url, title, hashtags = [] }: ShareButtonsProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      {SHARE_PLATFORMS.map((platform) => (
        <a
          key={platform.label}
          href={platform.buildHref(url, title, hashtags)}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            padding: "8px 16px",
            background: platform.background,
            color: "#ffffff",
            borderRadius: "4px",
            fontSize: "13px",
            fontWeight: 600,
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          {platform.label}
        </a>
      ))}
    </div>
  );
}
