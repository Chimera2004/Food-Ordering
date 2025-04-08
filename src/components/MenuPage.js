import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Spinner, Toast, ToastContainer } from "react-bootstrap";
import { useCart } from "../components/Cart";

export default function MenuPage() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const { addToCart } = useCart();

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
    addToCart(menu); 
    setToastMsg(`🛒 ${menu.name} telah ditambahkan ke keranjang.`);
    setShowToast(true);
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

      {}
      <ToastContainer
          className="position-fixed top-50 start-50 translate-middle"
          style={{ zIndex: 9999 }}
        >
          <Toast
            onClose={() => setShowToast(false)}
            show={showToast}
            delay={3000}
            autohide
            bg="success"
          >
            <Toast.Body className="text-white text-center fw-bold">{toastMsg}</Toast.Body>
          </Toast>
        </ToastContainer>
    </Container>
  );
}
