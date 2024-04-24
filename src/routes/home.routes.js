const { Router } = require("express")
const {HomeView} = require("../controllers/home.controllers")

const homeRouter = Router()

homeRouter.get('/', async (req, res) => {HomeView(req, res)});

module.exports = homeRouter

