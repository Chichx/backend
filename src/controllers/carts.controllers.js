const CartService = require("../services/cartService");
const ProductService = require("../services/productService");
const TicketService = require("../services/ticketService");

const cartService = new CartService();
const productService = new ProductService();
const ticketService = new TicketService();


async function getCart(req, res) {
    try {
        const cid = req.params.cid;
        const cart = await cartService.getCart(cid);
  
        const cartProducts = cart.cart.map(cartProduct => ({
            product: cartProduct.product.toObject(),
            quantity: cartProduct.quantity,
            cart: req.session.user.cart
          }));
    
        if (cart.success) {
          res.status(200).render("carts", {
            cartProduct: cartProducts,
            userCart: req.session.user.cart
          });
        } else {
          res.status(404).json({ message: 'Carrito no encontrado' });
        }
    } catch (error) {
        req.logger.error(`Error getCart: ${error}`);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

async function PurchaseCart(req, res) {
    try {
        const cid = req.params.cid;
        const cart = await cartService.getCart(cid);
        
        if (!cart.success) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        const products = cart.cart;

        if (products.length === 0) {
            return res.status(400).json({ message: 'El carrito esta vacio.' });
        }
        
        const productsOutOfStock = [];

        for (const cartProduct of products) {
            const product = await productService.getProductById(cartProduct.product._id);
            
            if (!product || product.stock < cartProduct.quantity) {
                productsOutOfStock.push(cartProduct.product);
            } else {
              await productService.updateProductStock(cartProduct.product._id, cartProduct.quantity);
          }
        }

        if (productsOutOfStock.length > 0) {
          return res.status(400).json({ message: 'Algunos productos no tienen suficiente stock', productsOutOfStock });
      }

        const ticketData = {
            amount: calculateTotalAmount(cart.cart),
            purchaser: req.session.user.email,
            first_name: req.session.user.first_name,
            last_name: req.session.user.last_name
        };

        const ticket = await ticketService.createTicket(ticketData, cart.cart);

        await cartService.removeAllProducts(cid);

        res.render('gracias', {
            ticket: {
                id: ticket._id,
                amount: ticket.amount,
                totalItems: cart.cart.length,
                first_name: ticketData.first_name,
                last_name: ticketData.last_name,
                purchaser: ticketData.purchaser
            }
        });
    } catch (error) {
        req.logger.error(`Error PurchaseCart: ${error}`);

        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

function calculateTotalAmount(products) {
    let totalAmount = 0;
    for (const product of products) {
        totalAmount += product.product.price * product.quantity;
    }
    return totalAmount;
}

module.exports = {getCart, PurchaseCart}