const express = require('express')
const {Router} = express
const { Login, Register, Logout } = require('../controllers/auth.controllers')

const router = Router()

router.post("/login", async (req, res) => {Login(req, res)});
router.post("/register", async (req, res) => {Register(req, res)})
router.get("/logout", (req, res) => {Logout(req, res)})

module.exports = router

