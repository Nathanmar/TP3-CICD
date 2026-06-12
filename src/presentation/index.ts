import app from './app.js'
import logger from '../infrastructure/logger/logger.js'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  logger.info({ port: PORT }, 'Data Mock API started')
})
