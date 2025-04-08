import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]";
import prisma from "../../../../lib/prisma";


export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        user: { email: session.user.email }
      },
      include: {
        food: true, 
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    const formattedOrders = orders.map(order => ({
      id: order.id,
      createdAt: order.createdAt,
      total: order.food.price * order.quantity,
      items: [{
        name: order.food.name,
        quantity: order.quantity
      }],
      food: {
        id: order.food.id,
        image: order.food.image,
        name: order.food.name,
        price: order.food.price,
      }      
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
