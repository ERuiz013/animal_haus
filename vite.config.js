import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import os from 'node:os'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: '/',
  cacheDir: path.join(os.homedir(), '.vite-cache', 'rjs_animal_haus'),
}))
