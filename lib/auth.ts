import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import prisma from "./prisma";

const SESSION_TTL_DAYS = 7;

export async function createUser(email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { email, passwordHash }
  });
}

export async function verifyUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;
  return user;
}

export async function createSession(userId: string) {
  const token = nanoid(32);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_TTL_DAYS);
  const session = await prisma.session.create({
    data: { token, userId, expiresAt }
  });
  cookies().set("creatorx_session", token, {
    httpOnly: true,
    sameSite: "lax",
    expires: expiresAt,
    path: "/"
  });
  return session;
}

export async function destroySession() {
  const cookieStore = cookies();
  const token = cookieStore.get("creatorx_session")?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }
  cookieStore.set("creatorx_session", "", {
    httpOnly: true,
    sameSite: "lax",
    expires: new Date(0),
    path: "/"
  });
}

export async function getCurrentUser() {
  const token = cookies().get("creatorx_session")?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true }
  });
  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    return null;
  }
  return session.user;
}
