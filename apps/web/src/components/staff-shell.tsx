"use client";

import { LayoutGridIcon, SwatchBookIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useRef } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const pages = [
  { label: "Overview", href: "/staff", icon: LayoutGridIcon },
  {
    label: "Design system",
    href: "/staff/design-system",
    icon: SwatchBookIcon,
  },
];

function StaffNavigation() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarContent className="px-2 py-4">
      <nav aria-label="Staff navigation">
        <SidebarMenu className="gap-1">
          {pages.map(({ label, href, icon: Icon }) => {
            const isCurrent = pathname === href;

            return (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton asChild isActive={isCurrent} tooltip={label}>
                  <Link
                    href={href}
                    aria-current={isCurrent ? "page" : undefined}
                    onClick={() => setOpenMobile(false)}
                  >
                    <Icon aria-hidden="true" />
                    <span className="group-data-[collapsible=icon]:sr-only">
                      {label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </nav>
    </SidebarContent>
  );
}

export function StaffShell({
  children,
  themeToggle,
  sidebarOpen,
}: {
  children: ReactNode;
  themeToggle: ReactNode;
  sidebarOpen: boolean;
}) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
      <Sidebar collapsible="icon" mobileTriggerRef={triggerRef}>
        <SidebarHeader className="min-h-16 justify-center border-b px-6 pe-16 md:pe-4">
          <p className="text-base font-bold leading-tight group-data-[collapsible=icon]:sr-only">
            BU Interview Studio
          </p>
        </SidebarHeader>
        <StaffNavigation />
      </Sidebar>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex min-h-16 flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b bg-card px-4 py-1 md:px-6 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <SidebarTrigger ref={triggerRef} />
            <div className="min-w-0">
              <p className="text-sm font-bold md:hidden">BU Interview Studio</p>
              <p className="text-xs text-muted-foreground md:text-sm">
                No business unit selected
              </p>
            </div>
          </div>
          {themeToggle}
        </header>
        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 lg:px-8 lg:py-10"
        >
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
