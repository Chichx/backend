const { Router } = require("express")
const { ChatView } = require( "../controllers/chat.controllers")


const chatRouter = Router()

chatRouter.get('/', async (req, res) => {ChatView(req, res)})

module.exports = chatRouter
