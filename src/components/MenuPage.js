import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";
import { useCart } from "../components/Cart";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

export default function MenuPage() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const { addToCart } = useCart();
  const { data: session } = useSession();

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // reset halaman saat search berubah
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

  const filteredMenus = menus
    .filter((menu) =>
      menu.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((menu) => (category ? menu.category === category : true));

  const totalPages = Math.ceil(filteredMenus.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMenus = filteredMenus.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
        <>
          {paginatedMenus.length > 0 ? (
            <Row>
              {paginatedMenus.map((menu) => (
                <Col key={menu.id} md={4} className="mb-4">
                  <Card>
                    <div
                      style={{
                        width: "100%",
                        height: "200px",
                        overflow: "hidden",
                      }}
                    >
                      <Card.Img
                        variant="top"
                        src={menu.image}
                        alt={menu.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <Card.Body>
                      <Card.Title>{menu.name}</Card.Title>
                      <Card.Text>
                        Rp {menu.price.toLocaleString()}
                      </Card.Text>
                      <div className="d-flex justify-content-between">
                        <Button
                          variant="success"
                          onClick={() => handleAddToCart(menu)}
                        >
                          Pesan Sekarang
                        </Button>
                        <Button
                          variant="info"
                          className="mt-2 ms-2"
                          onClick={() => window.location.href = `/food/${menu.id}`}
                        >
                          Detail
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <p className="text-center my-5 w-100">Menu tidak ditemukan.</p>
          )}

          {/* Pagination */}
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
        </>
      )}
    </Container>
  );
}
