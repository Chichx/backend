const express = require('express')
const {Router} = express

const router = Router()

router.get('/', (req, res) => {
    res.render('login')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/profile', (req, res) => {
    if (!req.session.user) return res.redirect('/')
    
    let userData = req.session.user;
    res.render("profile", { userData: userData });  
})

module.exports = router

