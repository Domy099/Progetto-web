import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import Link from "next/link";
import Box from "@mui/material/Box";


// Funzione per formattare l'orario
function formatHour(inputHour) {
  return inputHour.split(":").slice(0, 2).join(":"); // Restituiamo solo ore e minuti
}

export default function MultiActionAreaCard({
  title,
  description,
  image,
  altText,
  position,
  date,
  hour,
  eventPosition,
  eventCode
}) {
  const googleMapsLink = `https://www.google.com/maps/dir/?api=1&destination=${position.lat},${position.lng}`;

  return (
    <Card sx={{ maxWidth: 345 }}>
      <Link href={`/eventi/${eventCode}`} passHref>
      <CardActionArea>
        <CardMedia component="img" height="140" image={image} alt={altText} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {description}
          </Typography>
          {date && hour && (
            <>
            <br />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Data: {date}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Ora: {formatHour(hour)}
              </Typography>
            </Box>
            </>
          )}
           {eventPosition && (
            <>
            <br />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Via: {eventPosition}  
            </Typography>
            </>
          )}
        </CardContent>
      </CardActionArea>
      </Link>
      <CardActions>
        <Link href={googleMapsLink} passHref>
          <Button size="small" color="primary">
            Vai con Google Maps
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}