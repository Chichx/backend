const { Router } = require("express");
const {getProducts, getProductById, addProduct, updateProduct, deleteProduct} = require("../controllers/products.controllers")

const routerProd = Router();

routerProd.get('/', async (req, res) => {getProducts(req, res)});
routerProd.get('/:id', async (req, res) => {getProductById(req, res)});
routerProd.post('/', async (req, res) => {addProduct(req, res)});
routerProd.put('/:id', async (req, res) => {updateProduct(req, res)});
routerProd.delete('/:id', async (req, res) => {deleteProduct(req, res)});

module.exports = routerProd;
