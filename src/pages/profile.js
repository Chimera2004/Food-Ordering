import { useEffect, useState } from "react";
import { Container, Table, Spinner } from "react-bootstrap";

export default function ProfilePage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch("/api/auth/history");
      const data = await res.json();
      setOrders(data);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  return (
    <>
    <Container className="mt-5">
      <h2 className="mb-4">Histori Belanja</h2>
      {loading ? (
        <Spinner animation="border" />
      ) : orders.length === 0 ? (
        <p>Belum ada histori belanja.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Tanggal</th>
              <th>Items</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr key={order.id}>
                <td>{i + 1}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>
                  <ul className="mb-0">
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.name} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>Rp {order.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
    </>
  );
}
