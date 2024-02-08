const CartModel = require("../models/carts.model")
const ProductModel = require('../models/products.model'); 
const crypto = require('crypto');

function generateCartId() {
  return crypto.randomBytes(8).toString('hex');
}

class CartManager {
  constructor() {}

  async addCart() {
    try {
      const cartId = generateCartId();
      const newCart = new CartModel({
        id: cartId,
        products: [],
      });

      await newCart.save();

      return { success: true, cart: newCart };
    } catch (error) {
      console.log(`Error al agregar el carro de compras: ${error}`);
      throw error;
    }
  }

  async getCart(cartId) {
    try {
      const cart = await CartModel.findOne({ _id: cartId });

      if (cart) {
        return { success: true, cart: cart.products };
      } else {
        return { success: false, error: 'Carrito no encontrado' };
      }
    } catch (error) {
      console.log(`Error al obtener el carrito: ${error}`);
      throw error;
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const cart = await CartModel.findOne({ _id: cartId });
      const product = await ProductModel.findOne({ _id: productId }); 

      if (!cart) {
        return { success: false, error: 'Carrito no encontrado' };
      }

      if (!product) {
        return { success: false, error: 'Producto no encontrado en la lista de productos' };
      }

      const productInCart = cart.products.find((item) => item.id === productId);

      if (productInCart) {
        productInCart.quantity++;
      } else {
        cart.products.push({
          id: productId,
          quantity: 1,
        });
      }
  
      await cart.save();

      return { success: true, cart };
    } catch (error) {
      console.log(`Error al agregar producto al carrito: ${error}`);
      throw error;
    }
  }
}

module.exports = CartManager;
