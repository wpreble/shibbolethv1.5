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
      <body
        className="antialiased bg-[#0D0D0D] text-white min-h-screen font-sans"
      >
        <Header />
        <main className="min-h-[calc(100vh-65px)]">
          {children}
        </main>
        <footer className="border-t border-zinc-800 py-8 text-center text-zinc-500 text-sm">
          <p>A <a href="https://covenantlabs.ai" className="text-blue-400 hover:text-blue-300">Covenant Labs</a> Experiment</p>
          <p className="mt-2 font-mono text-xs italic">&quot;Not your models, not your mind.&quot;</p>
        </footer>
      </body>
    </html>
  );
}
