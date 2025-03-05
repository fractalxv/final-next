import { db } from "../../../app/db/mongo";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const productId = url.pathname.split('/').pop();
    const collection = db.collection("cart");
    const product = await collection.findOne({ productId });
    return new Response(JSON.stringify({ isInCart: !!product }), { status: 200 });
}

export async function POST(req: Request) {
    const { productId } = await req.json();
    const collection = db.collection("cart");
    await collection.insertOne({ productId });
    return new Response(JSON.stringify({ message: "Product added to cart" }), { status: 201 });
}
