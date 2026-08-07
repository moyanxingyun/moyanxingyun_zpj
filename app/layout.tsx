import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://career-radar.example.com"),
  title: "跃迁 · 游戏美术校招求职助手",
  description: "为2027届游戏场景美术、地编与环境美术方向学生打造的校招职位雷达、简历诊断和投递管理工具。",
  openGraph: {
    title: "跃迁 · 把下一份 Offer 安排明白",
    description: "游戏美术校招职位雷达、简历诊断与投递管理。",
    type: "website",
    locale: "zh_CN",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "跃迁游戏美术校招求职助手" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "跃迁 · 把下一份 Offer 安排明白",
    description: "游戏美术校招职位雷达、简历诊断与投递管理。",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
