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
        endpoint: await getHttpEndpoint({
          network: "testnet",
        }),
      });
    }, []),
  };
}
