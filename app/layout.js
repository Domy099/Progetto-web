import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function RootLayout({ children }) {
  const menuItems = ['Home', 'Eventi', 'Mappa', 'Storia', 'Carri', 'Artigiani'];

  return (
    <html lang="en">
      <body className="antialiased">
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header menuItems={menuItems} />
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}