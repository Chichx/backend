const express = require("express")
const http = require('http')
const { Server } = require('socket.io')

const handlebars = require('express-handlebars')
const routerProd = require("./routes/products.routes")
const routerCart = require("./routes/cart.routes")
const routerHome = require("./routes/home.routes")
const routerRealTimeProducts = require("./routes/realTimeProducts.routes")

const ProductManager = require("./models/productManager")

const productManager = new ProductManager('../json/products.json')

const app = express()
const server = http.createServer(app)
const PORT = 8080 || process.env.PORT;

//Carpeta static
app.use(express.static(__dirname + '/public'))

//Motor de plantilla
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//Routes
app.use('/api/products', routerProd) 
app.use('/api/carts', routerCart) 
app.use('/home', routerHome)
app.use('/realtimeproducts', routerRealTimeProducts)

//Socket
const io = new Server(server)
io.on('connection', (socket) =>{
    console.log(`Nuevo cliente conectado ${socket.id}`)

  socket.on("getProducts", async () => {
    try {
      const products = await productManager.getProducts();
      socket.emit("productsData", products);
    } catch (error) {
      console.error("Error al obtener productos:", error.message);
    }
  });

  socket.on("addProduct", async (addProd) => {
    try {
      productManager.addProduct(addProd);
      const products = await productManager.getProducts();
      socket.emit("productsData", products);
    } catch (error) {
      console.error("Error al agregar nuevo producto:", error.message);
    }
  });

  socket.on("deleteProduct", async (productId) => {
    try {
      productManager.deleteProduct(productId);
      socket.emit("productDeleted", productId);
    } catch (error) {
      console.error("Error al eliminar producto:", error.message);
    }
  });

})

server.listen(PORT, () => {
    console.log(`Se inicio con el puerto ${PORT}`)
})