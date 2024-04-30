const UserService = require('../services/userService');
const userService = new UserService();
const CustomError = require("../services/errors/CustomError")
const EnumError = require("../services/errors/ErrorEnum")
const { generateUserErrorMessage, existingUser } = require("../services/errors/MessagesError")


async function Login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await userService.findUser(email, password);
  
      if (user.error) {
        res.status(user.statusCode).json({ message: user.error });
      } else {
        req.session.user = user;
        res.status(200).redirect('/products');
      }
    } catch (error) {
      console.error("Error", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
}

async function Register(req, res) {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !email) {
      return CustomError.createError({
          name: 'User creation error',
          cause: generateUserErrorMessage({ first_name, last_name, email, age, password }),
          message: 'All fields are required!',
          code: EnumError.INVALID_TYPES_ERROR
      });
  }

    try {
      await userService.createNewUser({
        first_name,
        last_name,
        email,
        age,
        password,
      });
  
      res.status(200).redirect("/");
    } catch (error) {
      res.status(500).json(error);
    }
}

async function Logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
          res.status(500).json({ message: "Error al cerrar sesion" });
        } else {
          res.status(200).redirect("/");
        }
      });
}

module.exports = { Login, Register, Logout };