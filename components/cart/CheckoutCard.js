import React from "react";
import { Button, Card, List, ListItem, Typography } from "@mui/material";
import { useRouter } from "next/router";

export const CheckoutCard = ({ cartItems }) => {
  const router = useRouter();

  const checkoutHandler = () => {
    router.push("/shipping");
  };

  return (
    <Card>
      <List>
        <ListItem>
          <div>
            <Typography
              sx={{ display: "block", marginBottom: "1rem", width: "100%" }}
              variant="h6"
            >
              Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} items)
            </Typography>

            <Typography sx={{ marginBottom: "1rem" }} variant="h6">
              ₹ {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
            </Typography>
          </div>
        </ListItem>
        <ListItem>
          <Button
            onClick={checkoutHandler}
            variant="contained"
            color="primary"
            fullWidth
          >
            Check Out
          </Button>
        </ListItem>
      </List>
    </Card>
  );
};
