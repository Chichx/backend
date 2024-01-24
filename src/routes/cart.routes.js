const { Router } = require("express")
const CartManager = require("../models/cartManager")

const cartManager = new CartManager()

const routerCart = Router()

routerCart.post('/', async (req, res) => {
    const cart = cartManager.addCart();

    if (cart) {
        res.status(201).json({ data: cart.cart })
    } else {
        res.status(500).json({ message: "Error al agregar el carrito" })
    }
})

routerCart.get('/:cid', async (req, res) => {
    const cid = req.params.cid
    const cart = cartManager.getCart(cid)

    if (cart) {
        res.status(200).send(cart.cart);
    } else {
        res.status(404).json({ message: 'Carrito no encontrado'});
    }
})

routerCart.post('/:cid/product/:pid', async (req, res) => {
    try {
        let cid = req.params.cid;
        let pid = req.params.pid;

        const result = cartManager.addProductToCart(cid, pid);

        res.status(200).send(result)
    } catch (error) {
        res.status(500).send(error.error || "Error interno del servidor");
    }
})
  

module.exports = routerCart;
