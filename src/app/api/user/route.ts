import { db } from "../../db/mongo";
import { getSession } from "../../lib/session"; // Assuming you have a session management utility

export async function GET(req: Request) {
  const session = await getSession(req);
  if (!session || !session.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const collection = db.collection("users");
  const user = await collection.findOne({ email: session.user.email });
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
  }
  return new Response(JSON.stringify(user), { status: 200 });
}
