import { defineConfig } from 'prisma/config'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  migrations: {
    seed: 'tsx prisma/seed.ts',  // Seed-Befehl für TypeScript
  },
  datasource: {
    // Lese DATABASE_URL aus .env
    url: process.env.DATABASE_URL || 'file:./dev.db',
  },
})