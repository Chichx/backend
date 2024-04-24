const { Router } = require("express")
const {HomeView} = require("../controllers/home.controllers")

const homeProductsRouter = Router()

homeProductsRouter.get('/', async (req, res) => {HomeView(req, res)});


module.exports = homeProductsRouter

