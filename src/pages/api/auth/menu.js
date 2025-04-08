import  prisma  from "../../../../lib/prisma"; // Pastikan prisma sudah dikonfigurasi dengan benar

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const menus = await prisma.food.findMany();
      return res.status(200).json(menus);
    } catch (error) {
      return res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
  }
  return res.status(405).json({ message: "Method not allowed" });
}
