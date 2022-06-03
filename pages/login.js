/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import axios from "axios";
import NextLink from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { Layout } from "../components";
import { useContextState } from "../context/StateProvider";

export default function Login() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { redirect } = router.query; // login?redirect=/shipping

  const { state, stateDispatch } = useContextState();

  const { userInfo } = state;

  useEffect(() => {
    if (userInfo) {
      router.push("/");
    }
  }, []);

  // eslint-disable-next-line no-shadow
  const submitHandler = async ({ email, password }) => {
    closeSnackbar();

    try {
      const { data } = await axios.post("/api/users/login", {
        email,
        password,
      });

      stateDispatch({ type: "USER_LOGIN", payload: data });

      Cookies.set("userInfo", JSON.stringify(data), { sameSite: "strict" });

      router.push(redirect || "/");
    } catch (err) {
      // eslint-disable-next-line no-alert
      enqueueSnackbar(
        err.response.data ? err.response.data.message : err.message,
        { variant: "error" },
      );
    }
  };

  return (
    <Layout title="Login">
      <form
        onSubmit={handleSubmit(submitHandler)}
        style={{ maxWidth: 800, margin: "0 auto" }}
      >
        <Typography sx={{ textAlign: "center" }} component="h1" variant="h1">
          Login
        </Typography>
        <List>
          <ListItem>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="email"
                  label="Email"
                  inputProps={{ type: "email" }}
                  error={Boolean(errors.email)}
                  helperText={
                    // eslint-disable-next-line no-nested-ternary
                    errors.email
                      ? errors.email.type === "pattern"
                        ? "Email is not valid"
                        : "Email is required"
                      : ""
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="password"
                  label="Password"
                  inputProps={{ type: "password" }}
                  error={Boolean(errors.password)}
                  helperText={
                    // eslint-disable-next-line no-nested-ternary
                    errors.password
                      ? errors.password.type === "minLength"
                        ? "Password length is more than 5"
                        : "Password is required"
                      : ""
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Login
            </Button>
          </ListItem>
          <ListItem>
            Don't have an account? &nbsp;
            <NextLink href={`/register?redirect=${redirect || "/"}`} passHref>
              <Link>Register</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
