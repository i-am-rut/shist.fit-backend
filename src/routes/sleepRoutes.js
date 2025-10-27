const express = require("express")
const requireAuth = require("../middlewares/authMiddleware")
const {addSleep, getSleepEntries, deleteSleepEntry, getLastNightSleepEntry, getSleepPast7Days} = require("../Controllers/sleepController")

const router = express.Router()

router.post('/', requireAuth, addSleep)
router.get('/', requireAuth, getLastNightSleepEntry)
router.get('/past-7', requireAuth, getSleepPast7Days)
router.post('/:id', requireAuth, deleteSleepEntry)

module.exports = router