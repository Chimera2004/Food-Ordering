import { getSession } from "next-auth/react";
import prisma from "../../../../lib/prisma";
import multer from "multer";
import path from "path";
import fs from "fs";

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  }),
});

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  if (req.method === "GET") {
    const menus = await prisma.food.findMany();
    return res.status(200).json(menus);
  }

  if (req.method === "POST" || req.method === "PUT") {
    await new Promise((resolve, reject) => {
      upload.single("image")(req, res, (err) => {
        if (err) {
          reject(res.status(500).json({ message: "Upload error", error: err.message }));
        } else {
          resolve();
        }
      });
    });

    const id = req.body.id; 
    const { name, price } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : req.body.image;

    if (!name || !price || (req.method === "POST" && !req.file)) {
      return res.status(400).json({ message: "Semua field harus diisi" });
    }

    const data = { name, price: parseFloat(price), image: imagePath };

    try {
      let result;

      if (req.method === "PUT") {
        if (!id) {
          return res.status(400).json({ message: "ID menu harus disertakan untuk update" });
        }

        result = await prisma.food.update({
          where: { id },
          data,
        });
      } else {
        result = await prisma.food.create({ data });
      }

      return res.status(req.method === "PUT" ? 200 : 201).json(result);
    } catch (error) {
      console.error("Error saat memperbarui/tambah menu:", error);
      return res.status(500).json({
        message: `Gagal ${req.method === "PUT" ? "memperbarui" : "menambahkan"} menu`,
        error: error.message,
      });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ message: "ID menu harus disertakan" });
      }

      await prisma.food.delete({
        where: { id },
      });

      return res.status(200).json({ message: "Menu berhasil dihapus" });
    } catch (error) {
      console.error("Error saat menghapus menu:", error);
      return res.status(500).json({ message: "Gagal menghapus menu", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Metode tidak diizinkan" });
  }
}
