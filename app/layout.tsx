import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "王鑫源｜风格化 3D 场景美术与 UE5 作品集",
  description: "王鑫源的风格化 3D 场景美术、PBR 场景建模与 Unreal Engine 5 地编作品集。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
