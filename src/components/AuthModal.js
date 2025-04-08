import { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { signIn } from "next-auth/react"; 
import Swal from "sweetalert2";

export default function AuthModal({ show, handleClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "", nama: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(""); 
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { nama, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, email, password, confirmPassword }), 
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: `Registrasi Berhasil, Silahkan Login.`,
        showConfirmButton: false,
        timer: 2000,
      });
      setIsLogin(true); 
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { email, password } = formData;

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result.error) {
      setError("Email atau password salah.");
    } else {
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: `Login Berhasil`,
        showConfirmButton: false,
        timer: 2000,
      });
      window.location.href = "/"; 
    }

    setLoading(false);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isLogin ? "Login" : "Register"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={isLogin ? handleLogin : handleRegister}>
          {!isLogin && (
            <Form.Group className="mb-3">
              <Form.Label>Nama</Form.Label>
              <Form.Control type="text" name="nama" onChange={handleChange} required />
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" onChange={handleChange} required />
          </Form.Group>
          {!isLogin && (
            <Form.Group className="mb-3">
              <Form.Label>Konfirmasi Password</Form.Label>
              <Form.Control type="password" name="confirmPassword" onChange={handleChange} required />
            </Form.Group>
          )}
          <Button variant="primary" type="submit" className="w-100" disabled={loading}>
            {loading ? "Loading..." : isLogin ? "Login" : "Register"}
          </Button>
        </Form>

        <p className="text-center mt-3">
          {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
          <span className="text-primary" style={{ cursor: "pointer" }} onClick={toggleForm}>
            {isLogin ? "Daftar" : "Login"}
          </span>
        </p>
      </Modal.Body>
    </Modal>
  );
}
