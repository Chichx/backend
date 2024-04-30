const ProductService = require("../services/productService");
const CustomError = require("../services/errors/CustomError")
const EnumError = require("../services/errors/ErrorEnum")
const { productNotFound, productExist, productFields } = require("../services/errors/MessagesError")

const productService = new ProductService();

async function getProducts(req, res) {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const prods = await productService.getProducts({ limit, page, sort, query });
        res.status(200).send(prods);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error });
    }
}

async function getProductById(req, res) {
    try {
        const { id } = req.params;
        const prod = await productService.getProductById(id);

        if (prod) {
            res.status(200).send(prod);
        } else {
            const error = CustomError.createError({
                name: "Product error",
                cause: productNotFound(prod),
                message: "Producto no encontrado",
                code: EnumError.DATABASE_ERROR
              });
      
              return res.status(404).json({ error });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error });
    }
}

async function addProduct(req, res) {
    try {
        const conf = await productService.addProduct(req.body);

        const { name, description, price, code, status, stock, category, thumbnail } = req.body;

        if (!name || !description || !price || !code || !status || !stock || !category) {
            const error = CustomError.createError({
                name: "Product error",
                cause: productFields({name, description ,price, code, status, stock, category}),
                message: "Faltan datos por completar",
                code: EnumError.DATABASE_ERROR
              });
      
              return res.status(400).json({ error });
        }

        if (conf) {
            res.status(201).send("Producto creado");
        } else {
            const error = CustomError.createError({
                name: "Product error",
                cause: productExist(prod),
                message: "Producto ya existente",
                code: EnumError.DATABASE_ERROR
              });
      
              return res.status(400).json({ error });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error });
    }
}

async function updateProduct(req, res) {
    try {
        const { id } = req.params;

        if ('id' in req.body) {
            res.status(400).send('No se puede cambiar la ID del producto.');
            return false;
        }

        const conf = await productService.updateProduct(id, req.body);

        if (conf) {
            res.status(200).send("Producto actualizado correctamente");
        } else {
            const error = CustomError.createError({
                name: "Product error",
                cause: productNotFound(prod),
                message: "Producto no encontrado",
                code: EnumError.DATABASE_ERROR
              });
      
              return res.status(404).json({ error });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error });
    }
}

async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        const conf = await productService.deleteProduct(id);

        if (conf) {
            res.status(200).send("Producto eliminado correctamente");
        } else {
            const error = CustomError.createError({
                name: "Product error",
                cause: productNotFound(prod),
                message: "Producto no encontrado",
                code: EnumError.DATABASE_ERROR
              });
      
              return res.status(404).json({ error });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error });
    }
}

module.exports = {getProducts, getProductById, addProduct, updateProduct, deleteProduct}