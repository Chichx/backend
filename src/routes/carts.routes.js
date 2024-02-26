const { Router } = require("express");
const CartManager = require("../dao/db/mongo/managers/cartManager");

const cartManager = new CartManager();

const cartsRouter = Router();

cartsRouter.get('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartManager.getCart(cid);

        const cartProducts = cart.cart.map(cartProduct => ({
            product: cartProduct.product.toObject(),
            quantity: cartProduct.quantity,
          }));
    
        if (cart.success) {
          res.status(200).render("carts", {
            cartProduct: cartProducts,
          });
        } else {
          res.status(404).json({ message: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = cartsRouter;
