import { useState } from "react";
import Link from "next/link";
import AuthModal from "./AuthModal";
import { useSession, signOut } from "next-auth/react";
import { Dropdown, Button } from "react-bootstrap";



export default function NavbarComponent() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { data: session } = useSession();
  const userName = session?.user?.name ?? "User";
  const isAdmin = session?.user?.role === "admin"; 

  return (
    <nav className="navbar navbar-dark bg-dark px-4 d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center">
        <Link className="navbar-brand text-white" href="/">Food Ordering</Link>
        <Link className="nav-link text-white ms-3" href="/">Home</Link>
        <Link className="nav-link text-white ms-3" href="/menu">Menu</Link>
        <Link className="nav-link text-white ms-3" href="/cart" >Cart</Link>
        {isAdmin && <Link className="nav-link text-white ms-3" href="/admin/menu">Admin</Link>}
      </div>

      {session ? (
        <Dropdown>
          <Dropdown.Toggle variant="outline-light" id="dropdown-user">
            Selamat datang, {userName}
          </Dropdown.Toggle>

          <Dropdown.Menu align="end">
            <Dropdown.Item as={Link} href="/profile">Profile</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => signOut()}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <Button variant="outline-light" onClick={() => setShowAuthModal(true)}>Login</Button>
      )}

      <AuthModal show={showAuthModal} handleClose={() => setShowAuthModal(false)} />
    </nav>
  );
}
