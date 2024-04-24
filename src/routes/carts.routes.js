const { Router } = require("express");
const {getCart, PurchaseCart} = require( "../controllers/carts.controllers")

const cartsRouter = Router();

cartsRouter.get('/:cid', async (req, res) => {getCart(req, res)});
cartsRouter.get('/:cid/purchase', async (req, res) => {PurchaseCart(req, res)});

module.exports = cartsRouter;
