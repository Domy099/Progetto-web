"use client"
import React from "react";
import { Marker } from "@react-google-maps/api";

const MarkerComponent = ({ point, onClick }) => {
  return (
    <Marker
      position={point.position}
      title={point.title}
      onClick={() => onClick(point)}
    />
  );
};

export default MarkerComponent;