const { defineConfig } = require("vite");
const { resolve } = require("path");

module.exports = defineConfig({
    build: {
        rollupOptions: {
            input: {
                index: resolve(__dirname, "index.html"),
                register: resolve(__dirname, "register.html"),
                dashboard: resolve(__dirname, "dashboard.html"),
                progress: resolve(__dirname, "progress.html"),
                reminder: resolve(__dirname, "reminder.html"),
                memoryGame: resolve(__dirname, "memory-game.html"),
                sequenceGame: resolve(__dirname, "sequence-game.html")
            }
        }
    }
});