function realTimeProducts(req, res) {
    try {
    
        res.status(200).render("realTimeProducts", { js: "realTimeProducts.js"})

    } catch (error) {
        console.log(`Error obteniendo los productos: ${error}`);
    }
}

module.exports = {realTimeProducts}