import { Router } from 'express'
import { SubscriptionController } from '../controllers/subscription.controller'

const router = Router()
const subscriptionController = new SubscriptionController()

router.get('/', subscriptionController.getSubscription)
router.post('/checkout', subscriptionController.createCheckoutSession)
router.post('/webhook', subscriptionController.handleWebhook)
router.post('/cancel', subscriptionController.cancelSubscription)

export default router
