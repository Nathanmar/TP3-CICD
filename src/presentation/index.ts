import express from 'express'
import mockRoutes from './routes/MockRoutes.js'
import logger from '../infrastructure/logger/logger.js'

const app = express()
const startTime = Date.now()

app.use(express.json())
app.use(express.static('public'))

// HTTP request logger middleware
app.use((req, _res, next) => {
  logger.info({ method: req.method, url: req.url }, 'incoming request')
  next()
})

const PORT = process.env.PORT || 3000

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

// Metrics endpoint
app.get('/metrics', (_req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000)
  res.status(200).json({
    uptime_seconds: uptimeSeconds,
    version: process.env.npm_package_version || '1.0.0',
    node_version: process.version,
    timestamp: new Date().toISOString(),
    memory_mb: Math.round(process.memoryUsage().rss / 1024 / 1024),
  })
})

// API routes
app.use('/api', mockRoutes)

app.listen(PORT, () => {
  logger.info({ port: PORT }, 'Data Mock API started')
})
