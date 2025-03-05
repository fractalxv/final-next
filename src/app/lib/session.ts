import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { UserType } from "../models/User";

interface SessionPayload extends Record<string, unknown> {
  _id: string;
  email: string;
}

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  if (!session) {
    throw new Error("Session is empty or undefined");
  }

  const { payload } = await jwtVerify(session, encodedKey, {
    algorithms: ["HS256"],
  });

  return payload;
}

export async function createSession(user: UserType) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  console.log(user);

  const session = await encrypt({
    _id: user._id!,
    email: user.email,
    expiresAt,
  });

  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  console.log("Session created and set in cookie:", session);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function getSession(req: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  if (!session) {
    return null;
  }

  try {
    const payload = await decrypt(session.value);
    return { user: payload };
  } catch (error) {
    console.error("Error decrypting session:", error);
    return null;
  }
}