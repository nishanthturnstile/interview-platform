import { cookies } from "next/headers";
import { StaffShell } from "@/components/staff-shell";
import { ThemeToggle } from "@/components/theme-toggle";
import { sidebarCookie } from "@/lib/sidebar-cookie";

export default async function StaffLayout({ children }: LayoutProps<"/staff">) {
  const sidebarOpen = (await cookies()).get(sidebarCookie)?.value !== "false";

  return (
    <StaffShell sidebarOpen={sidebarOpen} themeToggle={<ThemeToggle />}>
      {children}
    </StaffShell>
  );
}
