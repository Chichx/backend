const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({
    products: [
        {
          id: {
            type: String,
            required: true,
          },
          quantity: {
            type: Number,
            default: 1,
          },
        },
      ],
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart