import { Router } from 'express'
import { TasksController } from '../controllers/tasks.controller'

const router = Router()
const tasksController = new TasksController()

router.get('/', tasksController.getAll)
router.get('/:id', tasksController.getById)
router.post('/', tasksController.create)
router.put('/:id', tasksController.update)
router.delete('/:id', tasksController.delete)

export default router
