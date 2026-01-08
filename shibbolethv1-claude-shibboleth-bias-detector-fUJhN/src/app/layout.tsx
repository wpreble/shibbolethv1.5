import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { ThemeProvider } from "@/lib/ThemeContext";

export const metadata: Metadata = {
  title: "Shibboleth | AI Bias Detector",
  description: "Expose the hidden biases in frontier AI models. Force AIs to judge any topic as simply GOOD or BAD — revealing their true ideological allegiances.",
  keywords: ["AI bias", "AI alignment", "Claude", "GPT", "Gemini", "Grok", "AI ethics", "AI transparency"],
  authors: [{ name: "Covenant Labs" }],
  icons: {
    icon: "/logo-light.png",
    shortcut: "/logo-light.png",
    apple: "/logo-light.png",
  },
  openGraph: {
    title: "Shibboleth | AI Bias Detector",
    description: "Expose the hidden biases in frontier AI models. Force AIs to judge any topic as simply GOOD or BAD.",
    type: "website",
    url: "https://shibboleth.covenantlabs.ai",
    siteName: "Shibboleth",
    images: ["/logo-light.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shibboleth | AI Bias Detector",
    description: "Expose the hidden biases in frontier AI models.",
    images: ["/logo-light.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-white min-h-screen transition-colors">
        <ThemeProvider>
          <Header />
          <main className="min-h-[calc(100vh-65px)]">
            {children}
          </main>
          <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 sm:py-8 bg-white dark:bg-transparent">
            <div className="max-w-4xl mx-auto px-4 flex flex-col items-center justify-center gap-2 sm:gap-4 text-center">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] sm:text-xs text-zinc-400 dark:text-zinc-600">©2025</span>
                <a 
                  href="https://covenantlabs.ai" 
                  className="font-mono text-[10px] sm:text-xs text-zinc-500 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
                >
                  COVENANT LABS
                </a>
              </div>
              <div className="font-mono text-[10px] sm:text-xs text-zinc-400 dark:text-zinc-700 italic">
                &ldquo;Not your models, not your mind.&rdquo;
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
