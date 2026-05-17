import { Router } from 'express'
import { AnalyticsController } from '../controllers/analytics.controller'

const router = Router()
const analyticsController = new AnalyticsController()

router.get('/productivity', analyticsController.getProductivity)
router.get('/tasks-completed', analyticsController.getTasksCompleted)
router.get('/mood-trends', analyticsController.getMoodTrends)
router.get('/finance-summary', analyticsController.getFinanceSummary)

export default router
