const express = require("express")
const routerProd = require("./routes/products.routes")
const routerCart = require("./routes/cart.routes")

const app = express()
const PORT = 8080;

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//Routes
app.use('/api/products', routerProd) 
app.use('/api/carts', routerCart) 

app.listen(PORT, () => {
    console.log(`Se inicio con el puerto ${PORT}`)
})