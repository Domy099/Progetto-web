import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./widget_CCAT.css";

import TextField from "@mui/material/TextField";
import { IoSend } from "react-icons/io5";
import Button from "@mui/material/Button";

const Widget_CCAT = ({
  baseUrl = "localhost",
  port = "1865",
  initialPhrase = "Ciao Sono lo Stregatto, una intelligenza artificiale curiosa e cortese. Come posso aiutarti?",
  sorryPhrase = "ops... il gatto ha avuto qualche problema",
  chatUnderneathMessage = "i LLM posso fare errori, stai attento alle allucinazioni",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpenChat, setIsOpenChat] = useState(false);
  const [canAnimate, setCanAnimate] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [gatto_attivo, setGattoAttivo] = useState(false);
  const [ws, setWs] = useState(null); // Connessione WebSocket

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:1865/ws/Anonymous");

    websocket.onopen = () => {
      console.log("WebSocket connected!");
      setGattoAttivo(true); // Aggiorna lo stato a connesso
      setMessages([{ text: initialPhrase, sender: "bot" }]);
    };

    websocket.onmessage = (event) => {
      console.log("Messaggio ricevuto:", event.data);

      try {
        const message = JSON.parse(event.data); // Proviamo a parsare il messaggio
        if (message.type === "chat") {
          // Quando riceviamo il messaggio completo, rimuoviamo il "bot_writing" e aggiungiamo il messaggio del bot
          setMessages((prevMessages) => {
            // Rimuoviamo l'ultimo messaggio "bot_writing"
            const updatedMessages = prevMessages.filter(
              (msg) => msg.sender !== "bot_writing"
            );
            return [
              ...updatedMessages,
              { text: message.content, sender: "bot" },
            ];
          });
        } else {
          // Ignoriamo i messaggi di tipo diverso
          //console.log("Messaggio non di tipo chat:", message);
        }
      } catch (error) {
        console.error("Errore durante la gestione del messaggio:", error);
      }
    };

    websocket.onerror = (error) => {
      console.error("Errore WebSocket:", error);
      setGattoAttivo(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: sorryPhrase, sender: "bot" },
      ]);
    };

    websocket.onclose = () => {
      console.warn("WebSocket disconnesso.");
      setGattoAttivo(false);
    };

    setWs(websocket);

    return () => websocket.close();
  }, []);

  const sendMessage = () => {
    if (input && gatto_attivo && ws) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: input, sender: "user" },
      ]);
      setInput("");

      // Aggiungi un messaggio di caricamento prima di inviare
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "", sender: "bot_writing" }, // Messaggio di caricamento
      ]);

      const message = { text: input };
      ws.send(JSON.stringify(message));
      console.log("Messaggio inviato:", message);
    }
  };

  return (
    <motion.div
      className={!isOpenChat ? "cat-icon" : "cat-chat"}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ overflow: "hidden" }}
      animate={{
        rotate:
          canAnimate && isHovered && !isOpenChat
            ? [0, 30, -30, 10, -10, 0]
            : 0,
        scale: canAnimate && isHovered && !isOpenChat ? 1.2 : 1,
      }}
      onClick={
        !isOpenChat
          ? () => {
              setIsOpenChat(true);
            }
          : null
      }
    >
      <div className="rectangle">
        {isOpenChat ? (
          <div
            className="close-icon"
            onClick={() => {
              setIsOpenChat(false);
            }}
          >
            X
          </div>
        ) : (
          ""
        )}
        <img
          src={
            "CatLogoNEW.svg"
          }
          alt="cat Icon"
        />
        {isOpenChat ? (
          <div className="chat-page">
            <div className="chat-messages">
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.sender}`}>
                  {message.sender === "bot_writing" ? (
                    // Mostra i punti di caricamento
                    <div className="dots">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  ) : (
                    message.text
                  )}
                </div>
              ))}
            </div>
            <div className="chat-input">
              <TextField
                label="Chiacchera Farinella"
                variant="standard"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                style={{ width: "100%" }}
                disabled={isProcessing || !gatto_attivo}
              />
              <Button
                variant="contained"
                onClick={sendMessage}
                disabled={isProcessing || !gatto_attivo}
              >
                <IoSend />
              </Button>
            </div>
            <p
              style={{
                fontSize: "0.8rem",
                margin: "0",
                color: "#999",
              }}
            >
              {chatUnderneathMessage}
            </p>
          </div>
        ) : (
          ""
        )}
      </div>
    </motion.div>
  );
};

export default Widget_CCAT;