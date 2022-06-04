import Head from "next/head";
import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Link,
  IconButton,
  styled,
  Badge,
  Button,
  Menu,
  MenuItem,
  Drawer,
  Box,
  List,
  ListItem,
  Divider,
  ListItemText,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import { useSnackbar } from "notistack";
import Switch from "@mui/material/Switch";
import Cookies from "js-cookie";
import MenuIcon from "@mui/icons-material/Menu";
import { useSelectedTheme } from "../../hooks";
import { darkTheme, getError, lightTheme } from "../../utils";
import { useContextState } from "../../context/StateProvider";

const Layout = ({ title, description, children }) => {
  const router = useRouter();

  const {
    state: {
      darkMode,
      cart: { cartItems },
      userInfo,
    },

    stateDispatch,
  } = useContextState();

  const { setSelectedTheme } = useSelectedTheme();

  const [sidbarVisible, setSidebarVisible] = useState(false);

  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
  };

  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };

  const [categories, setCategories] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`/api/products/categories`);
      setCategories(data);
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const darkModeChangeHandler = () => {
    stateDispatch({ type: darkMode ? "DARK_MODE_OFF" : "DARK_MODE_ON" });
  };

  useEffect(() => {
    const newDarkMode = !darkMode;

    Cookies.set("darkMode", newDarkMode ? "ON" : "OFF", { sameSite: "strict" });

    // eslint-disable-next-line no-unused-expressions
    newDarkMode ? setSelectedTheme(darkTheme) : setSelectedTheme(lightTheme);
  }, [darkMode]);

  const [anchorEl, setAnchorEl] = useState(null);

  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const loginMenuCloseHandler = (e, redirect) => {
    setAnchorEl(null);

    if (redirect) {
      router.push(redirect);
    }
  };

  const logoutClickHandler = () => {
    setAnchorEl(null);
    stateDispatch({ type: "USER_LOGOUT" });
    Cookies.remove("userInfo");
    Cookies.remove("cartItems");
    router.push("/");
  };

  return (
    <div>
      <Head>
        <title>{title ? `${title} - instaBuy` : "instaBuy"}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#203040",
          "& a": {
            color: "#ffffff",
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            // maxWidth: "1024px",
            margin: "auto",
            width: "100%",
          }}
        >
          <Box display="flex" alignItems="center">
            <IconButton
              edge="start"
              aria-label="open drawer"
              onClick={sidebarOpenHandler}
            >
              <MenuIcon sx={{ color: "#ffffff", textTransform: "initial" }} />
            </IconButton>
            <NextLink href="/" passHref>
              <Link>
                <Typography sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                  instaBuy
                </Typography>
              </Link>
            </NextLink>
          </Box>
          <Drawer
            anchor="left"
            open={sidbarVisible}
            onClose={sidebarCloseHandler}
          >
            <List>
              <ListItem>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>Shopping by category</Typography>
                  <IconButton aria-label="close" onClick={sidebarCloseHandler}>
                    <CancelIcon />
                  </IconButton>
                </Box>
              </ListItem>
              <Divider light />
              {categories.map((category) => (
                <NextLink
                  key={category}
                  href={`/search?category=${category}`}
                  passHref
                >
                  <ListItem button component="a" onClick={sidebarCloseHandler}>
                    <ListItemText primary={category} />
                  </ListItem>
                </NextLink>
              ))}
            </List>
          </Drawer>

          <div sx={{ flexGrow: "1" }} />
          <div>
            <MaterialUISwitch
              checked={darkMode}
              onChange={darkModeChangeHandler}
              sx={{ m: 1 }}
            />
            <NextLink href="/cart" passHref>
              {cartItems.length > 0 ? (
                <Badge color="secondary" badgeContent={cartItems.length}>
                  <IconButton color="primary" aria-label="cart">
                    <ShoppingCartOutlinedIcon />
                  </IconButton>
                </Badge>
              ) : (
                <IconButton color="primary" aria-label="cart">
                  <ShoppingCartOutlinedIcon />
                </IconButton>
              )}
            </NextLink>

            {userInfo ? (
              <>
                <Button
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={loginClickHandler}
                  // className={classes.navbarButton}
                  sx={{ color: "#ffffff", textTransform: "initial" }}
                >
                  {userInfo.name}
                </Button>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={loginMenuCloseHandler}
                >
                  <MenuItem
                    onClick={(e) => loginMenuCloseHandler(e, "/profile")}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => loginMenuCloseHandler(e, "/order-history")}
                  >
                    Order History
                  </MenuItem>
                  {userInfo.isAdmin && (
                    <MenuItem
                      onClick={(e) =>
                        loginMenuCloseHandler(e, "/admin/dashboard")
                      }
                    >
                      Admin Dashboard
                    </MenuItem>
                  )}
                  <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <NextLink href="/login" passHref>
                <Link>Login</Link>
              </NextLink>
            )}
          </div>
        </Toolbar>
      </AppBar>

      <Container
        sx={{
          minHeight: "80vh",
        }}
      >
        {children}
      </Container>

      <footer sx={{ marginTop: 10, textAlign: "center" }}>
        <Typography> All rights reserved. instaBuy </Typography>
      </footer>
    </div>
  );
};

export default Layout;

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff",
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
    width: 32,
    height: 32,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff",
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));
