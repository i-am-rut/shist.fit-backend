const express = require("express")
const requireAuth = require("../middlewares/authMiddleware")
const {addWeight, getWeightEntries, deleteWeightEntry} = require("../Controllers/weightController")

const router = express.Router()

router.post('/', requireAuth, addWeight)
router.get('/', requireAuth, getWeightEntries)
router.delete('/:id', requireAuth, deleteWeightEntry)

module.exports = router