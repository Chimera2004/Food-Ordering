import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]";
import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "PUT") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });
  

  const { name, email } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name, email },
    });

    res.status(200).json({ message: "User updated", user: updatedUser });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Gagal update user" });
  }
}
