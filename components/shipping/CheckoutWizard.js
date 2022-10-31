import React from "react";
import { Step, StepLabel, Stepper } from "@mui/material";

export default function CheckoutWizard({ activeStep = 0 }) {
  return (
    <Stepper
      activeStep={activeStep}
      sx={{
        backgroundColor: "transparent",
        marginY: "5rem",
      }}
      alternativeLabel
    >
      {["Login", "Shipping Address", "Payment Method", "Place Order"].map(
        (step) => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        ),
      )}
    </Stepper>
  );
}
