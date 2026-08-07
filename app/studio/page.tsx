import type { Metadata } from "next";
import StudioApp from "./studio-app";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://moyanxingyun.github.io/moyanxingyun_zpj").replace(/\/$/, "");
const shareImage = `${siteUrl}/og-studio-v2.png`;

export const metadata: Metadata = {
  title: "场景雷达｜游戏场景 AI 情报工作台",
  description: "把游戏场景 AI 前沿、风格灵感和求职行动连接起来的个人工作台。",
  openGraph: {
    title: "场景雷达｜游戏场景 AI 情报工作台",
    description: "把前沿，变成下一张作品集图。",
    type: "website",
    images: [{ url: shareImage, width: 1680, height: 941, alt: "场景雷达明亮机械科技视觉" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "场景雷达｜游戏场景 AI 情报工作台",
    description: "把前沿，变成下一张作品集图。",
    images: [shareImage],
  },
};

export default function StudioPage() {
  return <StudioApp />;
}
