const express = require('express')
const {Router} = express
const { LoginView, RegisterView, Profile } = require('../controllers/auth.views.controllers')

const router = Router()

router.get('/', (req, res) => {LoginView(req, res)})
router.get('/register', (req, res) => {RegisterView(req, res)})
router.get('/profile', (req, res) => {Profile(req, res)})

module.exports = router

