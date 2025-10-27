const express = require("express")
const { addFood, getFoodEntries, deleteFoodEntry, getTodaysTotalCalories, getTodaysTotalMacros, getRecentMeals, getTodayFood} = require("../Controllers/foodController")
const requireAuth = require("../middlewares/authMiddleware")

const router = express.Router()

router.post('/', requireAuth, addFood)
// router.get('/', requireAuth, getFoodEntries)
router.get('/calories', requireAuth, getTodaysTotalCalories)
router.get('/macros', requireAuth, getTodaysTotalMacros)
router.get('/recent-meals', requireAuth, getRecentMeals)
router.get('/today', requireAuth, getTodayFood)
router.delete('/:id', requireAuth, deleteFoodEntry)

module.exports = router