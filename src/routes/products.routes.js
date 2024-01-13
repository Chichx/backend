const { Router } = require("express")
const ProductManager = require("../models/productManager")

const productManager = new ProductManager('../json/products.json')

//Crud de productos
const routerProd = Router()

routerProd.get('/', async (req, res) => {
    const {limit} = req.query
    const prods = productManager.getProducts()
    const products = prods.slice(0, limit)
    res.status(200).send(products)
})

routerProd.get('/:id', async (req, res) => {
    const {id} = req.params;
    const prod = productManager.getProductById(id)

    if(prod) {
        res.status(200).send(prod)
    } else {
        res.status(404).send({message:"No se ha encontrado el product"})
    }

})

routerProd.post('/', async (req, res) => {
    const conf = productManager.addProduct(req.body)

    const {title, description, price, code, status, stock, category, thumbanails} = req.body

    if (!title || !description || !price || !code || !status || !stock || !category) {
        return res.status(400).send({ message: 'Faltan datos por completar' })
    }

   if (conf) {
        res.status(201).send("Producto creado")
    } else {
        res.status(400).send("Producto ya existente")
    }
})

routerProd.put('/:id', async (req, res) => {
    const {id} = req.params;

    if ('id' in req.body) {
        res.status(400).send('No se puede cambiar la ID del producto.');
        return false;
    }

    const conf = productManager.updateProduct(id, req.body)

    if (conf) {
        res.status(200).send("Producto actualizado correctamente")
    } else {
        res.status(404).send("Producto no encontrado")
    }

})

routerProd.delete('/:id', async (req, res) => {
    const {id} = req.params;

    const conf = productManager.deleteProduct(id)
    if (conf) {
        res.status(200).send("Producto eliminado correctamente")
    } else {
        res.status(404).send("Producto no encontrado")
    }
})

module.exports = routerProd