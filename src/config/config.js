const dotenv = require('dotenv');
const { Command } = require('commander');

const program = new Command();

program
    .option('-d', 'Variable para debug', false)
    .option('-p <port>', 'Puerto del servidor', 8080)
    .option('--mode <mode>', 'Modo de trabajo', 'develop');
program.parse();

console.log("Mode Option: ", program.opts().mode);

const environment = program.opts().mode;

dotenv.config({
    path: environment === "production" ? "./src/config/.env.production" : "./src/config/.env.development"
});

module.exports = {
    PORT: process.env.PORT || 8085,
    MONGO_URL: process.env.MONGO_URL || 'mongodb+srv://chicho:chicho123@chichocoder.cpdxtvh.mongodb.net/ecommerce',
    SECRET_KEY_SESSION: process.env.SECRET_KEY_SESSION || 'secret',
    NODEMAILER_EMAIL: process.env.NODEMAILER_EMAIL || 'gastondalla@gmail.com',
    NODEMAILER_PASSWORD: process.env.NODEMAILER_PASSWORD || '',
    environment: environment
};
