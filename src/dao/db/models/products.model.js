const mongoose = require('mongoose')
const mongoosepaginate = require('mongoose-paginate-v2');

const ProductSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        unique: true
    },
    description: { 
        type: String, 
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    },
    stock: {
        type: Number,
        default: 5
    },
    category: {
        type: String,
        required: true,
        enum:  ['Category 1', 'Category 2', 'Category 3']
    },
    thumbnail: {
        type: String,
    },
});

ProductSchema.plugin(mongoosepaginate);

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product