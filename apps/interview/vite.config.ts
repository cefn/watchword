import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    modulePreload: {
      resolveDependencies: () => [],
    },
  },
  test: {
    coverage: {
      provider: "istanbul", // TODO still requires c8 install!
    },
  },
});
