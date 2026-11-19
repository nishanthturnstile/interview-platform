import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/db/**/*.test.mjs"],
    testTimeout: 120_000,
  },
});
