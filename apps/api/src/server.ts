import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes'
import plannerRoutes from './routes/planner.routes'
import tasksRoutes from './routes/tasks.routes'
import calendarRoutes from './routes/calendar.routes'
import financeRoutes from './routes/finance.routes'
import analyticsRoutes from './routes/analytics.routes'
import subscriptionRoutes from './routes/subscription.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/planner', plannerRoutes)
app.use('/api/tasks', tasksRoutes)
app.use('/api/calendar', calendarRoutes)
app.use('/api/finance', financeRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/subscription', subscriptionRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
