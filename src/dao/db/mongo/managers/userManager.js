const UserModel = require("../models/users.model")

class UserManager {
  constructor() {}

  async createNewUser({ first_name, last_name, email, age, password }) {
    try {
        const user = await UserModel.create({
          first_name: first_name,
          last_name: last_name,
          email: email,
          age: age,
          password: password
        });

        return { message: "Usuario creado correctamente", userData: user };
      } catch (error) {
        console.log(error);
        if (error.code == 11000) {
            return { error: "El usuario ya existe" };
        } else {
            return { error: error.message };
        }
    }
  }

  async findUser(email, password) {
    try {
        const user = await UserModel.findOne({ email, password })
        return user
  } catch(error) {
    return { error: error.message };
 }
}
}

module.exports = UserManager;
