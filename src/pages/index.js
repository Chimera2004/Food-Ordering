import NavbarComponent from "../components/Navbar";
import FooterComponent from "../components/Footer";
import { Container, Button, Row, Col, Card } from "react-bootstrap";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [showPromo, setShowPromo] = useState(true);

  return (
    <>
      <NavbarComponent />
      
      <div className="hero-section" >
        <Container className="d-flex justify-content-center align-items-center h-100">
          <div className="text-center text-black">
            <h1 className="fw-bold display-3">Selamat Datang di Food Ordering</h1>
            <p className="mt-3">Nikmati makanan favoritmu dengan mudah dan cepat! Pesan sekarang dan rasakan pengalaman terbaik dalam layanan kami.</p>
            <Button href="/menu" variant="primary" size="lg" className="mt-3">
              Lihat Menu
            </Button>
          </div>
        </Container>
      </div>


      <Container className="mt-5">
        <h2 className="text-center fw-bold mb-4">Keunggulan Kami</h2>
        <Row className="text-center">
          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <h4>Pengiriman Cepat</h4>
                <p>Pesan makanan dan nikmati pengiriman dalam waktu singkat, langsung ke pintu rumah Anda.</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <h4>Menu Beragam</h4>
                <p>Pilih dari berbagai menu lezat yang kami tawarkan, cocok untuk semua selera!</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <h4>Harga Terjangkau</h4>
                <p>Nikmati makanan berkualitas dengan harga yang ramah di kantong!</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <FooterComponent />
    </>
  );
}
