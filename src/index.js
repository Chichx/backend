const express = require("express")
const http = require('http')
const { Server } = require('socket.io')
const Database = require('./dao/db/mongo/index')

const ChatModel = require('./dao/db/mongo/models/messages.model')

const handlebars = require('express-handlebars')
const routerProd = require("./routes/products.routes")
const routerCart = require("./routes/cart.routes")
const routerHome = require("./routes/home.routes")
const routerRealTimeProducts = require("./routes/realTimeProducts.routes")

const ProductManager = require("./dao/db/mongo/managers/productManager")
const chatRouter = require("./routes/chat.routes")

const productManager = new ProductManager()

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
app.use('/chat', chatRouter)

let msjs =  [] 
//Socket
const io = new Server(server)
io.on('connection', async (socket) =>{
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

  socket.on('new_message', async (data) => {
    const new_message = new ChatModel({
      user: data.name,
      message: data.text,
      date: data.date
    })

    await new_message.save()

    io.sockets.emit('chat_messages', new_message)
  })

  try {
    const messages = await ChatModel.find({});
    socket.emit('chat_messages', messages);
  } catch (error) {
    console.error('Error al obtener mensajes existentes:', error);
  }

})

server.listen(PORT, () => {
    console.log(`Se inicio con el puerto ${PORT}`)
    Database.connect()
})