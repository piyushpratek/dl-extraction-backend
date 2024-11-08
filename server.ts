import app from './src/app'
import logger from './src/config/logger'
import connectDB from './src/config/database'
import { PORT } from './src/config/config'

// Handling uncaught Exception
process.on('uncaughtException', (err: Error) => {
    logger.error(`Error: ${err.message}`)
    logger.info('Shutting down the server due to Uncaught Exception')
    process.exit(1)
})
void connectDB.connect()


const server = app.listen(PORT, () => {
    logger.success(`SERVER STARTED ON PORT ${PORT}`)
    logger.success(`HEALTH: http://localhost:${PORT}/api/health \n`)
})

// Unhandled Promise Rejection

process.on('unhandledRejection', (err: Error) => {
    logger.error(`Error: ${err.message}`)
    logger.info('Shutting down the server due to Unhandled Promise Rejection')

    server.close(() => {
        process.exit(1)
    })
})
