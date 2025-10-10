const express = require('express')
const { addSteps, getStepsByDate, getStepsByRange } = require('../Controllers/stepsController')
const requireAuth = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/', requireAuth, addSteps)
router.get('/', requireAuth, getStepsByRange)
router.get('/by-date', requireAuth, getStepsByDate)

module.exports = router