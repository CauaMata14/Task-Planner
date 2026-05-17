import { Router } from 'express'
import { FinanceController } from '../controllers/finance.controller'

const router = Router()
const financeController = new FinanceController()

router.get('/', financeController.getAll)
router.get('/:id', financeController.getById)
router.post('/', financeController.create)
router.put('/:id', financeController.update)
router.delete('/:id', financeController.delete)

export default router
