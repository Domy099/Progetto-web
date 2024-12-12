import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function RootLayout({ children }) {
  const menuItems = ['Home', 'Eventi', 'Mappa', 'Storia', 'Carri', 'Artisti'];

  return (
    <html lang="en">
      <body className="antialiased">
        <Header menuItems={menuItems} />
        {children}
        <Footer />
      </body>
    </html>
  );
}