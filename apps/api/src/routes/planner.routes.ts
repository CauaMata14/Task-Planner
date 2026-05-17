import { Router } from 'express'
import { PlannerController } from '../controllers/planner.controller'

const router = Router()
const plannerController = new PlannerController()

router.get('/', plannerController.getAll)
router.get('/:id', plannerController.getById)
router.post('/', plannerController.create)
router.put('/:id', plannerController.update)
router.delete('/:id', plannerController.delete)

export default router
