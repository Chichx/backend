const UserModel = require("../dao/db/models/users.model");
const EmailService = require('../services/emailService');
const emailService = new EmailService();

async function UpdateRole(req, res) {
    const { id } = req.params;
    const { role } = req.body;

    const roleUser = req.session.user.role;
    const isAdmin = roleUser.toLowerCase() === "admin";

    if (!isAdmin) {
        return res.status(401).json({success: false, message: "Acceso no autorizado"});
    }

    try {
        await UserModel.findByIdAndUpdate(id, { role });
        return res.json({ success: true, message: `El rol del usuario (${id}) se actualizó correctamente.` });
    } catch (error) {
        req.logger.error(`Error updateRole: ${error}`);
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
}

async function deleteUser(req, res) {
    const { id } = req.params;

    const roleUser = req.session.user.role;
    const isAdmin = roleUser.toLowerCase() === "admin";

    if(!isAdmin) {
        return res.status(401).json({success: false, message: "Acceso no autorizado"})
    }

    try {
        const user = await UserModel.findById(id);
        if (user) {
            await emailService.sendAccountDeletionEmailByAdmin(user.email, user.first_name, user.last_name);
            await UserModel.findByIdAndDelete(id);
            return res.json({ success: true, message: `El usuario (${id}) se elimino correctamente.` });
        } else {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
        }
    } catch (error) {
        req.logger.error(`Error deleteUser: ${error}`);
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
}

module.exports = { UpdateRole, deleteUser };
