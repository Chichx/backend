const { Router } = require("express")

const realTimeProductsRouter = Router()

realTimeProductsRouter.get('/', async (req, res) => {
    try {
    
        res.status(200).render("realTimeProducts", { js: "realTimeProducts.js"})

    } catch (error) {
        console.log(`Error obteniendo los productos: ${error}`);
    }
})

module.exports = realTimeProductsRouter
