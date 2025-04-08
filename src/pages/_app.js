import { SessionProvider } from "next-auth/react";
import { CartProvider } from "../components/Cart"; 
import "bootstrap/dist/css/bootstrap.min.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <CartProvider>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </CartProvider>
  );
}
