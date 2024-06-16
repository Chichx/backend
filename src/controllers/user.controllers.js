const UserService = require("../services/userService");
const UserModel = require("../dao/db/models/users.model")
const EmailService = require('../services/emailService');
const emailService = new EmailService();
const userService = new UserService()

async function toggleUserRole(req, res) {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: "Debes iniciar sesion para usar esta funcion" });
        }

        const userRole = req.session.user.role

        if (userRole.toLowerCase() !== 'admin') {
            return res.status(403).json({ message: 'No tienes permiso para editar los roles de los usuarios' });
        }

        const { uid } = req.params;

        const user = await UserModel.findById(uid);
        if (!user) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (user.role === 'User') {
          const documentosRequeridos = ['Identificacion', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
          const userDocuments = user.documents.map(doc => doc.name);
          const todosLosDocumentos = documentosRequeridos.every(doc => userDocuments.includes(doc));
      
          if (!todosLosDocumentos) {
            return res.status(400).json({ message: 'El usuario no cargo su documentacion' });
          }
        }

        const updatedUser = await userService.toggleUserRole(uid)
        if (updatedUser.error) {
            res.status(400).json({ error: updatedUser.error });
          } else {
            res.status(200).json({ message: updatedUser.message });
          }
    } catch (error) {
        req.logger.error(`Error toggleUserRole: ${error}`);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

async function uploadDocuments(req, res) {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Debes iniciar sesion para usar esta función" });
      }
  
      const userId = req.params.uid;
      const user = await UserModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: 'No se subieron archivos' });
      }
  
      const documents = [];
  
      if (req.files.profile) {
        documents.push({
          name: 'Perfil',
          reference: req.files.profile[0].path
        });
      }
  
      if (req.files.product) {
        documents.push({
          name: 'Producto',
          reference: req.files.product[0].path
        });
      }
  
      if (req.files.documents) {
        req.files.documents.forEach(file => {
          documents.push({
            name: file.originalname,
            reference: file.path
          });
        });
      }
  
      user.documents.push(...documents);
      await user.save();
  
      res.status(200).json({ message: 'Documentos subidos correctamente', documents: user.documents });
    } catch (error) {
      req.logger.error(`Error uploadDocuments: ${error}`);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

async function getAllUser(req, res){ 
  try {
    const users = await UserModel.find({}, 'first_name last_name email role');
    res.status(200).json(users);
  } catch (error) {
    req.logger.error(`Error allGetUsers: ${error}`);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

async function deleteInactivityUsers(req, res){
  try {
    const tiempoDeInactividad = 2 * 24 * 60 * 60 * 1000;
    const ahora = new Date();
    const fechaLimite = new Date(ahora - tiempoDeInactividad);

    const inactivityUsers = await UserModel.find({ last_connection: { $lt: fechaLimite } });

    if (inactivityUsers.length === 0) {
      return res.status(404).json({ message: 'No hay usuarios inactivos para eliminar.' });
    }

    let cuentasEliminadas = 0;
    for (const user of inactivityUsers) {
        await emailService.sendAccountDeletionEmail(user.email, user.first_name, user.last_name);
        await UserModel.deleteOne({ _id: user._id });
        cuentasEliminadas++;
    }

    res.status(200).json({ message: `Se eliminaron ${cuentasEliminadas} usuarios inactivos correctamente.` });
  } catch (error) {
    req.logger.error(`Error deleteInactivityUsers: ${error}`);
    res.status(500).json({ message: 'Error interno del servidor' });  
  }
}

module.exports = {toggleUserRole, uploadDocuments, getAllUser, deleteInactivityUsers}