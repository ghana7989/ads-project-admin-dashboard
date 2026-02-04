import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import netlifyReactRouter from '@netlify/vite-plugin-react-router' // <- add this
import netlify from '@netlify/vite-plugin' // <- add this (optional)

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: [['babel-plugin-react-compiler']],
			},
		}),
		netlifyReactRouter(),
		netlify(), // <- add this (optional)
	],
})
