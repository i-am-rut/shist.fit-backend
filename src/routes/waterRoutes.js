const express = require("express")
const requireAuth = require("../middlewares/authMiddleware")
const {logWater, getWaterLogs, deleteWaterEntry, getTodaysWater, getPast7DaysWater} = require("../Controllers/waterController")

const router = express.Router()

router.post('/', requireAuth, logWater)
router.get('/', requireAuth, getWaterLogs)
router.get('/today', requireAuth, getTodaysWater)
router.get('/past-7', requireAuth, getPast7DaysWater)
router.delete('/:id', requireAuth, deleteWaterEntry)

module.exports = router
