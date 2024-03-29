const express = require("express");
const http = require('http');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require("passport");

const Database = require('./dao/db/mongo/index');
const ChatModel = require('./dao/db/mongo/models/messages.model');
const ProductManager = require("./dao/db/mongo/managers/productManager");

const routerProd = require("./routes/products.routes");
const routerCart = require("./routes/cart.routes");
const homeProductsRouter = require("./routes/homeproducts.routes");
const routerRealTimeProducts = require("./routes/realTimeProducts.routes");
const chatRouter = require("./routes/chat.routes");
const cartsRouter = require("./routes/carts.routes");
const authRouter = require("./routes/auth.views.routes");
const authApiRouter = require("./routes/auth.routes");
const sessionsRouter = require("./routes/sessions.routes");

const initPassport = require("./config/passport.config");

const productManager = new ProductManager();

const app = express();

app.use(session({
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://chicho:chicho123@chichocoder.cpdxtvh.mongodb.net/ecommerce'
  }),
  secret: 'secreto-chicho',
  resave: true,
  saveUninitialized: true
}))
initPassport()
app.use(passport.initialize())
app.use(passport.session())

const server = http.createServer(app)
const PORT = process.env.PORT || 8080;

//Carpeta static
app.use(express.static(__dirname + '/public'))

//Motor de plantilla
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

function auth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/");
  }
}

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
app.use('*', async (req, res) => {
  res.status(404).render("404")
});

//Socket
const io = new Server(server)
io.on('connection', async (socket) =>{
    console.log(`Nuevo cliente conectado ${socket.id}`)

  socket.on("getProducts", async () => {
    try {
      const products = await productManager.getProducts({ limit: 10, page: 1, sort: null, query: null });
      socket.emit("productsData", products.payload);
    } catch (error) {
      console.error("Error al obtener productos:", error.message);
    }
  });

  socket.on("addProduct", async (addProd) => {
    try {
      productManager.addProduct(addProd);
      const products = await productManager.getProducts({ limit: 10, page: 1, sort: null, query: null });
      socket.emit("productsData", products.payload);
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