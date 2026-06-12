import express from 'express'
import helmet from 'helmet'
import mockRoutes from './routes/MockRoutes.js'
import logger from '../infrastructure/logger/logger.js'

const app = express()
export const startTime = Date.now()

// Security headers
app.use(helmet())

app.use(express.json())
app.use(express.static('public'))

// HTTP request logger middleware
app.use((req, _res, next) => {
  logger.info({ method: req.method, url: req.url }, 'incoming request')
  next()
})

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

// Metrics endpoint
app.get('/metrics', (_req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000)
  res.status(200).json({
    uptime_seconds: uptimeSeconds,
    version: process.env.npm_package_version ?? '1.0.0',
    timestamp: new Date().toISOString(),
  })
})

// API routes
app.use('/api', mockRoutes)

export default app
