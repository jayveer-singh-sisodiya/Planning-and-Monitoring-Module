import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/Component/navigation/navbar";
import { ThemeProvider } from "../Providers/theme-provider";
import Sidebar from "@/app/Component/navigation/sidebar";

const poppins = Poppins({
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"], // ✅ add subset to avoid Next.js warning
});

export const metadata: Metadata = {
  title: "Planning Module",
  description: "Planning and Monitoring Module",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // ✅ Add lang + suppressHydrationWarning to avoid theme mismatches
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        {/* ✅ Provide system theme safely */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Layout Structure */}
          <Navbar />
          <main className="flex">
            <Sidebar />
            <section className="min-h-screen flex-1">{children}</section>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
