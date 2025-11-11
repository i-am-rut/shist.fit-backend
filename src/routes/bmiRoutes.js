const express = require('express')
const getBMI = require('../Controllers/bmiController')
const requireAuth = require('../middlewares/authMiddleware')


const router = express.Router()

router.get('/', requireAuth, getBMI)

module.exports = router