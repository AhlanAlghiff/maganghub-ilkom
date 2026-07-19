import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Magang Hub - Ilmu Komputer",
  description: "Dashboard pencarian lowongan magang untuk mahasiswa jurusan Ilmu Komputer dari maganghub.kemnaker.go.id",
  keywords: ["magang", "ilmu komputer", "lowongan", "internship", "kemnaker"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
