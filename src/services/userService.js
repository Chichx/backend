const UserModel = require("../dao/db/models/users.model")
const { createHash, isValidatePass } = require('../utils/crypt')

class UserManager {
  constructor() {}

  async createNewUser({ first_name, last_name, email, age, password }) {
    try {
        const user = await UserModel.create({
          first_name: first_name,
          last_name: last_name,
          email: email,
          age: age,
          password: createHash(password)
        });

        return { message: "Usuario creado correctamente", userData: user };
      } catch (error) {
        console.log(error);
    }
  }

  async findUser(email, password) {
    try {
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        return { error: "Usuario no encontrado", statusCode: 404 };
      }

      const isValidPassword = isValidatePass(password, user.password);
  
      if (!isValidPassword) {
        return { error: "Contraseña incorrecta", statusCode: 401 };
      }

      return user;
    } catch (error) {
      console.error("Error en findUser:", error);
      return { error: "Error durante la autenticación", statusCode: 500 };
    }
  }
}

module.exports = UserManager;
