const express = require("express")
const requireAuth = require("../middlewares/authMiddleware")
const {logWater, getWaterLogs, deleteWaterEntry} = require("../Controllers/waterController")

const router = express.Router()

router.post('/', requireAuth, logWater)
router.get('/', requireAuth, getWaterLogs)
router.delete('/:id', requireAuth, deleteWaterEntry)

module.exports = router
