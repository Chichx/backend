const express = require('express')
const passport = require('passport')
const { Router } = express

const router = Router()

router.get('/github', passport.authenticate('github', {})) 

router.get('/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) =>{
    req.session.user = req.user

    return res.redirect('/products');
}) 

module.exports = router