// const fs = require('fs')
import fs from 'fs'
import { resolve, relative, dirname } from 'path'

let viteConfig

export default function () {
  return {
    name: 'lib-css',
    apply: 'build',
    enforce: 'post',

    configResolved(resolvedConfig) {
      viteConfig = resolvedConfig
    },

    writeBundle(option, bundle) {
      if (!viteConfig.build || !viteConfig.build.lib) {
        // only for lib build
        console.warn('vite-plugin-libcss only works in lib mode.')
        return
      }
      if (option.format !== 'es') {
        // only for es built
        return
      }
      const files = Object.keys(bundle)
      const cssFile = files.find((v) => v.endsWith('.css'))
      if (!cssFile) {
        return
      }
      for (const file of files) {
        if (!bundle[file].isEntry) {
          // only for entry
          continue
        }
        const outDir = viteConfig.build.outDir || 'dist'
        const entryPath = resolve(file)
        const cssPath = resolve(cssFile)
        const relativePath = relative(dirname(entryPath), cssPath)
        console.log(relativePath)
        const filePath = resolve(viteConfig.root, outDir, file)
        const data = fs.readFileSync(filePath, {
          encoding: 'utf8'
        })
        fs.writeFileSync(filePath, `import './${relativePath}'\n${data}`)
      }
    }
  }
}