import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Scaffoldor - Download templates from GitHub with ease",
  description:
    "The easiest way to scaffold your projects using templates from GitHub. Supports multiple frameworks and package managers.",
  alternates: {
    canonical: "https://scaffoldor.vercel.app",
  },
  openGraph: {
    title: "Scaffoldor - Download templates from GitHub with ease",
    description:
      "Scaffold your projects using templates from GitHub with ease.",
    url: "https://scaffoldor.vercel.app",
    siteName: "Scaffoldor",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/scaffoldor.png",
        width: 1200,
        height: 630,
        alt: "Scaffoldor - Projects scaffolding made easy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Scaffoldor - Download templates from GitHub with ease",
    description:
      "Scaffold your projects using templates from GitHub with ease.",
    images: ["/scaffoldor.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
