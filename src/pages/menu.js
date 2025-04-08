import { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col, Alert } from "react-bootstrap";
import NavbarComponent from "../components/Navbar";
import FooterComponent from "../components/Footer";
import MenuPageComponent from "../components/MenuPage"; 

export default function Menu() { 
  const [menus, setMenus] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/menu")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => setMenus(data))
      .catch((error) => setError(error.message));
  }, []);

  return (
    <>
      <NavbarComponent />
        <MenuPageComponent/>
      <FooterComponent />
    </>
  );
}
