# CarnevApp

**Versione**: 1.5  
**Autori**:  
- Domenico Quarto (775166) - [d.quarto10@studenti.uniba.it](mailto:d.quarto10@studenti.uniba.it)  
- Alberto Antonio Romano (777788) - [a.romano93@studenti.uniba.it](mailto:a.romano93@studenti.uniba.it)  
- Vito Marchionna (776644) - [v.marchionna@studenti.uniba.it](mailto:v.marchionna@studenti.uniba.it)  

## Descrizione del Progetto

CarnevApp è una piattaforma web interattiva progettata per migliorare l'esperienza dei partecipanti al Carnevale di Putignano. Offre informazioni utili e funzioni interattive per i visitatori e strumenti gestionali per l'amministrazione.

## Funzionalità Principali

### Per i Visitatori:
- Mappa interattiva con la posizione dei carri allegorici, punti di ristoro e attrazioni.
- Informazioni sui parcheggi, ingressi e orari degli eventi.
- Possibilità di votare il carro preferito e fornire feedback.
- Accesso alla storia e alle tradizioni del Carnevale.

### Per l'Amministrazione:
- Dashboard per aggiornare eventi e informazioni logistiche.
- Raccolta e analisi dei feedback dei visitatori.

## Architettura
Il sistema è basato su un'architettura a tre livelli (3-Tier):  
1. **Presentation Tier**: Browser degli utenti.  
2. **Logic Tier**: Server Node.js con API di OpenAI e CMS Strapi.  
3. **Data Tier**: Database SQLite gestito da Strapi.

## Requisiti
- Node.js 18+
- CMS Strapi
- Librerie front-end React

## Installazione
1. Clona il repository:
   ```bash
   git clone https://github.com/tuo-username/carnevapp.git
   ```
2.	Installa le dipendenze:
   ```bash
npm install
   ```
3.	Configura l’ambiente (.env file):
	•	Variabili per Strapi, OpenWeather e OpenAI API.

4.	Avvia il server:
   ```bash
npm run dev
   ```
