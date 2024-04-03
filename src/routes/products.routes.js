const { Router } = require("express");
const ProductManager = require("../services/productService");
const { paginate } = require("mongoose-paginate-v2");

const productManager = new ProductManager();

// CRUD de productos
const routerProd = Router();

routerProd.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const prods = await productManager.getProducts({ limit, page, sort, query });
        res.status(200).send(prods);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error });
    }
});

routerProd.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const prod = await productManager.getProductById(id);

        if (prod) {
            res.status(200).send(prod);
        } else {
            res.status(404).send({ message: "No se ha encontrado el producto" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error });
    }
});

routerProd.post('/', async (req, res) => {
    try {
        const conf = await productManager.addProduct(req.body);

        const { name, description, price, code, status, stock, category, thumbnail } = req.body;

        if (!name || !description || !price || !code || !status || !stock || !category) {
            return res.status(400).send({ message: 'Faltan datos por completar' });
        }

        if (conf) {
            res.status(201).send("Producto creado");
        } else {
            res.status(400).send("Producto ya existente");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error });
    }
});

routerProd.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if ('id' in req.body) {
            res.status(400).send('No se puede cambiar la ID del producto.');
            return false;
        }

        const conf = await productManager.updateProduct(id, req.body);

        if (conf) {
            res.status(200).send("Producto actualizado correctamente");
        } else {
            res.status(404).send("Producto no encontrado");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error });
    }
});

routerProd.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const conf = await productManager.deleteProduct(id);

        if (conf) {
            res.status(200).send("Producto eliminado correctamente");
        } else {
            res.status(404).send("Producto no encontrado");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error });
    }
});

module.exports = routerProd;
