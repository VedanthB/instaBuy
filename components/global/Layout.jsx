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
  InputBase,
} from "@mui/material";
// import Image from "next/image";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { useSnackbar } from "notistack";
import Cookies from "js-cookie";
import MenuIcon from "@mui/icons-material/Menu";

import { getError } from "../../utils";
import { useContextState } from "../../context/StateProvider";

export const Layout = ({ title, description, children }) => {
  const router = useRouter();

  const {
    state: {
      cart: { cartItems },
      userInfo,
    },

    stateDispatch,
  } = useContextState();

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
    Cookies.remove("shippingAddress");
    Cookies.remove("paymentMethod");
    router.push("/");
  };

  const [query, setQuery] = useState("");

  const queryChangeHandler = (e) => {
    setQuery(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  return (
    <div>
      <Head>
        <link
          rel="shortcut icon"
          href="https://res.cloudinary.com/supertramp69420/image/upload/v1654524914/instaBuy-logos_white_ltpfgm.png"
          type="image/x-icon"
        />

        {/* <!-- css component lib link --> */}
        <link
          rel="stylesheet"
          href="https://argon-css.netlify.app/components/index.css"
        />

        {/* <!-- font awesome --> */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
          integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g=="
          crossOrigin="anonymous"
          referrerpolicy="no-referrer"
        />

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

          <div classNameName="search-form">
            <form
              onSubmit={submitHandler}
              style={{
                border: "1px solid #ffffff",
                backgroundColor: "#ffffff",
                borderRadius: 5,
              }}
            >
              <InputBase
                name="query"
                sx={{
                  paddingLeft: 2,
                  color: "#000000",
                  "& ::placeholder": {
                    color: "#606060",
                  },
                }}
                placeholder="Search products"
                onChange={queryChangeHandler}
              />
              <IconButton
                type="submit"
                sx={{
                  backgroundColor: "#e91e63",
                  padding: 1,
                  borderRadius: "0 5px 5px 0",
                  "& span": {
                    color: "#000000",
                  },
                }}
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>
            </form>
          </div>

          <div>
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
                  // classNameName={classNamees.navbarButton}
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
          marginTop: "1rem",
        }}
      >
        {children}
      </Container>

      <footer
        style={{ bottom: 0 }}
        className="docs-footer text-white  mt-10 flex flex-col justify-center align-items-center w-full p-5 z-50 bg-rose-100"
      >
        <div className="text-grey-700">
          Made with
          <span className="text-rose-700 font-bold ml-1 mr-1">
            &lt;/&gt;{" "}
          </span>{" "}
          by
          <a
            href="https://github.com/VedanthB"
            style={{ padding: 0, textTransform: "none" }}
            className="ml-1 btn btn-link-rose"
          >
            vedanth
          </a>
        </div>
        <div className="flex mt-3 align-items-center justify-center">
          <a href="https://github.com/VedanthB">
            <i className="fab fa-github mr-2 text-rose-700" />
          </a>
          <a href="https://twitter.com/vedanth_X0X0">
            <i className="fab fa-twitter mr-2 text-rose-700" />
          </a>
          <a href="https://www.linkedin.com/in/vedanth-bora/">
            <i className="fab fa-linkedin mr-2 text-rose-700" />
          </a>
          <a href="https://dev.to/vedanthb">
            <i className="fab fa-dev text-rose-700" />
          </a>
        </div>
      </footer>
    </div>
  );
};
