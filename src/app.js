const fs = require('fs');

class ProductManager{
    constructor() {
        this.products = [];
        this.id = 1
        this.path = "../json/products.json"
    }

    getProducts() {
      return this.products;
    }

    addProduct({title, description, price, thumbnail, code, stock}) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Todos los campos son obligatorios")
        }

        if(!this.products.some((product) => product.code === code)) {
          const nuevaId = this.id++;
          const nuevoProducto = { id: nuevaId, title, description, price, thumbnail, code, stock }

          this.products.push(nuevoProducto);
          this.saveProduct(this.products);
      
          return nuevoProducto;
        } else {
          console.log(`Ya existe el codigo de este producto el codigo que se repite es ${code}`)
        }
    }

    getProductById(id) {
        const existeLaId = this.products.find((product) => product.id === id)
        if (!existeLaId) {
            console.log("Not found")
        }
        return existeLaId
    }

    saveProduct(products) {
      fs.writeFileSync(this.path, JSON.stringify(products, null, 2), {encoding: 'utf-8'});
    }

    getProductsFromFile() {
      try {
        const fileData = fs.readFileSync(this.path, { encoding: 'utf-8' });
        return JSON.parse(fileData);
      } catch (error) {
        console.log(`Error al leer el archivo: ${error}`)
        return [];
      }
    }

    updateProduct(id, updatedFields) {
      let products = this.getProductsFromFile();
      const productIndex = products.findIndex((product) => product.id === id);
    
      if (productIndex === -1) {
        console.log('Producto no encontrado');
        return;
      }

      if ('id' in updatedFields) {
        console.log('No se puede cambiar la ID del producto.');
        return;
      }
    
      products[productIndex] = { ...products[productIndex], ...updatedFields };
      this.saveProduct(products);
    
      return products[productIndex];
    }
    
    deleteProduct(id) {
      let products = this.getProductsFromFile();
      const length = products.length;
  
      products = products.filter((product) => product.id !== id);
  
      if (products.length === length) {
        console.log('Producto no encontrado');
      }
  
      this.saveProduct(products);
    }
}

const product = new ProductManager();

try {
  product.addProduct({
    title: 'Producto 1',
    description: 'Descripción del producto 1',
    price: 100,
    thumbnail: 'imagen1.jpg',
    code: 'ABC123',
    stock: 20,
  });

  product.addProduct({
    title: 'Producto 2',
    description: 'Descripción del producto 2',
    price: 300,
    thumbnail: 'imagen2.jpg',
    code: 'DFG456',
    stock: 20,
  });

  product.addProduct({
    title: 'Producto 3',
    description: 'Descripción del producto 3',
    price: 200,
    thumbnail: 'imagen3.jpg',
    code: 'HIJ789',
    stock: 20,
  });

  product.addProduct({
    title: 'Producto 4',
    description: 'Descripción del producto 4',
    price: 200,
    thumbnail: 'imagen4.jpg',
    code: 'KLM123',
    stock: 10,
  });

  product.addProduct({
    title: 'Producto 5',
    description: 'Descripción del producto 5',
    price: 150,
    thumbnail: 'imagen5.jpg',
    code: 'XYZ456',
    stock: 15,
  });

  product.addProduct({
    title: 'Producto 6',
    description: 'Descripción del producto 6',
    price: 250,
    thumbnail: 'imagen6.jpg',
    code: 'PQR789',
    stock: 8,
  });

  product.addProduct({
    title: 'Producto 7',
    description: 'Descripción del producto 7',
    price: 180,
    thumbnail: 'imagen7.jpg',
    code: 'UVW123',
    stock: 20,
  });

  product.addProduct({
    title: 'Producto 8',
    description: 'Descripción del producto 8',
    price: 300,
    thumbnail: 'imagen8.jpg',
    code: 'STU456',
    stock: 12,
  });

  product.addProduct({
    title: 'Producto 9',
    description: 'Descripción del producto 9',
    price: 120,
    thumbnail: 'imagen9.jpg',
    code: 'EFG789',
    stock: 25,
  });

  product.addProduct({
    title: 'Producto 10',
    description: 'Descripción del producto 10',
    price: 270,
    thumbnail: 'imagen10.jpg',
    code: 'MNO123',
    stock: 18,
  });

  

  // console.log('Productos:', product.getProducts());
  // console.log("--------------------------")
  // console.log('Producto con ID 2:', product.getProductById(2));
  // console.log("--------------------------")

  // console.log('Se edito el precio del producto con ID 2:', product.updateProduct(2, { price: 200 }));
  // console.log("--------------------------")

  // console.log('Se elimino el producto con ID 3')
  // product.deleteProduct(3)
} catch (error) {
  console.error(error.message);
}

module.exports = ProductManager
