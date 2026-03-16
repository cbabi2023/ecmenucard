import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EC Fresh Point | Premium Fresh Menu & Ordering",
  description: "Discover EC Fresh Point's premium fresh menu, explore curated picks, and order directly via WhatsApp with a fast, elegant experience.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1B5E20",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="appShell">
          <main className="appContent">{children}</main>
        </div>
      </body>
    </html>
  );
}
