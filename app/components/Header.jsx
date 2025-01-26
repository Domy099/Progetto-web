"use client";
import React, { useState } from "react";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/public/theme";

const Header = ({ menuItems }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="static"
        color="transparent"
        sx={{ backgroundColor: "#d03526" }}
      >
        <Toolbar className="flex justify-between">
          <div className="flex items-center">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              className="mr-2 md:hidden"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Link href="/" passHref>
              <Typography variant="h6" className="flex-grow">
                <img src="/logoCarnevale.png" alt="Logo" className="h-10" />
              </Typography>
            </Link>
          </div>
          <div className="hidden md:flex space-x-4">
            {menuItems.map((item) => (
              <Link
                key={item}
                href={
                  item.toLowerCase() === "home" ? "/" : `/${item.toLowerCase()}`
                }
                passHref
              >
                <Button color="inherit" className="menu-button">
                  <Typography
                    variant="body1"
                    color="inherit"
                    sx={{ textTransform: "none" }}
                  >
                    {item}
                  </Typography>
                </Button>
              </Link>
            ))}
          </div>
          <Link href="/dashboard" passHref>
            <IconButton edge="end" color="inherit" aria-label="profile">
              <AccountCircle />
            </IconButton>
          </Link>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 256, // Larghezza del drawer
            height: "100%",
            bgcolor: "background.paper", // Sfondo
            p: 0, // Nessun padding esterno
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List sx={{ marginTop: 4 }}>
            {menuItems.map((text) => (
              <ListItem key={text} sx={{ width: "100%", paddingY: 0.5 }}>
                <Link
                  href={
                    text.toLowerCase() === "home"
                      ? "/"
                      : `/${text.toLowerCase()}`
                  }
                  passHref
                  style={{ textDecoration: "none", width: "100%" }} // Link occupa tutta la larghezza
                >
                  <ListItemButton
                    sx={{
                      width: "100%", // Espande il bottone
                      textAlign: "left", // Allineamento del testo
                      padding: "12px 16px", // Padding interno
                      borderRadius: 3,
                      "&:hover": {
                        background: "#c98ab1",
                        color: "#ffffff",
                        transition: "all 0.2s ease-in-out",
                      },
                    }}
                  >
                    <Typography
                      variant="body1"
                      color="inherit"
                      sx={{ padding: 0.3 }}
                    >
                      {text}
                    </Typography>
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
        <div
          style={{
            position: "absolute", // Posiziona il div in modo assoluto rispetto al contenitore
            bottom: "0px", // Allinea il div al confine inferiore
            right: "0px", // Allinea il div al confine destro
            width: "100%", // Larghezza del div
            height: "250px", // Altezza del div
            overflow: "hidden", // Nasconde la parte che eccede dal contenitore
          }}
        >
          <img
            src="/pattern-rombi.png"
            style={{
              position: "absolute",
              width: "85%", // Rende l'immagine larga quanto il div
              height: "auto", // Mantiene le proporzioni dell'immagine
              bottom: "-20px",
              right: "-50px",
              opacity: 0.9,
              transform: "rotate(-15deg)", // Ruota l'immagine di -25 gradi
            }}
          />
        </div>
      </Drawer>
    </ThemeProvider>
  );
};

export default Header;
