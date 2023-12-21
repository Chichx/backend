class ProductManager{
    constructor() {
        this.products = [];
        this.id = 1
    }

    getProducts() {
      return this.products;
    }

    addProduct({title, description, price, thumbnail, code, stock}) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Todos los campos son obligatorios")
        }

        if(!this.products.some((product) => product.code === code)) {
          const nuevoProducto = { id: this.id++, title, description, price, thumbnail, code, stock }

          this.products.push(nuevoProducto)
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
}

const product = new ProductManager();

try {
  product.addProduct({
    title: 'Producto 1',
    description: 'Descripción del producto 1',
    price: 100,
    thumbnail: 'imagen1.jpg',
    code: 'ABC123',
    stock: 20
  });

  product.addProduct({
    title: 'Producto 2',
    description: 'Descripción del producto 2',
    price: 150,
    thumbnail: 'imagen2.jpg',
    code: 'DEF456',
    stock: 15
  });

  product.addProduct({
    title: 'Producto 3',
    description: 'Descripción del producto 3',
    price: 200,
    thumbnail: 'imagen3.jpg',
    code: 'GHI789',
    stock: 10
  });

  // Este addProduct va dar error ya que el code es el mismo que el producto 3
  product.addProduct({ 
    title: 'Producto 4',
    description: 'Descripción del producto 4',
    price: 200,
    thumbnail: 'imagen3.jpg',
    code: 'GHI789',
    stock: 10
  });

// Este addProduct va dar error ya que le falta el campo de stock
  product.addProduct({
    title: 'Producto 5',
    description: 'Descripción del producto 5',
    price: 200,
    thumbnail: 'imagen3.jpg',
    code: 'JKL789',
  });

  console.log("--------------------------")
  console.log("Todos los productos")
  console.log(product.getProducts());

  console.log("--------------------------")
  console.log("Solo el que tiene la id 2")
  console.log(product.getProductById(2)); 

  console.log("--------------------------")
  console.log("Error ya que no existe el 5")
  console.log(product.getProductById(5));
} catch (error) {
  console.error(error.message);
}
