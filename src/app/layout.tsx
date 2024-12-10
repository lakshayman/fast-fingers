import type { Metadata } from "next";
import localFont from "next/font/local";
import { Provider } from "@/components/ui/provider"
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Fast Fingers - Typing Speed Game",
  description: "Test and improve your typing speed with Fast Fingers. Challenge yourself with different difficulty levels and compete for high scores!",
  keywords: "typing game, typing speed, typing test, fast fingers, typing practice",
  authors: [{ name: "Lakshay Manchanda" }],
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: '/keyboard.png',
    apple: '/keyboard.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
