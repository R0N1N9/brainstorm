import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// A relative base lets the same build run locally and from any GitHub Pages path.
export default defineConfig({ base: './', plugins: [react()] })
