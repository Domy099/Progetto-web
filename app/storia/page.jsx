"use client";
import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Card, CardMedia, Box } from '@mui/material';
import Link from 'next/link';
import ContenutoCard from '../components/ContenutoCard';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/public/theme';
import LeggiDiPiu from '../components/LeggiDiPiu';

const Storia = () => {
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const [contenuti, setContenuti] = useState([]);

  useEffect(() => {
    const fetchContenutiDetails = async () => {
      try {
        const response = await fetch(
          `${STRAPI_API_URL}/api/contenuti?populate=Immagine`
        );
        const data = await response.json();

        if (data && data.data) {
          setContenuti(data.data);

        } else {
          console.warn("Nessun contenuto trovato.");
        }
      } catch (error) {
        console.error("Errore nel recuperare i dati:", error);
      }
    };

    fetchContenutiDetails();
  }, []);


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Typography variant="h1" align="center" marginTop={4} marginBottom={6} padding={4}>
          La Storia del Carnevale di Putignano
        </Typography>

        {/* Sezione 1: Introduzione */}
        <Box mb={4}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6} order={{ xs: 1, md: 1 }}>
              <Typography variant="h2">
                Le origini
              </Typography>
              <Typography color="text.secondary">
              </Typography>
              <LeggiDiPiu
                text={origini}
                lunghezza={350}
              ></LeggiDiPiu>
            </Grid>
            <Grid item xs={12} md={6} order={{ xs: 2, md: 2 }}>
              <Card>
                <CardMedia
                  component="img"
                  height="300"
                  image=".\img\storia\storia_1.jpg"
                  alt="Immagine Carnevale Putignano"
                />
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Sezione 2: La Storia */}
        <Box mb={4}>
          <Grid container spacing={2} alignItems="center">
            {/* Testo a destra */}
            <Grid item xs={12} md={6} order={{ xs: 1, md: 1 }} marginBottom={2} padding={4}>
              <Typography variant="h2" textAlign="right" marginTop={2}>
                La Storia
              </Typography>
              <LeggiDiPiu
                text={storia}
                lunghezza={350}
              ></LeggiDiPiu>
            </Grid>

            {/* Immagine a sinistra */}
            <Grid item xs={12} md={6} display="flex" justifyContent="center" marginBottom={2}>
              <Card>
                <CardMedia
                  component="img"
                  height="300"
                  image="./img/storia/storia_2.jpg" // Percorso corretto
                  alt="Immagine Storia Carnevale"
                  style={{
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
              </Card>
            </Grid>
          </Grid>
        </Box>



        {/* Sezione 3: Tradizioni */}
        <Box mb={4}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6} order={{ xs: 1, md: 1 }} padding={4}>
              <Typography variant="h2" >
                Le Tradizioni
              </Typography>
              <LeggiDiPiu
                text={tradizioni}
                lunghezza={350}
              ></LeggiDiPiu>

            </Grid>
            <Grid item xs={12} md={6} order={{ xs: 2, md: 2 }}>
              <Card>
                <CardMedia
                  component="img"
                  height="300"
                  image=".\img\storia\storia_3.jpg"
                  alt="Immagine Tradizioni Carnevale"
                />
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Sezione 4: Contenuti Caricati dal Server (Strapi) */}
        <Typography variant="h3" fontSize={30} align="center" marginTop={5} marginBottom={4}>
          Contenuti Speciali del Carnevale
        </Typography>
        {contenuti && contenuti.length > 0 ? (
          <Container style={{ paddingTop: '20px', }}>
            <Grid container spacing={4} sx={{ justifyContent: { xs: 'center', sm: 'flex-start' }, marginBottom: 4 }}>
              {contenuti.map((contenuto) => (
                <Grid
                  item
                  key={contenuto.idContenuto}
                  xs={10}
                  sm={6}
                  md={4}
                >
                  <Link
                    href={`/storia/${contenuto.idContenuto}`}
                    passHref
                    style={{ textDecoration: 'none' }}
                  >
                    <ContenutoCard
                      title={contenuto.titolo}
                      data={contenuto.publishedAt}
                      image={contenuto.Immagine?.url ? `${STRAPI_API_URL}${contenuto.Immagine.url}` : `https://placehold.co/600x400?text=${contenuto.titolo.slice(0, 30) + "..."}`}
                      altText={`Immagine del contenuto`}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        justifyContent: 'space-between',
                        padding: 2,
                      }}
                    />
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Container>
        ) : (
          <Typography variant="body2" color="text.secondary" align="center" marginBottom={4}>
            Non ci sono contenuti al momento, torna più tardi.
          </Typography>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default Storia;

const storia = `Farinella è la maschera tipica del Carnevale di Putignano. Il suo nome è preso in prestito dal piatto simbolo della cucina putignanese: una farina finissima, ricavata da ceci e orzo prima abbrustoliti poi ridotti in polvere dentro piccoli mortai di pietra; un alimento semplice e sostanzioso, in passato immancabile presenza sulle povere tavole contadine, destinato al connubio con sughi, olio o fichi freschi.

Al primo Farinella, una specie di ubriacone sbrindellato senza caratteristiche particolari se non la miseria, segue agli inizi degli anni '50 la versione di Mimmo Castellano, su richiesta dell'allora presidente del Carnevale di Putignano il commendatore Elefante.
Castellano ne stravolge abbigliamento e personalità: il nuovo Farinella è una fusione tra la maschera di Arlecchino e il Jolly delle carte da gioco, ha un abito a toppe multicolori, un gonnellino rosso e blu – colori della città – e un cappello a tre punte con campanelli, simbolo dei tre colli su cui sorge Putignano. Della maschera originale Castellano decide di mantenere solo il volto rubizzo e il naso rosso.
Allegro e scanzonato, con quegli occhi beffardi e il sorriso ironico riassume il carattere dei putignanesi: provocatori, ironici, innamorati della vita, del buon bere e del godere a tavola. Orgogliosi della loro terra e del loro dialetto.
Farinella è il simbolo di un Carnevale che dura tutto l'anno, di una festa che racchiude allegria, riflessione, malinconia, gioia ed eccesso. In una parola, vita.`;
const tradizioni = `Dal 26 dicembre al martedì grasso, è un susseguirsi di riti, tradizioni, sfilate e processioni, in un continuo fondersi e alternarsi di sacro e profano.
Ne è un esempio il 26 dicembre, giorno di Santo Stefano e delle Propaggini, così come il 17 gennaio, giorno di Sant'Antonio Abate ma anche inizio degli appuntamenti del carnevale dai ritmi più sfrenati.

Da questo momento l'avvicendarsi delle settimane è segnato dalla centralità dei giovedì: se in passato il giovedì era sinonimo di banchetti e balli in maschera nei sottani del centro storico, i cosiddetti jos'r, oggi è sinonimo di dissacrante satira sociale. Ogni giovedì mira a portare sul palco una storia e un gruppo sociale ben preciso: in un ordine assolutamente immutabile si parte con i Monsignori, per poi continuare con i Preti, le Monache, i Vedovi, i Pazzi (ovvero, i giovani non ancora sposati), le Donne sposate e dulcis in fundo i Cornuti (gli Uomini sposati), in un appuntamento curato dall'Accademia delle Corna, caratterizzato proprio dal goliardico rito del taglio della corna.
Di giovedì in giovedì, di tradizione in tradizione, di carro in carro, si arriva al martedì grasso, giorno di chiusura del Carnevale e del gran finale in notturna. I 365 rintocchi della Campana dei Maccheroni scandiscono ufficialmente la fine dei bagordi e l'inizio della Quaresima.`;
const origini = ` È il 1394. La costa pugliese è preda delle scorrerie saracene, i tentativi di assalto si susseguono e la paura dei saccheggi inizia a popolare costantemente gli incubi di abitanti e governatori, al tempo, i Cavalieri di Malta.

L'imperativo è uno: proteggere dalle razzie ciò che di più prezioso è custodito nel territorio, partendo dalle reliquie di Santo Stefano Protomartire, fino a quel momento conservate nell'abbazia di Monopoli. Allontanarle dalla costa e spostarle nell'entroterra sembra essere l'unica soluzione possibile: Putignano, perfetta per la sua posizione, viene scelta come meta del trasferimento.

Il 26 dicembre 1394 le reliquie, accompagnate da un corteo sacro, vengono traslate nella chiesa di Santa Maria la Greca, lì, dove tutt'oggi sono ancora custodite. È in questo momento che la storia si intreccia alla leggenda, il sacro al profano: il racconto, tramandato dalla tradizione orale, vuole che i contadini di Putignano impegnati nell'innesto delle viti con la tecnica della propaggine, al passaggio della processione abbandonassero campi e lavoro per accodarsi festanti al corteo, ballando, cantando e improvvisando versi satirici in vernacolo. Nasce così la Festa delle Propaggini, quella che da 631 anni ogni 26 dicembre segna l'inizio del Carnevale più lungo di Italia nonché più antico di Europa: il Carnevale di Putignano.`;
