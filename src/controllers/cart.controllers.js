const CartService = require('../services/cartService');

const cartService = new CartService();

async function addCart(req, res) {
    try {
        const cart = await cartService.addCart();
    
        if (cart.success) {
          res.status(201).json({ data: cart.cart });
        } else {
          res.status(500).json({ message: 'Error al agregar el carrito' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
      }
}

async function getCart(req, res) {
    try {
        const cid = req.params.cid;
        const cart = await cartService.getCart(cid);
    
        if (cart.success) {
          res.status(200).json(cart.cart);
        } else {
          res.status(404).json({ message: 'Carrito no encontrado' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
      }
}

async function addProductToCart(req, res) {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
    
        const result = await cartService.addProductToCart(cid, pid);
    
        res.status(200).json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.error || 'Error interno del servidor' });
      }
}

async function removeProductFromCart(req, res) {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
  
        const result = await cartService.removeProductFromCart(cid, pid);
  
        if (result.success) {
            res.status(200).send(result);
        } else {
            res.status(404).send({ message: result.message });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error });
    }
}

async function updateCart(req, res) {
    try {
        const cid = req.params.cid;
        const data = req.body.products;
  
        const result = await cartService.updateCart(cid, data);
  
        if (result.success) {
            res.status(200).send(result);
        } else {
            res.status(404).send({ message: result.message });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error });
    }
}

async function updateProductQuantity(req, res) {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = req.body.quantity;
  
        const result = await cartService.updateProductQuantity(cid, pid, quantity);
  
        if (result.success) {
            res.status(200).send(result);
        } else {
            res.status(404).send({ message: result.message });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error });
    }
}

async function removeAllProducts(req, res) {
    try {
        const cid = req.params.cid;
  
        const result = await cartService.removeAllProducts(cid);
  
        if (result.success) {
            res.status(200).send(result);
        } else {
            res.status(404).send({ message: result.message });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error });
    }
}

module.exports = {addCart, getCart, addProductToCart, removeProductFromCart, updateCart, updateProductQuantity, removeAllProducts}