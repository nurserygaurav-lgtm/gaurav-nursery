import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs'
import os from 'os'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getDatasourceUrl(): string {
  // If running on Vercel or serverless environment
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDir = os.tmpdir()
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true })
    }
    const tmpDbPath = path.join(tmpDir, 'dev.db')

    let dbExists = false
    try {
      if (fs.existsSync(tmpDbPath)) {
        const stats = fs.statSync(tmpDbPath)
        if (stats.size > 0) {
          dbExists = true
        }
      }
    } catch {
      // Ignore stat error
    }

    if (!dbExists) {
      const candidates = [
        path.join(process.cwd(), 'prisma', 'dev.db'),
        path.join(process.cwd(), 'dev.db'),
        path.join(__dirname, '..', '..', 'prisma', 'dev.db'),
        path.join(__dirname, '..', 'prisma', 'dev.db'),
        path.join(__dirname, 'prisma', 'dev.db'),
        path.join(__dirname, 'dev.db'),
      ]

      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          try {
            fs.copyFileSync(candidate, tmpDbPath)
            console.log(`[PRISMA] Initialized /tmp/dev.db from ${candidate}`)
            break
          } catch (err) {
            console.error(`[PRISMA] Error copying database from ${candidate}:`, err)
          }
        }
      }
    }

    return `file:${tmpDbPath}`
  }

  return process.env.DATABASE_URL || 'file:./prisma/dev.db'
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDatasourceUrl(),
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

