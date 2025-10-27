const express = require('express');
const router = express.Router(); 
const requireAuth = require("../middlewares/authMiddleware")
const { sendFeedback } = require('../Controllers/feedbackController');


router.post('/', requireAuth, sendFeedback);

module.exports = router;
