const express = require('express')
const {Router} = express
const { LoginView, RegisterView, Profile } = require('../controllers/auth.views.controllers')


const router = Router()

router.get('/', LoginView)
router.get('/register', RegisterView)
router.get('/profile', Profile)


module.exports = router

