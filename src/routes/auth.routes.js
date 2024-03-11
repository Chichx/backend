const express = require('express')
const {Router} = express
const UserManager = require('../dao/db/mongo/managers/userManager');

const router = Router()
const userManager = new UserManager();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userManager.findUser(email, password);

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
});

  
router.post("/register", async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    try {
      await userManager.createNewUser({
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
  });
  
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ message: "Error al cerrar sesion" });
    } else {
      res.status(200).redirect("/");
    }
  });
})

module.exports = router

