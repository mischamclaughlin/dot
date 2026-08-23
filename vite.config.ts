import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        setupFiles: "./src/test/setup.ts",
        globals: true,
        coverage: {
            provider: "v8",
            reporter: ["text"],
            include: ["src/**/*.{ts,tsx}"],
            exclude: ["src/**/*.test.ts", "src/test/**", "src/**/test/**"],
            thresholds: {
                statements: 95,
                branches: 90,
                functions: 90,
                lines: 95,
                "src/domain/**/*.ts": {
                    100: true,
                },
                "src/application/**/*.ts": {
                    100: true,
                },
            },
        },
    },
});
