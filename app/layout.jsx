"use client"
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WidgetCCAT from "./components/SistemaRAG/WidgetCCAT";

export default function RootLayout({ children }) {
  const menuItems = ["Home", "Eventi", "Mappa", "Storia", "Carri", "Artigiani"];

  return (
    <html lang="en">
      <title>Carnevale di Putignano</title>
      <body className="antialiased">
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Header menuItems={menuItems} />
          <main style={{ flex: 1 }}>
            {children}
            <div>
              <WidgetCCAT
                initialPhrase="Ciao! Sono Farinella, la tua maschera virtuale del Carnevale di Putignano! Come posso darti una mano tra coriandoli e risate?"
                sorryPhrase="Oops! Sembra che la mia maschera si sia smarrita tra i carri allegorici. Riprova più tardi!."
                chatUnderneathMessage="Ricorda che, proprio come le sfilate di Putignano, sono in continua evoluzione e qualche errore può capitare… ma sempre con un sorriso!"
                // ... altre opzioni di personalizzazione
              />
            </div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
