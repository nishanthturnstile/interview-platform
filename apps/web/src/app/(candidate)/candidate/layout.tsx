import { ThemeToggle } from "@/components/theme-toggle";

export default function CandidateLayout({
  children,
}: LayoutProps<"/candidate">) {
  return (
    <>
      <header className="border-b bg-card">
        <div className="mx-auto flex min-h-14 max-w-3xl items-center justify-between gap-3 px-4 py-1 md:px-6">
          <p className="font-bold leading-tight">BU Interview Studio</p>
          <ThemeToggle />
        </div>
      </header>
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto grid w-full max-w-3xl gap-6 px-4 py-8 md:px-6 lg:py-10"
      >
        {children}
      </main>
    </>
  );
}
