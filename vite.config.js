import { createVuePlugin } from 'vite-plugin-vue2'
import eslintPlugin from 'vite-plugin-eslint'
import { defineConfig } from 'vite'
import libCss from './build/vite-plugin-libcss.js'
import esbuild from 'rollup-plugin-esbuild'

import { resolve } from 'path'

export default defineConfig({
  root: './example',
  plugins: [
    libCss(),
    createVuePlugin({
      target: 'chrome58'
    }),
    eslintPlugin({
      include: ['src/**/*.vue', 'src/**/*.js'],
      cache: false
    }),
    {
      ...esbuild({
        target: 'chrome64',
        loaders: {
          '.vue': 'js'
        }
      })
    }
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname),
      '@': resolve(__dirname, 'src')
    },
    dedupe: [],
    conditions: [],
    mainFields: ['module', 'jsnext:main', 'jsnext'],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  server: {
    port: 1735
  },
  build: {
    target: 'chrome57',
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.js'),
      name: 'index',
      fileName: (fileName, entryName) => `${entryName}.js`
    },
    outDir: resolve(__dirname, 'lib'),
    sourcemap: true,
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: [
        {
          //打包格式
          format: 'es',
          //让打包目录和项目目录对应
          // preserveModules: true,
          //配置打包根目录
          dir: 'lib'
        },
        {
          format: 'umd',
          dir: 'dist'
        }
      ]
    }
  }
})
