import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Admin_1234", 10);

  await prisma.user.upsert({
    where: { email: "Admin@example.com" },
    update: {},
    create: {
      nama: "Admin123",
      email: "Admin@example.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("Admin berhasil ditambahkan!");
}

async function main() {
  await prisma.food.createMany({
    data: [
      { id: "1", name: "Nasi Goreng", price: 15000, image: "/nasi-goreng.jpg" },
      { id: "2", name: "Es Teh Manis", price: 5000, image: "/es-teh.jpg" },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
