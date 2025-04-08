import { useEffect, useState } from "react";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import NavbarComponent from "../../components/Navbar";
import FooterComponent from "../../components/Footer";
import Swal from "sweetalert2";

export default function AdminMenuPage() {
  const [menus, setMenus] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [menuData, setMenuData] = useState({ id: "", name: "", price: "", image: "" });

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const res = await fetch("/api/admin/menu");
      const data = await res.json();
      setMenus(data);
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };

  const handleShowModal = (menu = null) => {
    setEditMode(!!menu);
    setMenuData(menu || { id: "", name: "", price: "", image: "" });
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setMenuData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSaveMenu = async (e) => {
    e.preventDefault();
    const { id, name, price, image } = menuData;
  
    if (!name || !price || (!editMode && !image)) {
      Swal.fire({
        icon: "error",
        text: ` Semua field harus diisi!`,
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
  
    if (image instanceof File) {
      if (!["image/png", "image/jpg", "image/jpeg"].includes(image.type)) {
        Swal.fire({
          icon: "info",
          text: `Hanya gambar dengan format PNG, JPG, atau JPEG yang diperbolehkan.`,
          showConfirmButton: false,
          timer: 2000,
        });
        return;
      }
      if (image.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: "info",
          text: `Ukuran Gambar Tidak Boleh Lebih Dari 2 MB.`,
          showConfirmButton: false,
          timer: 2000,
        });
        return;
      }
    }
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
  
    if (image instanceof File) {
      formData.append("image", image);
    }
  
    if (editMode) {
      formData.append("id", id);
    }
  
    try {
      const res = await fetch("/api/admin/menu", {
        method: editMode ? "PUT" : "POST",
        body: formData,
      });
  
      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.message || "Terjadi kesalahan pada server.");
      }
  
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: editMode ? "Menu berhasil diperbarui!" : "Menu berhasil ditambahkan!",
        showConfirmButton: false,
        timer: 2000,
      });

      setShowModal(false);
      fetchMenus();
  
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  };
  
  const handleDeleteMenu = async (id) => {
    if (!id || !window.confirm("Apakah Anda yakin ingin menghapus menu ini?")) {
    return;
  }
  
    try {
      const res = await fetch(`/api/admin/menu?id=${id}`, {
        method: "DELETE",
      });
  
      const responseData = await res.json();
      console.log("Respons dari server:", responseData);
  
      if (!res.ok) {
        throw new Error(responseData.message || "Terjadi kesalahan");
      }
  
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: `Menu Berhasil Di Hapus.`,
        showConfirmButton: false,
        timer: 2000,
      });
      fetchMenus(); 
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  };
  
  
  
  
  
  
  
  return (
    <>
      <NavbarComponent />
      <Container className="mt-4">
        <h2 className="text-center mb-4">Admin - Kelola Menu</h2>
        <Button variant="success" onClick={() => handleShowModal()} className="mb-3">Tambah Menu</Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Harga</th>
              <th>Gambar</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {menus.map((menu, index) => (
              <tr key={menu.id}>
                <td>{index + 1}</td>
                <td>{menu.name}</td>
                <td>Rp {menu.price.toLocaleString()}</td>
                <td><img src={menu.image} alt={menu.name} width="50" /></td>
                <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowModal(menu)}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteMenu(menu.id)}>Hapus</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
      <FooterComponent />

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit Menu" : "Tambah Menu"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nama Menu</Form.Label>
              <Form.Control type="text" name="name" value={menuData.name} onChange={handleChange} required/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Harga</Form.Label>
              <Form.Control type="number" name="price" value={menuData.price} onChange={handleChange} required/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Gambar</Form.Label>
              <Form.Control type="file" name="image" onChange={handleChange} accept="image/*" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Tutup</Button>
          <Button variant="primary" onClick={handleSaveMenu}>{editMode ? "Update" : "Simpan"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}



