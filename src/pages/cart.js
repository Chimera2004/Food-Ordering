import { useCart } from "../components/Cart";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import NavbarComponent from "../components/Navbar";


export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalPrice,
    clearCart
  } = useCart();

  const handleBayar = () => {
    alert("Terima kasih! Fitur pembayaran belum diimplementasikan.");
    clearCart();
  };

  return (
    <>
    <NavbarComponent />
    <Container className="mt-5">
      <h2 className="mb-4">Keranjang Belanja</h2>
      {cart.length === 0 ? (
        <p>Keranjang kamu kosong.</p>
      ) : (
        <>
          {cart.map((item) => (
            <Card className="mb-3" key={item.id}>
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={2}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="img-fluid rounded"
                      style={{ height: "80px", objectFit: "cover" }}
                    />
                  </Col>
                  <Col md={4}>
                    <h5>{item.name}</h5>
                    <p className="text-muted">Rp {item.price.toLocaleString()}</p>
                  </Col>
                  <Col md={3}>
                    <Form.Control
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, e.target.value)}
                    />
                  </Col>
                  <Col md={2}>
                    <strong>
                      Rp {(item.price * item.quantity).toLocaleString()}
                    </strong>
                  </Col>
                  <Col md={1}>
                    <Button variant="danger" onClick={() => removeFromCart(item.id)}>
                      &times;
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}

          <hr />
          <div className="d-flex justify-content-between align-items-center">
            <h4>Total: Rp {totalPrice.toLocaleString()}</h4>
            <Button variant="success" onClick={handleBayar}>
              Bayar Sekarang
            </Button>
          </div>
        </>
      )}
    </Container>
    </>
  );
}
