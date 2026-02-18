import type { Metadata } from "next";
import localFont from "next/font/local"
import { Host_Grotesk, Space_Grotesk } from "next/font/google";
import "./globals.css";

import SmoothScroll from "@/components/SmoothScroll";

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

const db = localFont({
  variable: "--font-db",
  src: "./fonts/20db.otf"
})

const drum = localFont({
  variable: "--font-drum",
  src: "./fonts/DRUMSN__.ttf"
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
        className={`${hostGrotesk.variable} ${spaceGrotesk.variable} ${lk.variable} ${db.variable} ${drum.variable} antialiased`}
      >
        <SmoothScroll>
            {/* Runs synchronously before React hydrates — resets scroll before browser can restore it */}
            <script dangerouslySetInnerHTML={{ __html: `
            if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
            window.scrollTo(0, 0);
            `}} />
            {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
