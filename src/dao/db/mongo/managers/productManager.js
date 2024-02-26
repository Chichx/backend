const ProductModel = require("../models/products.model")
const crypto = require("crypto")


class ProductManager{
    constructor() {}

    async getProducts({ limit, page, sort, query }) {
      try {
          let mongoQuery = {};
  
          if (query === "disponibilidad") {
            mongoQuery.status = true;
          } else if (query) {
            mongoQuery.category = query;
          }
  
          const opciones = {
              page: page ? parseInt(page, 10) : 1,
              limit: limit ? parseInt(limit, 10) : 0,
              sort: sort ? { price: sort === 'asc' ? 1 : sort === 'desc' ? -1 : 0 } : {}
          };
  
          const result = await ProductModel.paginate(mongoQuery, opciones);
  
          return {
            success: true,
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}&query=${query ? `${query}` : ''}&sort=${sort ? `${sort}` : 'asc'}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}&query=${query ? `${query}` : ''}&sort=${sort ? `${sort}` : 'asc'}` : null
        };
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
    price: 90,
    code: 'ABC123',
    status: false,
    stock: 20,
    category: 'Category 1',
    thumbnail: 'https://www.pngarts.com/files/8/Apple-iPhone-11-Download-PNG-Image.png',
  });

  product.addProduct({
    name: 'Producto 2',
    description: 'Descripción del producto 2',
    price: 100,
    code: 'DEF456',
    status: false,
    stock: 15,
    category: 'Category 2',
    thumbnail: 'https://imgur.com/Fn9kZve.png',
  });

  product.addProduct({
    name: 'Producto 3',
    description: 'Descripción del producto 3',
    price: 110,
    code: 'GHI789',
    status: false,
    stock: 10,
    category: 'Category 1',
    thumbnail: 'https://imgur.com/u6wclcF.png',
  });

  product.addProduct({
    name: 'Producto 4',
    description: 'Descripción del producto 4',
    price: 120,
    code: 'JKL012',
    status: true,
    stock: 18,
    category: 'Category 3',
    thumbnail: 'https://imgur.com/csvQT5F.png',
  });

  product.addProduct({
    name: 'Producto 5',
    description: 'Descripción del producto 5',
    price: 130,
    code: 'MNO345',
    status: true,
    stock: 22,
    category: 'Category 2',
    thumbnail: 'https://imgur.com/DrC8wiB.png',
  });

  product.addProduct({
    name: 'Producto 6',
    description: 'Descripción del producto 6',
    price: 140,
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
