const { Router } = require("express")
const fs = require("fs");
const crypto = require("crypto")

function idRandom() {
  return crypto.randomBytes(8).toString('hex');
}

const routerCart = Router()

routerCart.post('/', async (req, res) => {
    const cartId = idRandom()
    const newCart = ({
        id: cartId,
        products: []
    })

    const carts = JSON.parse(fs.readFileSync("../json/carrito.json", { encoding: 'utf-8' }));
    carts.push(newCart);
    fs.writeFileSync("../json/carrito.json", JSON.stringify(carts, null, 2), {encoding: 'utf-8'});

    res.json(newCart);
})

routerCart.get('/:cid', async (req, res) => {
    const cid = req.params.cid
    const carts = JSON.parse(fs.readFileSync("../json/carrito.json", { encoding: 'utf-8' }));
    const cart = carts.find(cart => cart.id === cid);

    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).send("Carrito no encontrado");
    }
})

routerCart.post('/:cid/product/:pid', async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const quantity = 1

    const carts = JSON.parse(fs.readFileSync("../json/carrito.json", { encoding: 'utf-8' }))

    const cart = carts.find(cart => cart.id === cid)

    if (!cart) {
        res.status(404).send("Carrito no encontrado");
        return;
    }

    const products = JSON.parse(fs.readFileSync("../json/products.json", { encoding: 'utf-8' }))

    const productExiste = products.find(product => product.id === pid)

    if (!productExiste) {
        res.status(404).send("Producto no encontrado en la lista de productos");
        return;
    }

    const productInCart = cart.products.find(product => product.id === pid)

    if (productInCart) {
        productInCart.quantity++;
    } else {
        cart.products.push({
            id: pid,
            quantity: quantity
        })
    }

    fs.writeFileSync("../json/carrito.json", JSON.stringify(carts, null, 2), {encoding: 'utf-8'});

    res.json(cart)
})
  

module.exports = routerCart;
