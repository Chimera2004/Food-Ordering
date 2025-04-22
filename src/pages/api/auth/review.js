import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
  const { method } = req;

  // Ambil review berdasarkan foodId
  if (method === "GET") {
    const { foodId } = req.query;
    try {
      const reviews = await prisma.review.findMany({
        where: { foodId },
        include: {
          user: { select: { nama: true } },
        },
      });
      return res.status(200).json(reviews);
    } catch (error) {
      return res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
  }

  // Tambahkan review baru
  if (method === "POST") {
    const { foodId, userId, rating, comment } = req.body;

    if (!foodId || !userId || !rating) {
      return res.status(400).json({ message: "Data tidak lengkap." });
    }

    try {
      const newReview = await prisma.review.create({
        data: {
          foodId,
          userId,
          rating,
          comment,
        },
        include: {
          user: { select: { nama: true } },
        },
      });

      return res.status(201).json(newReview);
    } catch (error) {
      console.error("POST review error:", error);
      return res.status(500).json({ message: "Gagal menyimpan review." });
    }
  }

  // Method selain GET dan POST ditolak
  return res.status(405).json({ message: "Method not allowed" });
}
