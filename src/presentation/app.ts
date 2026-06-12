import express from 'express'
import mockRoutes from './routes/MockRoutes.js'
import logger from '../infrastructure/logger/logger.js'

const app = express()
export const startTime = Date.now()

app.use(express.json())
app.use(express.static('public'))

app.use((req, _res, next) => {
  logger.info({ method: req.method, url: req.url }, 'incoming request')
  next()
})

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

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

app.use('/api', mockRoutes)

export default app
