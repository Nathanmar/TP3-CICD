import express from 'express'
import mockRoutes from './routes/MockRoutes.js'

const app = express()
// Apply Middleware
app.use(express.json())
app.use(express.static('public'))

const PORT = process.env.PORT || 3000

// Apply Routes
app.use('/api', mockRoutes)

app.listen(PORT, () => {
  console.log(`🚀 Data Mock API running on http://localhost:${PORT}`)
})
