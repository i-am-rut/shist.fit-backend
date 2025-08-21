const express = require("express")
const requireAuth = require("../middlewares/authMiddleware")
const {addSleep, getSleepEntries, deleteSleepEntry} = require("../Controllers/sleepController")

const router = express.Router()

router.post('/', requireAuth, addSleep)
router.get('/', requireAuth, getSleepEntries)
router.post('/:id', requireAuth, deleteSleepEntry)

module.exports = router