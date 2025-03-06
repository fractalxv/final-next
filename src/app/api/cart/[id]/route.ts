import { db } from "../../../../app/db/mongo";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const collection = db.collection("cart");
  const product = await collection.findOne({ productId: id });
  return new Response(JSON.stringify({ isInCart: !!product }), { status: 200 });
}
