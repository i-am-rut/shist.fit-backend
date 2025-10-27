const express = require("express")
const requireAuth = require("../middlewares/authMiddleware")
const {addWeight, getWeightEntries, deleteWeightEntry, getCurrentWeight, getWeightPast7Days} = require("../Controllers/weightController")

const router = express.Router()

router.post('/', requireAuth, addWeight)
// router.get('/', requireAuth, getWeightEntries)
router.get('/', requireAuth, getCurrentWeight)
router.get('/past-7', requireAuth, getWeightPast7Days)
router.delete('/:id', requireAuth, deleteWeightEntry)

module.exports = router