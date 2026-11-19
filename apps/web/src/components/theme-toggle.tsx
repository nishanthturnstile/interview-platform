import { MoonIcon, SunIcon } from "lucide-react";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { getTheme, themeCookie } from "@/lib/theme";

async function saveTheme(formData: FormData) {
  "use server";

  const theme = formData.get("theme");
  if (theme === "light" || theme === "dark") {
    (await cookies()).set(themeCookie, theme, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
}

export async function ThemeToggle() {
  const dark = (await getTheme()) === "dark";

  return (
    <form action={saveTheme}>
      <input name="theme" type="hidden" value={dark ? "light" : "dark"} />
      <Button
        variant="ghost"
        size="icon"
        type="submit"
        aria-label="Dark mode"
        aria-pressed={dark}
        title="Dark mode"
      >
        {dark ? (
          <MoonIcon aria-hidden="true" />
        ) : (
          <SunIcon aria-hidden="true" />
        )}
      </Button>
    </form>
  );
}
