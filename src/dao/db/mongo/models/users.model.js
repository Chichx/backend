const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
      },
      last_name: {
        type: String,
      },
      age: {
        type: Number,
      },
      email: {
        type: String,
        unique: true,
      },
      password: {
        type: String,
      },
      cart: {
        type: Array,
      },
      role: {
        type: String,
        default: "User"
      }
},
{
  timestamps: true,
  strict: false
});

const User = mongoose.model('Users', UserSchema);

module.exports = User