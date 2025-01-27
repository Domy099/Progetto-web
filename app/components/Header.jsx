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
        sx={{ 
          backgroundColor: "#d03526",
          borderBottomLeftRadius: "20px",
          borderBottomRightRadius: "20px",
        }}
      >
        <Toolbar className="flex">
          <Box className="flex items-center justify-between w-full">
            {/* Box per il logo */}
            <Box className="flex items-center" sx={{ flex: 1 }}>
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
                <Typography variant="h6">
                  <img src="/logoCarnevale.png" alt="Logo" className="h-10" />
                </Typography>
              </Link>
            </Box>

            {/* Box per i collegamenti */}
            <Box className="hidden md:flex space-x-4" sx={{ flex: 2, justifyContent: "center" }}>
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
            </Box>

            {/* Box per l'icona del login */}
            <Box className="flex items-center justify-end" sx={{ flex: 1 }}>
              <Link href="/dashboard" passHref>
                <IconButton edge="end" color="inherit" aria-label="profile">
                  <AccountCircle />
                </IconButton>
              </Link>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 256,
            height: "100%",
            bgcolor: "background.paper",
            p: 0,
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
                  style={{ textDecoration: "none", width: "100%" }}
                >
                  <ListItemButton
                    sx={{
                      width: "100%",
                      textAlign: "left",
                      padding: "12px 16px",
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
            position: "absolute",
            bottom: "0px",
            right: "0px",
            width: "100%",
            height: "250px",
            overflow: "hidden",
          }}
        >
          <img
            src="/pattern-rombi.png"
            style={{
              position: "absolute",
              width: "85%",
              height: "auto",
              bottom: "-20px",
              right: "-50px",
              opacity: 0.9,
              transform: "rotate(-15deg)",
            }}
          />
        </div>
      </Drawer>
    </ThemeProvider>
  );
};

export default Header;
