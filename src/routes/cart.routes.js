const { Router } = require('express');
const CartManager = require('../dao/db/mongo/managers/cartManager');

const cartManager = new CartManager();

const routerCart = Router();

routerCart.post('/', async (req, res) => {
  try {
    const cart = await cartManager.addCart();

    if (cart.success) {
      res.status(201).json({ data: cart.cart });
    } else {
      res.status(500).json({ message: 'Error al agregar el carrito' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

routerCart.get('/:cid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartManager.getCart(cid);

    if (cart.success) {
      res.status(200).json(cart.cart);
    } else {
      res.status(404).json({ message: 'Carrito no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

routerCart.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;

    const result = await cartManager.addProductToCart(cid, pid);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.error || 'Error interno del servidor' });
  }
});

module.exports = routerCart;
