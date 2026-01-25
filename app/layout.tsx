import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Providers from "@/lib/providers";
import { SessionProviderWrapper } from "@/components/core-ui-new/SessionProviderWraper";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Home | arahkanan.com",
  description: "nformasi tentang acara sekitar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} antialiased`}>
        <SessionProviderWrapper>
          <Providers>{children}</Providers>
          <div id="portal-root" />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
