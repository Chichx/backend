const express = require("express");
const http = require('http');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require("passport");

const Database = require('./dao/db/mongo/index');
const ChatModel = require('./dao/db/models/messages.model');
const ProductService = require("./services/productService");

const routerProd = require("./routes/products.routes");
const routerCart = require("./routes/cart.routes");
const homeProductsRouter = require("./routes/homeproducts.routes");
const routerRealTimeProducts = require("./routes/realTimeProducts.routes");
const chatRouter = require("./routes/chat.routes");
const cartsRouter = require("./routes/carts.routes");
const authRouter = require("./routes/auth.views.routes");
const authApiRouter = require("./routes/auth.routes");
const sessionsRouter = require("./routes/sessions.routes");
const mockingRouter = require("./routes/mockingproducts.routes");

const initPassport = require("./config/passport.config");

const config = require("./config/config")

const auth = require("./middleware/auth");

const productService = new ProductService();

const app = express();

app.use(session({
  store: MongoStore.create({
    mongoUrl: config.MONGO_URL
  }),
  secret: config.SECRET_KEY_SESSION,
  resave: true,
  saveUninitialized: true
}))

initPassport()
app.use(passport.initialize())
app.use(passport.session())

const server = http.createServer(app)

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
app.use('/products', auth, homeProductsRouter)
app.use('/carts', auth, cartsRouter)
app.use('/realtimeproducts', auth, routerRealTimeProducts)
app.use('/chat', auth, chatRouter)
app.use('/', authRouter)
app.use('/auth/', authApiRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/mockingproducts', mockingRouter)
app.use('*', async (req, res) => {
  res.status(404).render("404")
});


//Socket
const io = new Server(server)
io.on('connection', async (socket) =>{
    console.log(`Nuevo cliente conectado ${socket.id}`)

  socket.on("getProducts", async () => {
    try {
      const products = await productService.getProducts({ limit: 10, page: 1, sort: null, query: null });
      socket.emit("productsData", products.payload);
    } catch (error) {
      console.error("Error al obtener productos:", error.message);
    }
  });

  socket.on("addProduct", async (addProd) => {
    try {
      productService.addProduct(addProd);
      const products = await productService.getProducts({ limit: 10, page: 1, sort: null, query: null });
      socket.emit("productsData", products.payload);
    } catch (error) {
      console.error("Error al agregar nuevo producto:", error.message);
    }
  });

  socket.on("deleteProduct", async (productId) => {
    try {
      productService.deleteProduct(productId);
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

server.listen(config.PORT, () => {
    console.log(`Se inicio con el puerto ${config.PORT}`)
    Database.connect()
})