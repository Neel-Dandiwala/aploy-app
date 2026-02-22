import { existsSync, cpSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineNuxtModule } from '@nuxt/kit'

const __dirname = dirname(fileURLToPath(import.meta.url))

function ensurePaths(nuxt) {
  const buildDir = nuxt.options.buildDir
  const dest = join(buildDir, 'paths.mjs')
  if (existsSync(dest)) return
  const src = join(__dirname, 'paths.mjs')
  if (!existsSync(src)) return
  mkdirSync(buildDir, { recursive: true })
  cpSync(src, dest)
}

export default defineNuxtModule({
  meta: { name: 'ensure-paths' },
  setup(_, nuxt) {
    nuxt.hook('ready', () => ensurePaths(nuxt))
    nuxt.hook('build:before', () => ensurePaths(nuxt))
  },
})
