import NavbarComponent from "../components/Navbar";
import FooterComponent from "../components/Footer";
import { Container, Button } from "react-bootstrap";

export default function Home() {
  return (
    <>
      <NavbarComponent />
      <Container className="mt-5 text-center">
        <h1 className="fw-bold">Selamat Datang di Food Ordering</h1>
        <p className="mt-3 text-muted">
          Nikmati makanan favoritmu dengan mudah dan cepat!  
          Pesan sekarang dan rasakan pengalaman terbaik dalam layanan kami.
        </p>
        <Button href="/menu" variant="primary" size="lg" className="mt-3">
          Lihat Menu
        </Button>
      </Container>

      <FooterComponent />
    </>
  );
}
