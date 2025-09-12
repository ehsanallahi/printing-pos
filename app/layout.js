import { Inter } from "next/font/google";
import "./globals.css";
// 1. Import the Providers component
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SRA Digital Printers",
  description: "POS for Printing Agency",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 2. Wrap your children with the Providers component */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}