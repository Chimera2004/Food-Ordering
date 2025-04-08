import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Spinner, Toast, ToastContainer } from "react-bootstrap";
import { useCart } from "../components/Cart";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";


export default function MenuPage() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const { addToCart } = useCart();
  const { data: session } = useSession();


  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await fetch("/api/auth/menu");
        const data = await res.json();
        setMenus(data);
      } catch (error) {
        console.error("Error fetching menus:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleAddToCart = (menu) => {
    if (!session) {
      Swal.fire({
        icon: "warning",
        text: "Silakan login sebelum memesan makanan.",
        confirmButtonText: "OK",
      });
      return;
    }

    addToCart(menu); 
    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: `🛒 ${menu.name} telah ditambahkan ke keranjang.`,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  return (
    <Container className="mt-4">
      <h2 className="my-4">Menu Makanan</h2>

      <Form.Control
        type="text"
        placeholder="Cari menu..."
        value={search}
        onChange={handleSearch}
        className="mb-3"
      />

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Row>
          {menus.length > 0 ? (
            menus
              .filter((menu) => menu.name.toLowerCase().includes(search.toLowerCase()))
              .filter((menu) => (category ? menu.category === category : true))
              .map((menu) => (
                <Col key={menu.id} md={4} className="mb-4">
                  <Card>
                    <div style={{ width: "100%", height: "200px", overflow: "hidden" }}>
                      <Card.Img
                        variant="top"
                        src={menu.image}
                        alt={menu.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <Card.Body>
                      <Card.Title>{menu.name}</Card.Title>
                      <Card.Text>Rp {menu.price.toLocaleString()}</Card.Text>
                      <Button variant="success" onClick={() => handleAddToCart(menu)}>
                        Pesan Sekarang
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
          ) : (
            <p className="text-center w-100">Menu tidak ditemukan.</p>
          )}
        </Row>
      )}
    </Container>
  );
}
