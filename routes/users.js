const express = require('express');
const router = express.Router()
const { login, signUp, getUsersByLocation } = require('../controllers/users')

router.post('/login', login)
router.post('/signUp', signUp)
router.get('/location', getUsersByLocation)


module.exports = router