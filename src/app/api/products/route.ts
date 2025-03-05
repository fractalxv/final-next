import { db } from "../../db/mongo";
import { importProducts } from "../../utils/importProducts";

// export async function GET() {
//   await importMovies(); // Ensure movies are imported
//   const collection = db.collection("movies");
//   const movies = await collection.find().toArray();
//   return new Response(JSON.stringify(movies), { status: 200 });
// }

export async function GET(req: Request) {
  await importProducts(); // Ensure movies are imported
  const url = new URL(req.url);
  const searchQuery = url.searchParams.get("search") || "";
  const collection = db.collection("products");

  const products = await collection
    .find({ title: { $regex: searchQuery, $options: "i" } })
    .toArray();

  return new Response(JSON.stringify(products), { status: 200 });
}


export async function POST(req: Request) {
  const data = await req.json();
  const collection = db.collection("products");
  await collection.insertOne(data);
  return new Response(
    JSON.stringify({ message: "Data created", product: data }),
    { status: 201 }
  );
}



