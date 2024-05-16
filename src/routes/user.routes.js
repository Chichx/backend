const { Router } = require('express');
const {toggleUserRole} = require('../controllers/user.controllers')


const router = Router()

router.put('/premium/:uid', toggleUserRole)

module.exports = router