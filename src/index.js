const express = require("express")
const ProductManager = require("./app")

const app = express()
const PORT = 8080;

app.use(express.json());

let productsManager = new ProductManager
let products = productsManager.getProductsFromFile()

app.get("/products", (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;

    if (limit) {
      let limit_products = products.slice(0, parseInt(limit))
      res.json(limit_products);
    } else {
      res.json(products);
    }
})

app.get("/products/:id", (req, res) => {
    let id = parseInt(req.params.id)

    let productById = products.find((product) => product.id === id)

    if (productById) {
        res.send(productById)
    } else {
        res.status(404).send({error: "Producto no encontrado"})
    }
})

app.listen(PORT, () => {
    console.log('Se inicio con el puerto 8080')
})