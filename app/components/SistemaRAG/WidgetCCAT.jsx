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
  sorryPhrase = "Oops! Sembra che la mia maschera si sia smarrita tra i carri allegorici. Riprova più tardi!",
  chatUnderneathMessage = "I LLM possono fare errori, stai attento alle allucinazioni.",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpenChat, setIsOpenChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [gattoAttivo, setGattoAttivo] = useState(false);
  const websocket = useRef(null);

  useEffect(() => {
    // Configura il WebSocket
    const wsUrl = `ws://${baseUrl}:${port}/ws/Anonymous`;
    websocket.current = new WebSocket(wsUrl);

    websocket.current.onopen = () => {
      console.log("WebSocket connected!");
      setGattoAttivo(true);
      setMessages([{ text: initialPhrase, sender: "bot" }]);
    };

    websocket.current.onmessage = (event) => {
      console.log("Messaggio ricevuto:", event.data);

      try {
        const message = JSON.parse(event.data);
        if (message.type === "chat") {
          setMessages((prevMessages) => {
            const updatedMessages = prevMessages.filter(
              (msg) => msg.sender !== "bot_writing"
            );
            return [
              ...updatedMessages,
              { text: message.content, sender: "bot" },
            ];
          });
        }
      } catch (error) {
        console.error("Errore nel parsing del messaggio:", error);
      }
    };

    websocket.current.onerror = (err) => {
      console.error("Errore WebSocket:", err);
      setGattoAttivo(false);
      setMessages((prevMessages) => {
        const errorMessage = { text: sorryPhrase, sender: "bot" };
        if (!prevMessages.some((msg) => msg.text === errorMessage.text)) {
          return [...prevMessages, errorMessage];
        }
        return prevMessages;
      });
    };

    websocket.current.onclose = () => {
      console.warn("WebSocket disconnected.");
      setGattoAttivo(false);
    };

    return () => {
      if (websocket.current) {
        websocket.current.close();
      }
    };
  }, [baseUrl, port, initialPhrase, sorryPhrase]);

  const sendMessage = () => {
    if (input && gattoAttivo && websocket.current) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: input, sender: "user" },
      ]);
      setInput("");

      // Mostra un messaggio di caricamento
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "", sender: "bot_writing" },
      ]);

      const message = { text: input };
      websocket.current.send(JSON.stringify(message));
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
        rotate: isHovered && !isOpenChat ? [0, 30, -30, 10, -10, 0] : 0,
        scale: isHovered && !isOpenChat ? 1.2 : 1,
      }}
    >
      <div className="rectangle">
        {isOpenChat ? (
          <div
            className="close-icon"
            onClick={(e) => {
              e.stopPropagation(); // Previeni la propagazione del click verso il genitore
              setIsOpenChat(false);
            }}
          >
            X
          </div>
        ) : (
          <img
            src={"logoCarnevaleChat.png"}
            alt="cat Icon"
            onClick={() => setIsOpenChat(true)} // Apri la chat solo cliccando sull'icona
          />
        )}
        {isOpenChat && (
          <div className="chat-page">
            {/* Contenuto della chat */}
            <div className="chat-messages">
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.sender}`}>
                  {message.sender === "bot_writing" ? (
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
                disabled={!gattoAttivo || isProcessing}
              />
              <Button
                variant="contained"
                onClick={sendMessage}
                disabled={!gattoAttivo || isProcessing}
              >
                <IoSend />
              </Button>
            </div>
            <p style={{ fontSize: "0.8rem", margin: "0", color: "#999" }}>
              {chatUnderneathMessage}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Widget_CCAT;
