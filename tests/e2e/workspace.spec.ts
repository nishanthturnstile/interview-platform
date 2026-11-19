import { expect, test } from "@playwright/test";

test("serves the workspace page and Tailwind CSS from the production build", async ({
  request,
}) => {
  const response = await request.get("/");

  await expect(response).toBeOK();
  const markup = await response.text();
  expect(markup).toMatch(/<h1\b[^>]*>BU Interview Studio<\/h1>/);

  const stylesheet = markup.match(/href="([^"]+\.css)"/)?.[1];
  if (!stylesheet) {
    throw new Error("The production page did not link a stylesheet.");
  }

  const css = await request.get(stylesheet);
  await expect(css).toBeOK();
  expect(await css.text()).toMatch(/\.text-3xl\s*\{/);
});
