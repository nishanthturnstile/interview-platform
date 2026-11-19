import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getTheme } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "BU Interview Studio",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const theme = await getTheme();

  return (
    <html lang="en" className={theme === "dark" ? "dark" : undefined}>
      <body>
        <a
          href="#main-content"
          className="sr-only z-60 rounded-md bg-card px-4 py-3 text-accent-foreground underline focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
        >
          Skip to content
        </a>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
