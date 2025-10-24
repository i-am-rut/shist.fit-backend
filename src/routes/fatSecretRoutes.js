const express = require("express");
const router = express.Router();
const { getFoodInfo, searchFoods } = require("../Controllers/fatSecretController");
const requireAuth = require("../middlewares/authMiddleware");

router.get("/search", requireAuth, searchFoods);
router.get("/food", requireAuth, getFoodInfo);

module.exports = router;
