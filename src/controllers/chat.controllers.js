function ChatView(req, res) {
    try {
    
        res.status(200).render("chat", { js: "chat.js"})

    } catch (error) {
        console.log(`Error obteniendo los productos: ${error}`);
    }
}

module.exports = {ChatView}