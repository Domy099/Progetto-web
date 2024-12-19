import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Typography, Card, CardContent, Grid, Container } from "@mui/material";

export default function DashboardNuova() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_POI_API_URL;
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${STRAPI_API_URL}/api/users/me?populate=*`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Impossibile recuperare i dati utente");
        }

        const userData = await response.json();
        setUser(userData);

        const userTickets = userData.biglietti || [];
        setTickets(userTickets);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) return <Typography>Caricamento in corso...</Typography>;
  if (error) return <Typography>Errore: {error}</Typography>;
  if (!user) return null;

  return (
    <Container sx={{ padding: 4 }}>
      {/* Sezione di benvenuto */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ textAlign: "left", mb: 2, color: "black", fontFamily: "Arial, sans-serif" }}
        >
          Bentornato, {user.username}!
        </Typography>
        <Grid container spacing={3}>
          {/* Informazioni utente */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 5,
                boxShadow: 3,
                backgroundColor: "white",
                padding: 3,
              }}
            >
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {user.username}
                </Typography>
                <Typography color="textSecondary" sx={{ mb: 2 }}>
                  {user.email}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Sezione biglietti */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{ textAlign: "left", mb: 2, color: "black", fontFamily: "Arial, sans-serif" }}
        >
          I tuoi Biglietti:
        </Typography>
        <Grid container spacing={3}>
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <Grid item xs={12} md={6} key={ticket.id}>
                <Card
                  sx={{
                    borderRadius: 5,
                    boxShadow: 3,
                    backgroundColor: "white",
                    padding: 3,
                  }}
                >
                  <CardContent>
                    <Typography variant="body1">Codice: {ticket.codice}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography color="textSecondary" sx={{ textAlign: "center" }}>
                Nessun biglietto
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Logout Button */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button
          variant="contained"
          className="bg-orange-600 hover:bg-orange-700"
          onClick={() => {
            sessionStorage.removeItem("token");
            router.push("/login");
          }}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
}
