const express = require('express');
const router = express.Router();
const { addReview, getAllRatings, getTalkByRating } = require('../controllers/reviews');
const isAuth = require("../middleware/isAuth");


router.post('/:talkId', isAuth, addReview)
router.get('/allRating/:talkId', getAllRatings)
router.get('/talkByRating', getTalkByRating)
// router.post('/')
module.exports = router
