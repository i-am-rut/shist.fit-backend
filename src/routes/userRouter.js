const express = require('express')
const requireAuth = require('../middlewares/authMiddleware')
const { createUserProfile, updateUserProfile } = require('../Controllers/userController')

const router = express.Router()

router.post('/profile', requireAuth, createUserProfile)
router.patch('/profile', requireAuth, updateUserProfile)

module.exports = router