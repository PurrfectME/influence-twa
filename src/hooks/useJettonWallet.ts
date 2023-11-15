import { Address, OpenedContract, Transaction } from "ton-core";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import { useMasterWallet } from "./useMasterWallet";
import InfluenceJettonWallet from "../contracts/jettonWallet";
import { useState } from "react";
import JettonWalletData from "../models/JettonWalletData";

export default function useJettonWallet(owner: Address | undefined) {
  const { client } = useTonClient();
  const { sender } = useTonConnect();
  const { getJettonWalletAddress, isInitialized: isMasterInitialized } =
    useMasterWallet();
  const [walletData, setWalletData] = useState<JettonWalletData>();

  const jettonWalletContract = useAsyncInitialize(async () => {
    if (!client || !isMasterInitialized || !owner) return;

    const jettonWalletAddress = await getJettonWalletAddress(owner);

    const contract = new InfluenceJettonWallet(jettonWalletAddress!);

    const res = client.open(contract) as OpenedContract<InfluenceJettonWallet>;

    const data = await res.getWalletData();
    setWalletData(data);

    return res;
  }, [client, isMasterInitialized]);

  return {
    data: walletData,
    address: jettonWalletContract?.address,
    sendDonate: (destination: Address, amount: bigint) =>
      jettonWalletContract?.sendDonate(sender, destination, amount),
  };
}
