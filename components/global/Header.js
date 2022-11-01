import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import {
  AppBar,
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
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { useSnackbar } from "notistack";
import Cookies from "js-cookie";
import MenuIcon from "@mui/icons-material/Menu";

import { getError } from "../../utils";
import { useContextState } from "../../context/StateProvider";

export const Header = () => {
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
          marginX: "1rem",
          paddingY: "1rem",
          width: "100%",
        }}
      >
        <Box display="flex" alignItems="center">
          <IconButton
            edge="start"
            aria-label="open drawer"
            onClick={sidebarOpenHandler}
          >
            <MenuIcon
              sx={{
                color: "#e91e63",
                textTransform: "initial",
                fontSize: "2rem",
                marginRight: "1rem",
              }}
            />
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
              border: "1px solid gray",
              backgroundColor: "#203040",
              borderRadius: 5,
              width: "30rem",
              display: "flex",
              overflow: "hidden",
            }}
          >
            <InputBase
              name="query"
              sx={{
                paddingX: 2,
                color: "#ffffff",
                background: "#203040",
                width: "100%",

                "& ::placeholder": {
                  color: "#ffffff",
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
                  color: "#ffffff",
                },
              }}
              aria-label="search"
            >
              <SearchIcon sx={{ color: "#ffffff" }} />
            </IconButton>
          </form>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginRight: "1rem",
          }}
        >
          <NextLink href="/cart" passHref>
            {cartItems.length > 0 ? (
              <Badge color="secondary" badgeContent={cartItems.length}>
                <IconButton color="primary" aria-label="cart">
                  <ShoppingCartOutlinedIcon fontSize="large" />
                </IconButton>
              </Badge>
            ) : (
              <IconButton color="primary" fontSize="large" aria-label="cart">
                <ShoppingCartOutlinedIcon />
              </IconButton>
            )}
          </NextLink>

          {userInfo ? (
            <>
              <Button
                onClick={loginClickHandler}
                sx={{
                  color: "#ffffff",
                  textTransform: "initial",
                  fontSize: "1.5rem",
                }}
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
                <MenuItem onClick={(e) => loginMenuCloseHandler(e, "/profile")}>
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
              <Button style={{ fontSize: "1.5rem" }}>Login</Button>
            </NextLink>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};
