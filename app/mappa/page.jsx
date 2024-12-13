"use client"
import GoogleMapComponent from "../components/Mappa/GoogleMapComponent.jsx";
import React, { useState, useEffect } from 'react';

const App = () => {

  return (
    <div>
      <h1>Mappa con Google Maps</h1>
      <GoogleMapComponent />
    </div>
  );
};

export default App;