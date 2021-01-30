const express = require('express');
const router = express.Router()
const { login, signUp, getUsersByLocation, getUsersCount, changePassword, forgotPassword } = require('../controllers/users')

router.post('/login', login)
router.post('/signUp', signUp)
router.post('/changePassword', changePassword)
router.post('/forgot-password', forgotPassword)
router.get('/count', getUsersCount)
router.get('/location', getUsersByLocation)


module.exports = router