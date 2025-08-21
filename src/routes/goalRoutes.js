const express = require("express")
const requireAuth = require("../middlewares/authMiddleware")
const {getGoals, setGoals, updateGoals} = require("../Controllers/goalController")

const router = express.Router()

router.get('/', requireAuth, getGoals)
router.post('/', requireAuth, setGoals)
router.patch('/', requireAuth, updateGoals)

module.exports = router