import { db } from '../db/mongo';


export interface ProductType {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
      rate: number;
      count: number;
  };
}

const collection = db.collection<ProductType>('products');
class Product {
  static async findAll() {
    return await collection.find().toArray();
  }

  static async create(product: ProductType) {
    return await collection.insertOne(product);
  }
}

export default Product;