const express = require("express");
const router = express.Router();
const { createFeedback } = require("../controllers/feedback");
const isAuth = require("../middleware/isAuth");
// router.post('/')

router.post("/create", isAuth, createFeedback);
module.exports = router;
