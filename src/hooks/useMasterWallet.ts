import { Address, OpenedContract } from "ton-core";
import MasterWallet from "../contracts/masterWallet";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useMasterWallet() {
  const { sender } = useTonConnect();
  const { client } = useTonClient();
  const addr = "EQAZpERzeN59gUYj2Z5aR9aHBZ8VV1ZcUEn--Z-zxqON77v_";
  const [lastFundAddress, setLastFundAddress] = useState<Address>();
  const [jettonWalletAddress, setJettonWalletAddress] = useState<Address>();
  const [isInitialized, setIsInitialized] = useState(false);

  const masterContract = useAsyncInitialize(async () => {
    if (!client || !sender.address) return;
    const contract = new MasterWallet(Address.parse(addr));

    const res = client.open(contract) as OpenedContract<MasterWallet>;
    const fundAddress = await res.getLastFundAddress(sender.address);
    const jettonAddress = await res.getJettonWalletAddress(sender.address);

    setLastFundAddress(fundAddress);
    setJettonWalletAddress(jettonAddress);
    setIsInitialized(true);
    return res;
  }, [client]);

  return {
    data: () => masterContract?.getJettonData(),
    createFund: () => masterContract?.sendCreateFund(sender),
    lastFundAddress: lastFundAddress,
    mintTokens: (amount: bigint, receiver: Address) =>
      masterContract?.sendMintTokens(amount, receiver, sender),
    jettonWalletAddress: jettonWalletAddress,
    address: masterContract?.address,
    getJettonWalletAddress: (owner: Address) =>
      masterContract?.getJettonWalletAddress(owner),
    isInitialized: isInitialized,
  };
}
