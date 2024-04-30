const express = require('express')
const {Router} = express
const { Login, Register, Logout } = require('../controllers/auth.controllers')
const ErrorMiddleware = require('../middleware/errors');

const router = Router()

router.post("/login", Login);
router.post("/register", Register)
router.get("/logout", Logout)
router.use(ErrorMiddleware)

module.exports = router

