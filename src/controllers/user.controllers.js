const UserService = require("../services/userService");

const userService = new UserService()

async function toggleUserRole(req, res) {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: "Debes iniciar sesión para usar esta funcion" });
        }

        const userRole = req.session.user.role

        if (userRole.toLowerCase() !== 'admin') {
            return res.status(403).json({ message: 'No tienes permiso para editar los roles de los usuarios' });
        }

        const { uid } = req.params;
        const updatedUser = await userService.toggleUserRole(uid)
        if (updatedUser.error) {
            res.status(400).json({ error: updatedUser.error });
          } else {
            res.status(200).json({ message: updatedUser.message });
          }
    } catch (error) {
        console.error('Error al cambiar el rol del usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

module.exports = {toggleUserRole}