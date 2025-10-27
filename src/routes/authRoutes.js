const express = require("express")
const {verifyEmail, register, login, logout, resendVerificationEmailLink, changePassword, deleteAccount} = require("../Controllers/authController")
const requireAuth = require("../middlewares/authMiddleware")

const router = express.Router()

router.get('/verify-email', verifyEmail)
router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.post('/resend-verification', resendVerificationEmailLink)
router.patch('/change-password', requireAuth, changePassword)
router.patch('/delete-account', requireAuth, deleteAccount)

module.exports = router