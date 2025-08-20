const express = require("express")
const { addFood, getFoodEntries, deleteFoodEntry} = require("../Controllers/foodController")
const requireAuth = require("../middlewares/authMiddleware")

const router = express.Router()

router.post('/', requireAuth, addFood)
router.get('/', requireAuth, getFoodEntries)
router.delete('/:id', requireAuth, deleteFoodEntry)

module.exports = router