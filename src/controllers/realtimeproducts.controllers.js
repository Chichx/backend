function realTimeProducts(req, res) {
    try {
    
        res.status(200).render("realTimeProducts", { js: "realTimeProducts.js"})

    } catch (error) {
        req.logger.error(`Error realTimeProducts: ${error}`);
    }
}

module.exports = {realTimeProducts}