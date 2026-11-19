import { cookies } from "next/headers";

export const themeCookie = "interview-studio-theme";

export async function getTheme() {
  const cookie = (await cookies()).get(themeCookie);
  return cookie?.value === "dark" ? "dark" : "light";
}
