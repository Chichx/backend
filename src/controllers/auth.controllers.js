const UserService = require('../services/userService');
const userService = new UserService();
const CustomError = require("../services/errors/CustomError")
const EnumError = require("../services/errors/ErrorEnum")
const { generateUserErrorMessage, userLoginError, existingUser } = require("../services/errors/MessagesError")
const UserModel = require("../dao/db/models/users.model")



async function Login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await userService.findUser(email, password);
  
      if (user.error) {
        const error = CustomError.createError({
          name: "User login error",
          cause: userLoginError(user.error),
          message: user.error,
          code: EnumError.INVALID_TYPES_ERROR
        });

        return res.status(user.statusCode).json({ error });
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
    const error = CustomError.createError({
      name: "User creation error",
      cause: generateUserErrorMessage({ first_name, last_name, email, age, password }),
      message: "All fields are required!",
      code: EnumError.INVALID_TYPES_ERROR
    });
    
    return res.status(400).json({ error });
  }

  try {
    const existingUserInDb = await UserModel.findOne({ email });

    if (existingUserInDb) {
        const error = CustomError.createError({
          name: "User creation error",
          cause: existingUser({email}),
          message: "The user with this email already exists.",
          code: EnumError.DATABASE_ERROR
        });
        
        return res.status(409).json({ error });
    }

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