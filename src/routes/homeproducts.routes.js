const { Router } = require("express")
const ProductManager = require("../dao/db/mongo/managers/productManager")

const productManager = new ProductManager()

const homeProductsRouter = Router()

homeProductsRouter.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query || {};

        const products = await productManager.getProducts({ limit, page, sort, query });

        const productsFinales = products.payload.map(product => ({ ...product.toObject() }));

    
        res.status(200).render("products", {
          products: productsFinales,
        });
    } catch (error) {
        console.log(`Error obteniendo los productos: ${error}`);
    }
});

module.exports = homeProductsRouter

