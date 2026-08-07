import type { Metadata } from "next";
import StudioApp from "./studio-app";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "场景雷达｜游戏场景 AI 情报工作台",
  description: "把游戏场景 AI 前沿、风格灵感和求职行动连接起来的个人工作台。",
  openGraph: {
    title: "场景雷达｜游戏场景 AI 情报工作台",
    description: "把前沿，变成下一张作品集图。",
    type: "website",
    images: [{ url: `${basePath}/og-studio.png`, width: 1200, height: 630, alt: "场景雷达社交预览" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "场景雷达｜游戏场景 AI 情报工作台",
    description: "把前沿，变成下一张作品集图。",
    images: [`${basePath}/og-studio.png`],
  },
};

export default function StudioPage() {
  return <StudioApp />;
}
