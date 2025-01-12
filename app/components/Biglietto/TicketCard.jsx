import React from "react";
import { useState } from "react";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import Barcode from 'react-barcode';
import './TicketCard.css';

export default function TicketCard({ nomeEvento, dataEmissione, codice, immagine }) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Formattazione della data e dell'ora
  const dateOptions = { day: "2-digit", month: "2-digit", year: "numeric" };
  const timeOptions = { hour: "2-digit", minute: "2-digit" };
  const formattedDate = dataEmissione
    ? new Intl.DateTimeFormat("it-IT", dateOptions).format(new Date(dataEmissione))
    : "N/A";
  const formattedTime = dataEmissione
    ? new Intl.DateTimeFormat("it-IT", timeOptions).format(new Date(dataEmissione))
    : "N/A";

  return (
    <div
      className="w-[400px] h-[150px] cursor-pointer perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''
        }`}>
        {/* Front of the card */}
        <div className="absolute w-full h-full backface-hidden">
          <Card className="flex bg-white text-black rounded-lg overflow-hidden w-full h-full shadow-lg">
            {immagine && (
              <div className="w-[150px]">
                <img
                  src={immagine}
                  alt="Ticket"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <Box className="flex flex-col flex-grow">
              <CardContent className="flex flex-col justify-center p-4">
                <Typography
                  variant="h6" color="primary" sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                  {nomeEvento}
                </Typography>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Typography className="text-black">
                    Matricola:
                  </Typography>
                  <Typography className="text-xl font-bold text-[#1E7B36]">
                    {codice}
                  </Typography>
                </div>

                <Typography className="text-sm text-gray-600">
                  Data di emissione: {formattedDate}
                </Typography>
                <Typography className="text-sm text-gray-600">
                  Ora di emissione: {formattedTime}
                </Typography>
              </CardContent>
            </Box>
            <div className="bg-[#FF9800] flex justify-center items-center px-4 writing-vertical-rl text-center text-white border-l-2 border-[#f57c00]">
              <span className="font-bold">BIGLIETTO</span>
            </div>
          </Card>
        </div>

        {/* Back of the card */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <Card className="flex bg-[#FF9800] text-black rounded-lg overflow-hidden w-full h-full shadow-lg justify-center items-center">
            <CardContent className="text-center transform rotate-y-180">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <Barcode
                  value={codice}
                  width={2}
                  height={80}
                  displayValue={false}
                />
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};


