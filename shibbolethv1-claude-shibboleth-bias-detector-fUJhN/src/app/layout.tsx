import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Shibboleth | AI Bias Detector",
  description: "Expose the hidden biases in frontier AI models. Force AIs to judge any topic as simply GOOD or BAD — revealing their true ideological allegiances.",
  keywords: ["AI bias", "AI alignment", "Claude", "GPT", "Gemini", "Grok", "AI ethics", "AI transparency"],
  authors: [{ name: "Covenant Labs" }],
  openGraph: {
    title: "Shibboleth | AI Bias Detector",
    description: "Expose the hidden biases in frontier AI models. Force AIs to judge any topic as simply GOOD or BAD.",
    type: "website",
    url: "https://shibboleth.covenantlabs.ai",
    siteName: "Shibboleth",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shibboleth | AI Bias Detector",
    description: "Expose the hidden biases in frontier AI models.",
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
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0a0a0a] text-white min-h-screen">
        <Header />
        <main className="min-h-[calc(100vh-65px)]">
          {children}
        </main>
        <footer className="border-t border-zinc-800 py-8">
          <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-zinc-600">©2025</span>
              <a 
                href="https://covenantlabs.ai" 
                className="font-mono text-xs text-zinc-500 hover:text-sky-400 transition-colors"
              >
                COVENANT LABS
              </a>
            </div>
            <div className="font-mono text-xs text-zinc-700 italic">
              &ldquo;Not your models, not your mind.&rdquo;
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
