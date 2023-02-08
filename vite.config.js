import { createVuePlugin } from 'vite-plugin-vue2'
import eslintPlugin from 'vite-plugin-eslint'
import { defineConfig } from 'vite'

import { resolve } from 'path'

export default defineConfig({
  root: './example',
  plugins: [
    createVuePlugin(),
    eslintPlugin({
      include: ['src/**/*.vue', 'src/**/*.js'],
      cache: false
    })
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname),
      '@': resolve(__dirname, 'src'),
    },
    dedupe: [],
    conditions: [],
    mainFields: ['module', 'jsnext:main', 'jsnext'],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  server: {
    port: 1735
  }
})
