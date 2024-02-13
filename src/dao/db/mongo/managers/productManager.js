const ProductModel = require("../models/products.model")
const crypto = require("crypto")


class ProductManager{
    constructor() {}

    async getProducts(limit) {
      try {
        if (limit) {
          return await ProductModel.find().limit(limit).lean();
        } else {
          return await ProductModel.find().lean();
        }
      } catch (error) {
        console.log(`Error al leer el archivo: ${error}`);
        return [];
      }
    }
    

    async getProductById(id) {
        try {
            return await ProductModel.findById(id);
          } catch (error) {
            console.log(`Error al buscar el producto por ID desde MongoDB: ${error}`);
            return null;
          }
    }

    async addProduct({ name, description, price, code, status, stock, category, thumbnail }) {
        try {
          if (!(await ProductModel.exists({ code }))) {
            const nuevaId = crypto.randomBytes(16).toString('hex');
            const nuevoProducto = new ProductModel({
              id: nuevaId,
              name,
              description,
              price,
              code,
              status,
              stock,
              category,
              thumbnail,
            });
    
            await nuevoProducto.save();
            return true;
          } else {
            return false;
          }
        } catch (error) {
          console.log(`Error al agregar el producto en MongoDB: ${error}`);
          return false;
        }
      }

      async updateProduct(id, updatedFields) {
        try {
          const producto = await ProductModel.findById(id);
    
          if (producto) {
            Object.assign(producto, updatedFields);
            await producto.save();
            return true;
          } else {
            return false;
          }
        } catch (error) {
          console.log(`Error al actualizar el producto en MongoDB: ${error}`);
          return false;
        }
      }
    
      async deleteProduct(id) {
        try {
          const resultado = await ProductModel.findByIdAndDelete(id);
          return resultado !== null;
        } catch (error) {
          console.log(`Error al eliminar el producto en MongoDB: ${error}`);
          return false;
        }
      }
    }

const product = new ProductManager();

try {
  product.addProduct({
    name: 'Producto 1',
    description: 'Descripción del producto 1',
    price: 100,
    code: 'ABC123',
    status: true,
    stock: 20,
    category: 'Category 1',
    thumbnail: 'https://www.pngarts.com/files/8/Apple-iPhone-11-Download-PNG-Image.png',
  });

  product.addProduct({
    name: 'Producto 2',
    description: 'Descripción del producto 2',
    price: 150,
    code: 'DEF456',
    status: true,
    stock: 15,
    category: 'Category 2',
    thumbnail: 'https://imgur.com/Fn9kZve.png',
  });

  product.addProduct({
    name: 'Producto 3',
    description: 'Descripción del producto 3',
    price: 120,
    code: 'GHI789',
    status: true,
    stock: 10,
    category: 'Category 1',
    thumbnail: 'https://imgur.com/u6wclcF.png',
  });

  product.addProduct({
    name: 'Producto 4',
    description: 'Descripción del producto 4',
    price: 180,
    code: 'JKL012',
    status: true,
    stock: 18,
    category: 'Category 3',
    thumbnail: 'https://imgur.com/csvQT5F.png',
  });

  product.addProduct({
    name: 'Producto 5',
    description: 'Descripción del producto 5',
    price: 90,
    code: 'MNO345',
    status: true,
    stock: 22,
    category: 'Category 2',
    thumbnail: 'https://imgur.com/DrC8wiB.png',
  });

  product.addProduct({
    name: 'Producto 6',
    description: 'Descripción del producto 6',
    price: 200,
    code: 'PQR678',
    status: true,
    stock: 12,
    category: 'Category 1',
    thumbnail: 'https://imgur.com/Ms0uVyZ.png',
  });

} catch (error) {
  console.error(error.message);
}

module.exports = ProductManager;
