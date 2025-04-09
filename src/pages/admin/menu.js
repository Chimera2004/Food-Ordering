import { useEffect, useState } from "react";
import { Container, Table, Button, Modal, Form, Row, Col, InputGroup, FormControl } from "react-bootstrap";
import NavbarComponent from "../../components/Navbar";
import FooterComponent from "../../components/Footer";
import Swal from "sweetalert2";

export default function AdminMenuPage() {
  const [menus, setMenus] = useState([]);
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [menuData, setMenuData] = useState({ id: "", name: "", price: "", image: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const menusPerPage = 10;

  useEffect(() => {
    fetchMenus();
  }, []);

  useEffect(() => {
    filterMenus();
  }, [menus, searchQuery]);

  const fetchMenus = async () => {
    try {
      const res = await fetch("/api/admin/menu");
      const data = await res.json();
      setMenus(data);
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };

  const filterMenus = () => {
    const filtered = menus.filter((menu) =>
      menu.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMenus(filtered);
    setCurrentPage(1);
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
      Swal.fire({ icon: "error", text: ` Semua field harus diisi!`, timer: 2000, showConfirmButton: false });
      return;
    }

    if (image instanceof File) {
      if (!["image/png", "image/jpg", "image/jpeg"].includes(image.type)) {
        Swal.fire({ icon: "info", text: `Format gambar salah`, timer: 2000, showConfirmButton: false });
        return;
      }
      if (image.size > 2 * 1024 * 1024) {
        Swal.fire({ icon: "info", text: `Ukuran Gambar Maksimal 2MB.`, timer: 2000, showConfirmButton: false });
        return;
      }
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    if (image instanceof File) formData.append("image", image);
    if (editMode) formData.append("id", id);

    try {
      const res = await fetch("/api/admin/menu", {
        method: editMode ? "PUT" : "POST",
        body: formData,
      });

      const responseData = await res.json();
      if (!res.ok) throw new Error(responseData.message || "Terjadi kesalahan.");

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: editMode ? "Menu berhasil diperbarui!" : "Menu berhasil ditambahkan!",
        timer: 2000,
        showConfirmButton: false,
      });

      setShowModal(false);
      fetchMenus();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteMenu = async (id) => {
    if (!id || !window.confirm("Apakah Anda yakin ingin menghapus menu ini?")) return;

    try {
      const res = await fetch(`/api/admin/menu?id=${id}`, { method: "DELETE" });
      const responseData = await res.json();
      if (!res.ok) throw new Error(responseData.message || "Terjadi kesalahan");

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: `Menu berhasil dihapus.`,
        timer: 2000,
        showConfirmButton: false,
      });

      fetchMenus();
    } catch (error) {
      alert(error.message);
    }
  };

  const indexOfLastMenu = currentPage * menusPerPage;
  const indexOfFirstMenu = indexOfLastMenu - menusPerPage;
  const currentMenus = filteredMenus.slice(indexOfFirstMenu, indexOfLastMenu);
  const totalPages = Math.ceil(filteredMenus.length / menusPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <NavbarComponent />
      <Container className="mt-4">
        <h2 className="text-center mb-4">Admin - Kelola Menu</h2>
        <Row className="mb-3 align-items-center">
          <Col md={6}>
            <InputGroup>
              <FormControl
                placeholder="Cari menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={6} className="text-end">
            <Button variant="success" onClick={() => handleShowModal()}>Tambah Menu</Button>
          </Col>
        </Row>
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
            {currentMenus.map((menu, index) => (
              <tr key={menu.id}>
                <td>{indexOfFirstMenu + index + 1}</td>
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

        <div className="d-flex justify-content-center mt-3">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={i + 1 === currentPage ? "primary" : "outline-primary"}
              className="mx-1"
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
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
              <Form.Control type="text" name="name" value={menuData.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Harga</Form.Label>
              <Form.Control type="number" name="price" value={menuData.price} onChange={handleChange} required />
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
