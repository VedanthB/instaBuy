import React from "react";
import { useRouter } from "next/router";
import { useContextState } from "../context";

export default function Shipping() {
  const router = useRouter();

  const { state } = useContextState();

  const { userInfo } = state;

  if (!userInfo) {
    router.push("/login?redirect=/shipping");
  }

  return <div />;
}
