import { getServerSession } from "next-auth";
import { authOptions } from "./[...nextauth]";
import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const { cart } = req.body; 

  try {
    const userId = session.user.id;

    
    const orders = await Promise.all(
      cart.map(async (item) => {
        return await prisma.order.create({
          data: {
            userId,
            foodId: item.id,
            quantity: item.quantity || 1,
            status: "pending",
          },
        });
      })
    );

    res.status(200).json({ message: "Order berhasil disimpan", orders });
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat menyimpan order" });
  }
}
