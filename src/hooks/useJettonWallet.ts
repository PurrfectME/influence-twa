import {
  Address,
  Cell,
  OpenedContract,
  SenderArguments,
  Transaction,
  beginCell,
  toNano,
} from "ton-core";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import { useMasterWallet } from "./useMasterWallet";
import InfluenceJettonWallet from "../contracts/jettonWallet";
import { useState } from "react";
import JettonWalletData from "../models/JettonWalletData";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useJettonWallet(owner: Address | undefined) {
  const { client } = useTonClient();
  const { sender, tonConnectUI } = useTonConnect();
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
    sendDonate: async (destination: Address, amount: bigint, itemSeqno: bigint) => {
      const lastTrx = await client?.getTransactions(sender.address!, {
        limit: 1,
      });
      let lastHash: String = "";
      if (lastTrx) {
        const last = lastTrx[0];
        lastHash = last.stateUpdate.newHash.toString();
      }

      console.log('dest', destination.toString());
      console.log('seqno', itemSeqno);
      await jettonWalletContract?.sendDonate(sender, destination, amount, itemSeqno);

      let txHash = lastHash;
      while (txHash == lastHash) {
        await new Promise((r) => setTimeout(r, 1500)); // some delay between API calls
        let tx = await client?.getTransactions(sender.address!, {
          limit: 1,
        });
        if (tx) txHash = tx[0].stateUpdate.newHash.toString();
      }
    },
  };
}