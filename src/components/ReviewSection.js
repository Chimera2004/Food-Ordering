import { useState, useEffect } from "react";
import { Form, Button, ListGroup, Alert } from "react-bootstrap";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

export default function ReviewSection({ foodId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/auth/review?foodId=${foodId}`);
        const data = await res.json();
        setReviews(data);
      } catch (error) {
        setError("Gagal mengambil review.");
      }
    };

    fetchReviews();
  }, [foodId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session) {
      Swal.fire({
        icon: "warning",
        text: "Silakan login untuk memberi review.",
        confirmButtonText: "OK",
      });
      return;
    }

    if (rating < 1 || rating > 5) {
      Swal.fire({
        icon: "error",
        text: "Rating harus antara 1 hingga 5.",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const res = await fetch("/api/auth/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          foodId,
          userId: session.user.id,
          rating,
          comment,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Review berhasil ditambahkan!",
          showConfirmButton: false,
          timer: 2000,
        });
        setReviews((prev) => [data, ...prev]);
        setRating(0);
        setComment("");
      } else {
        setError(data.message || "Terjadi kesalahan.");
      }
    } catch (error) {
      setError("Terjadi kesalahan saat menambahkan review.");
    }
  };

  const renderStars = (value, set = false) => {
    return (
      <div>
        {[...Array(5)].map((_, i) => {
          const starVal = i + 1;
          return (
            <span
              key={i}
              style={{
                fontSize: "24px",
                color: starVal <= (hover || value) ? "#f5c518" : "#ccc",
                cursor: set ? "pointer" : "default",
              }}
              onClick={() => set && setRating(starVal)}
              onMouseEnter={() => set && setHover(starVal)}
              onMouseLeave={() => set && setHover(0)}
            >
              {starVal <= (hover || value) ? "★" : "☆"}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="mt-4">
      <h4>Review</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      {reviews.length > 0 ? (
        <ListGroup>
          {reviews.map((review) => (
            <ListGroup.Item key={review.id}>
              <strong>{review.user.nama}</strong> <br />
              {renderStars(review.rating)}
              <p className="mt-1">{review.comment}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>Belum ada review untuk makanan ini.</p>
      )}

      <Form onSubmit={handleSubmit} className="mt-4">
        <Form.Group controlId="rating">
          <Form.Label>Rating Anda</Form.Label>
          {renderStars(rating, true)}
        </Form.Group>
        <Form.Group controlId="comment" className="mt-3">
          <Form.Label>Komentar</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="mt-3">
          Kirim Review
        </Button>
      </Form>
    </div>
  );
}
