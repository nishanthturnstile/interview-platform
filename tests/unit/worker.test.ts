import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { expect, test } from "vitest";

test("starts the worker entry point as a standalone Node process", () => {
  const entry = fileURLToPath(
    new URL("../../apps/worker/src/index.ts", import.meta.url),
  );
  const output = execFileSync(process.execPath, [entry], {
    encoding: "utf8",
    timeout: 5000,
  });

  expect(output.trim()).toBe(
    "BU Interview Studio worker entry point is ready.",
  );
});
