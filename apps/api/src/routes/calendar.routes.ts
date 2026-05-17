import { Router } from 'express'
import { CalendarController } from '../controllers/calendar.controller'

const router = Router()
const calendarController = new CalendarController()

router.get('/events', calendarController.getEvents)
router.post('/events', calendarController.createEvent)
router.put('/events/:id', calendarController.updateEvent)
router.delete('/events/:id', calendarController.deleteEvent)

export default router
