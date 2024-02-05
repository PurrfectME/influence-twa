import { getHttpEndpoint } from "@orbs-network/ton-access";
import { useState } from "react";
import { TonClient } from "ton";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonConnect } from "./useTonConnect";
import { CHAIN } from "@tonconnect/protocol";

export function useTonClient() {
  //TODO: add balances here
  return {
    client: useAsyncInitialize(async () => {
      return new TonClient({
        apiKey:
          "858fcb84f2c0a8f30a0f59f0b204436197069c2b7f9a5c0e0eadb9a687b62ef9",
        endpoint: await getHttpEndpoint({
          network: "testnet",
        }),
      });
    }, []),
  };
}
