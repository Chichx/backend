const mongoose = require("mongoose")

module.exports = {
    connection: null,
    connect: () => {
        return mongoose.connect(process.env.MONGO_URL)
        .then(() => {
            console.log('Conexión a la base de datos exitosa')
        })
        .catch((err) =>{
            console.error(`Error al conectar a la base de datos: ${err}`)
        });
    }
}