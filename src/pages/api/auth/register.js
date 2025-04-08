import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { nama, email, password, confirmPassword, role } = req.body;

  if (!nama || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Semua field harus diisi!' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Password dan konfirmasi password tidak cocok!' });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: 'Email sudah digunakan!' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      nama,
      email,
      password: hashedPassword,
      role: role || 'customer',
    },
  });

  return res.status(201).json({ message: 'Registrasi berhasil!', user: newUser });
}
