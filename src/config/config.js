const dotenv = require('dotenv');
dotenv.config();

const config = {
    PORT: process.env.PORT || 8085,
    MONGO_URL: process.env.MONGO_URL || 'mongodb+srv://chicho:chicho123@chichocoder.cpdxtvh.mongodb.net/ecommerce',
    SECRET_KEY_SESSION: process.env.SECRET_KEY_SESSION  || 'secret',
    NODEMAILER_EMAIL: process.env.NODEMAILER_EMAIL || 'gastondalla@gmail.com',
    NODEMAILER_PASSWORD: process.env.NODEMAILER_PASSWORD || '',
};

module.exports = config;
