const express = require("express")
const {verifyEmail, register, login, logout, resendVerificationEmailLink} = require("../Controllers/authController")

const router = express.Router()

router.get('/verify-email', verifyEmail)
router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.post('/resend-verification', resendVerificationEmailLink)

module.exports = router