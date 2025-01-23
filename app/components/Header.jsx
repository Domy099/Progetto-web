'use client';
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
    <>
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
                <img
                  src= "/logoCarnevale.png"
                  alt="Logo"
                  className="h-10"
                />
              </Typography>
            </Link>
          </div>
          <div className="hidden md:flex space-x-4">
            {menuItems.map((item) => (
              <Link
                key={item}
                href={item.toLowerCase() === "home" ? "/" : `/${item.toLowerCase()}`}
                passHref
              >
                <Button color="inherit" className="menu-button">
                  {item}
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
          className="w-64"
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {menuItems.map((text) => (
              <ListItem key={text} disablePadding>
                <Link
                  href={text.toLowerCase() === "home" ? "/" : `/${text.toLowerCase()}`}
                  passHref
                >
                  <ListItemButton>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
