import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "读记 · Reading Notes",
  description: "读记：个人阅读记录与读书会共读笔记",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/icon-180.png",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
