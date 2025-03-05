import { db } from "../db/mongo";
import { products } from "../data/products";

export async function importProducts() {
  const collection = db.collection("products");
  await collection.deleteMany({});
  await collection.insertMany(products);
  console.log("Products imported to database");
}
