const { Router } = require('express');
const CartManager = require('../services/cartService');
const {addCart, getCart, addProductToCart, removeProductFromCart, updateCart, updateProductQuantity, removeAllProducts} = require('../controllers/cart.controllers')


const cartManager = new CartManager();

const routerCart = Router();

routerCart.post('/', async (req, res) => {addCart(req, res)});
routerCart.get('/:cid', async (req, res) => {getCart(req,res)});
routerCart.post('/:cid/product/:pid', async (req, res) => {addProductToCart(req, res)});
routerCart.delete('/:cid/product/:pid', async (req, res) => {removeProductFromCart(req, res)});
routerCart.put('/:cid', async (req, res) => {updateCart(req, res)});
routerCart.put('/:cid/product/:pid', async (req, res) => {updateProductQuantity(req, res)});
routerCart.delete('/:cid', async (req, res) => {removeAllProducts(req, res)});


module.exports = routerCart;
