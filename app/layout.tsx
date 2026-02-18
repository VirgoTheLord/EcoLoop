import type { Metadata } from "next";
import localFont from "next/font/local"
import { Host_Grotesk, Space_Grotesk } from "next/font/google";
import "./globals.css";

const hostGrotesk = Host_Grotesk({
  variable: "--font-host-grotesk",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const lk = localFont({
  variable: "--font-lk",
  src: "./fonts/LK_Ternima-Regular.ttf"
})

export const metadata: Metadata = {
  title: "Obsidian",
  description: "Obsidian Landing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${hostGrotesk.variable} ${spaceGrotesk.variable} ${lk.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
