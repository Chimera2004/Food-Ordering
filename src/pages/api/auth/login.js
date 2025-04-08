import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../../../lib/prisma";
import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Semua field harus diisi" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await compare(password, user.password))) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.setHeader("Set-Cookie", serialize("token", token, { httpOnly: true, path: "/" }));

    return res.status(200).json({ message: "Login berhasil" });
  }
  return res.status(405).json({ message: "Method not allowed" });
}
