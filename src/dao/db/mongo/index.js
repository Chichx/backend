const mongoose = require("mongoose")

module.exports = {
    connection: null,
    connect: () => {
        return mongoose.connect("mongodb+srv://chicho:chicho123@chichocoder.cpdxtvh.mongodb.net/ecommerce")
        .then(() => {
            console.log('Conexión a la base de datos exitosa')
        })
        .catch((err) =>{
            console.error(`Error al conectar a la base de datos: ${err}`)
        });
    }
}