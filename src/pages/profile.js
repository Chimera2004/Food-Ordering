import { useEffect, useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import NavbarComponent from "../components/Navbar";
import FooterComponent from "../components/Footer";
import { useCart } from "../components/Cart";
import Swal from "sweetalert2";

export default function ProfilePage() {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/auth/history");
      const data = await res.json();
      setOrders(data);

      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      setForm({ name: session?.user?.name || "", email: session?.user?.email || "" });

      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/editUser", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
      }),
    });

    const result = await res.json();
    if (res.ok) {
      Swal.fire("Berhasil update profil!");
    } else {
      Swal.fire(result.message);
    }
  };

  const handlePesanLagi = (food) => {
    if (!food) return;

    addToCart({
      id: food.id,
      name: food.name,
      price: food.price,
      image: food.image,
      quantity: 1,
    });

    Swal.fire({
      icon: "success",
      title: "Ditambahkan ke keranjang!",
      text: `${food.name} berhasil ditambahkan.`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const filteredOrders = orders.filter((order) =>
    order.items[0].name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <NavbarComponent />
      <Container className="mt-5">
        <h3>Profil Kamu</h3>
        <Form onSubmit={handleSubmit} className="mb-5">
          <Form.Group className="mb-3">
            <Form.Label>Nama</Form.Label>
            <Form.Control name="name" value={form.name} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
          </Form.Group>
          <Button type="submit">Simpan Perubahan</Button>
        </Form>

        <h4>Histori Belanja</h4>

        <Form.Control
          type="text"
          placeholder="Cari histori belanja..."
          className="mb-3"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); 
          }}
        />

        {loading ? (
          <p>Loading...</p>
        ) : filteredOrders.length === 0 ? (
          <p>Data tidak ditemukan.</p>
        ) : (
          paginatedOrders.map((order) => {
            const item = order.items[0];
            return (
              <Card className="mb-3" key={order.id}>
                <Card.Body className="d-flex align-items-center justify-content-between">
                  <div className="d-flex">
                    <img
                      src={order.food.image}
                      alt={item.name}
                      style={{ width: "100px", height: "100px", objectFit: "cover", marginRight: "1rem" }}
                      className="rounded"
                    />
                    <div>
                      <h5>{item.name}</h5>
                      <p className="mb-1">Jumlah: {item.quantity}</p>
                      <p className="mb-1">Total: Rp {order.total.toLocaleString()}</p>
                      <p className="text-muted">Tanggal: {new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <Button variant="success" onClick={() => handlePesanLagi(order.food)}>
                    Pesan Lagi
                  </Button>
                </Card.Body>
              </Card>
            );
          })
        )}

        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4 flex-wrap gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                variant={i + 1 === currentPage ? "primary" : "outline-primary"}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        )}
      </Container>
      <FooterComponent />
    </>
  );
}
