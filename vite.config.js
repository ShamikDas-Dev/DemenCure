import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),

                dashboard:
                    resolve(__dirname, "dashboard.html"),

                progress:
                    resolve(__dirname, "progress.html"),

                memoryGame:
                    resolve(__dirname, "memory-game.html"),

                sequenceGame:
                    resolve(__dirname, "sequence-game.html"),

                matchingGame:
                    resolve(__dirname, "matching-game.html"),

                reminder:
                    resolve(__dirname, "reminder.html")
            }
        }
    }
});