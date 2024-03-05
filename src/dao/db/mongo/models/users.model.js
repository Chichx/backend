const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
      },
      last_name: {
        type: String,
        required: true,
      },
      age: {
        type: Number,
        required: true,
      },
      email: {
        type: String,
        unique: true,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        default: "User"
      }
});

const User = mongoose.model('Users', UserSchema);

module.exports = User