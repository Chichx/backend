const { Router } = require("express")
const {realTimeProducts} = require("../controllers/realtimeproducts.controllers")

const realTimeProductsRouter = Router()

realTimeProductsRouter.get('/', async (req, res) => {realTimeProducts(req, res)})

module.exports = realTimeProductsRouter
