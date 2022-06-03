/* eslint-disable no-nested-ternary */
/* eslint-disable consistent-return */
import axios from "axios";
import dynamic from "next/dynamic";
import {
  Button,
  Card,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import NextLink from "next/link";
import React, { useEffect } from "react";
import { useSnackbar } from "notistack";
import { Controller, useForm } from "react-hook-form";
import { getError } from "../utils";
import { Layout } from "../components";
import { useContextState } from "../context/StateProvider";

function Profile() {
  const { state, stateDispatch } = useContextState();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();

  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      return router.push("/login");
    }
    setValue("name", userInfo.name);
    setValue("email", userInfo.email);
  }, []);

  const submitHandler = async ({ name, email, password, confirmPassword }) => {
    closeSnackbar();

    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords don't match", { variant: "error" });
      return;
    }

    try {
      const { data } = await axios.put(
        "/api/users/profile",
        {
          name,
          email,
          password,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } },
      );

      stateDispatch({ type: "USER_LOGIN", payload: data });

      Cookies.set("userInfo", JSON.stringify(data), { sameSite: "strict" });

      enqueueSnackbar("Profile updated successfully", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };
  return (
    <Layout title="Profile">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card sx={{ marginTop: 10, marginBottom: 10 }}>
            <List>
              <NextLink href="/profile" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="User Profile" />
                </ListItem>
              </NextLink>
              <NextLink href="/order-history" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Order History" />
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card sx={{ marginTop: 10, marginBottom: 10 }}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Profile
                </Typography>
              </ListItem>
              <ListItem>
                <form
                  onSubmit={handleSubmit(submitHandler)}
                  style={{ maxWidth: 800, margin: "0 auto" }}
                >
                  <List>
                    <ListItem>
                      <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                          minLength: 2,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="name"
                            label="Name"
                            inputProps={{ type: "name" }}
                            error={Boolean(errors.name)}
                            helperText={
                              errors.name
                                ? errors.name.type === "minLength"
                                  ? "Name length is more than 1"
                                  : "Name is required"
                                : ""
                            }
                            {...field}
                          />
                        )}
                      />
                    </ListItem>
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
                          validate: (value) =>
                            value === "" ||
                            value.length > 5 ||
                            "Password length is more than 5",
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
                              errors.password
                                ? "Password length is more than 5"
                                : ""
                            }
                            {...field}
                          />
                        )}
                      />
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="confirmPassword"
                        control={control}
                        defaultValue=""
                        rules={{
                          validate: (value) =>
                            value === "" ||
                            value.length > 5 ||
                            "Confirm Password length is more than 5",
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="confirmPassword"
                            label="Confirm Password"
                            inputProps={{ type: "password" }}
                            error={Boolean(errors.confirmPassword)}
                            helperText={
                              errors.password
                                ? "Confirm Password length is more than 5"
                                : ""
                            }
                            {...field}
                          />
                        )}
                      />
                    </ListItem>
                    <ListItem>
                      <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        color="primary"
                      >
                        Update
                      </Button>
                    </ListItem>
                  </List>
                </form>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Profile), { ssr: false });
