import { useCart } from "../components/Cart";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import NavbarComponent from "../components/Navbar";
import Swal from "sweetalert2";


export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalPrice,
    clearCart
  } = useCart();
  
  const handleBayar = async () => {
    if (cart.length === 0) {
        alert("Keranjang kosong!");
        return;
      }
      
    try {
      const response = await fetch("/api/auth/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Swal.fire({
            icon: "info",
            title: "Warning!",
            text: `Mohon maaf saat ini kami belum memiliki fitur transaksi`,
            showConfirmButton: false,
            timer: 2000,
          })
        clearCart();
      } else {
        alert(data.message || "Gagal melakukan pemesanan.");
      }
    } catch (error) {
      console.error("Bayar error:", error);
      alert("Terjadi kesalahan saat membayar.");
    }
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
