import { expect, type Locator, test } from "@playwright/test";

test("redirects to the staff workspace and serves Tailwind CSS", async ({
  request,
}) => {
  const redirect = await request.get("/", { maxRedirects: 0 });
  expect(redirect.status()).toBe(307);
  expect(redirect.headers().location).toBe("/staff");

  const response = await request.get("/");

  await expect(response).toBeOK();
  const markup = await response.text();
  expect(markup).toMatch(/<h1\b[^>]*>Staff workspace<\/h1>/);

  const stylesheet = markup.match(/href="([^"]+\.css)"/)?.[1];
  if (!stylesheet) {
    throw new Error("The production page did not link a stylesheet.");
  }

  const css = await request.get(stylesheet);
  await expect(css).toBeOK();
  expect(await css.text()).toMatch(/\.bg-card\s*\{/);
});

const palettes = {
  light: {
    canvas: "rgb(247, 246, 244)",
    card: "rgb(255, 255, 255)",
    primary: "rgb(198, 75, 22)",
    hover: "rgb(173, 62, 16)",
    pressed: "rgb(144, 51, 12)",
    input: "rgb(130, 122, 116)",
    ring: "rgb(165, 60, 16)",
    accent: "rgb(252, 233, 221)",
  },
  dark: {
    canvas: "rgb(25, 24, 23)",
    card: "rgb(36, 34, 32)",
    primary: "rgb(255, 152, 101)",
    hover: "rgb(255, 171, 130)",
    pressed: "rgb(241, 138, 91)",
    input: "rgb(145, 135, 127)",
    ring: "rgb(255, 171, 130)",
    accent: "rgb(72, 43, 32)",
  },
};

async function expectTextContrast(locator: Locator) {
  const ratio = await locator.evaluate((element) => {
    const { color, backgroundColor } = getComputedStyle(element);
    function luminance(rgb: string) {
      const channels = rgb.match(/^rgb\((\d+), (\d+), (\d+)\)$/);
      if (!channels)
        throw new Error(`Expected an opaque RGB color, got ${rgb}`);
      const [red, green, blue] = channels.slice(1).map((channel) => {
        const value = Number(channel) / 255;
        return value <= 0.04045
          ? value / 12.92
          : ((value + 0.055) / 1.055) ** 2.4;
      });
      return red * 0.2126 + green * 0.7152 + blue * 0.0722;
    }
    const colors = [luminance(color), luminance(backgroundColor)];
    return (Math.max(...colors) + 0.05) / (Math.min(...colors) + 0.05);
  });
  expect(ratio).toBeGreaterThanOrEqual(4.5);
}

for (const [theme, palette] of Object.entries(palettes)) {
  test(`renders the documented ${theme} colors and interactive states`, async ({
    page,
    baseURL,
  }) => {
    const externalRequests: string[] = [];
    page.on("request", (request) => {
      if (new URL(request.url()).origin !== baseURL)
        externalRequests.push(request.url());
    });
    await page.goto("/staff/design-system");
    const toggle = page.getByRole("button", { name: "Dark mode" });
    if (theme === "dark") await toggle.click();
    await expect(toggle).toHaveAttribute(
      "aria-pressed",
      String(theme === "dark"),
    );
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      palette.canvas,
    );
    await expectTextContrast(page.locator("body"));

    const primary = page.getByRole("button", { name: "Open dialog" });
    await expect(primary).toHaveCSS("background-color", palette.primary);
    await expect(primary).toHaveCSS("border-radius", "4px");
    await expectTextContrast(primary);
    await primary.hover();
    await expect(primary).toHaveCSS("background-color", palette.hover);
    await expectTextContrast(primary);
    await page.mouse.down();
    await expect(primary).toHaveCSS("background-color", palette.pressed);
    await expectTextContrast(primary);
    await page.mouse.up();
    await expect(
      page.getByRole("dialog", { name: "Dialog example" }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(primary).toBeFocused();

    const input = page.getByRole("textbox", { name: "Example name" });
    await expect(input).toHaveCSS("background-color", palette.card);
    await expect(input).toHaveCSS("border-top-color", palette.input);
    await input.focus();
    await expect(input).toHaveCSS("outline-color", palette.ring);
    await expect(input).toHaveCSS("outline-width", "2px");
    await expect(input).toHaveCSS("outline-offset", "2px");

    const current = page.getByRole("link", { name: "Design system" });
    await expect(current).toHaveAttribute("aria-current", "page");
    await expect(current).toHaveCSS("background-color", palette.accent);
    await expect(current).toHaveCSS(
      "border-inline-start-color",
      palette.primary,
    );
    await expectTextContrast(current);

    for (const label of [
      "Saved",
      "Action needed",
      "Pending",
      "Failed",
      "Unassessed",
    ]) {
      await expectTextContrast(page.getByText(label, { exact: true }));
    }

    const role = page.getByRole("combobox", { name: "Workspace role" });
    await role.click();
    await page.getByRole("option", { name: "HR coordinator" }).click();
    await expect(role).toHaveText("HR coordinator");

    const checkbox = page.getByRole("checkbox", {
      name: "Include archived records",
    });
    await checkbox.focus();
    await page.keyboard.press("Space");
    await expect(checkbox).toBeChecked();
    expect(externalRequests).toEqual([]);
  });
}

test("persists the theme across both layouts and reloads", async ({ page }) => {
  await page.goto("/staff");
  const toggle = page.getByRole("button", { name: "Dark mode" });
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("html")).toHaveClass("dark");

  await page.getByRole("link", { name: "Open candidate preview" }).click();
  await expect(page).toHaveURL(/\/candidate$/);
  await expect(
    page.getByRole("heading", { name: "Candidate workspace" }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Staff navigation" }),
  ).toHaveCount(0);
  await page.reload();
  await expect(page.locator("html")).toHaveClass("dark");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    palettes.light.canvas,
  );
});

test("mobile navigation supports keyboard focus and reduced motion at 320px", async ({
  browserName,
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/staff/design-system");

  // On macOS, WebKit uses Option-Tab to include links in keyboard navigation.
  const tabKey =
    browserName === "webkit" && process.platform === "darwin"
      ? "Alt+Tab"
      : "Tab";
  await page.keyboard.press(tabKey);
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    320,
  );

  const theme = page.getByRole("button", { name: "Dark mode" });
  await theme.click();
  await expect(theme).toHaveAttribute("aria-pressed", "true");

  const trigger = page.getByRole("button", { name: "Toggle navigation" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const sheet = page.getByRole("dialog", { name: "Staff navigation" });
  await expect(sheet).toBeVisible();
  await expect(sheet).toHaveCSS("background-color", palettes.dark.card);
  await expect(sheet).toHaveCSS("animation-name", "none");
  await page.keyboard.press(tabKey);
  await expect(sheet.locator(":focus")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(sheet).toBeHidden();
  await expect(trigger).toBeFocused();

  await page.goto("/candidate");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    320,
  );
});

test("both layouts fit at 200% text size and load local assets", async ({
  page,
  baseURL,
}) => {
  const externalRequests: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).origin !== baseURL)
      externalRequests.push(request.url());
  });
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const [route, heading] of [
    ["/staff", "Staff workspace"],
    ["/staff/design-system", "Design system"],
    ["/candidate", "Candidate workspace"],
  ]) {
    await page.goto(route);
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    expect(
      await page.evaluate(() => {
        const { scrollWidth, clientWidth } = document.documentElement;
        return scrollWidth - clientWidth;
      }),
    ).toBe(0);
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  }
  expect(externalRequests).toEqual([]);
});
