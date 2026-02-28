import { defineConfig } from 'vite';

export default defineConfig({
    base: '/OilCalcApp-Web/',
    root: '.',
    build: {
        outDir: 'dist',
    },
    server: {
        port: 5173,
        open: false,
    },
});
