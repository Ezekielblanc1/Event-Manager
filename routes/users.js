const express = require('express');
const router = express.Router()
const { login, signUp, getUsersByLocation, getUsersCount } = require('../controllers/users')

router.post('/login', login)
router.post('/signUp', signUp)
router.get('/count', getUsersCount)
router.get('/location', getUsersByLocation)


module.exports = router