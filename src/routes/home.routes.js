const { Router } = require("express")
const ProductManager = require("../dao/db/mongo/managers/productManager")

const productManager = new ProductManager()

const homeRouter = Router()

homeRouter.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();

    
        res.status(200).render("home", {
          products: products,
        });
    } catch (error) {
        console.log(`Error obteniendo los productos: ${error}`);
    }
});

module.exports = homeRouter

