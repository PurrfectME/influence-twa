import { Address, OpenedContract, Transaction } from "ton-core";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import { useMasterWallet } from "./useMasterWallet";
import InfluenceJettonWallet from "../contracts/jettonWallet";
import { useEffect, useState } from "react";
import JettonWalletData from "../models/JettonWalletData";

export default function useJettonWallet(
  owner: Address | undefined,
  needTrxs?: boolean
) {
  const { client } = useTonClient();
  const { sender } = useTonConnect();
  const { getJettonWalletAddress, isInitialized: isMasterInitialized } =
    useMasterWallet();
  const [walletData, setWalletData] = useState<JettonWalletData>();
  const [trxs, setTrxs] = useState<Transaction[]>();

  const jettonWalletContract = useAsyncInitialize(async () => {
    if (!client || !isMasterInitialized || !owner) return;

    const jettonWalletAddress = await getJettonWalletAddress(owner);

    const contract = new InfluenceJettonWallet(jettonWalletAddress!);

    const res = client.open(contract) as OpenedContract<InfluenceJettonWallet>;

    const data = await res.getWalletData();
    setWalletData(data);

    if (needTrxs) {
      const tranxs = await client.getTransactions(jettonWalletAddress!, {
        limit: 20,
      });
      setTrxs(tranxs);
    }

    return res;
  }, [client, isMasterInitialized]);

  const isLiked = (senderJettonWalletAddress: String | undefined) => {
    if (trxs) {
      return trxs.some((x) => {
        const trxSender = x.inMessage?.info.src?.toString();
        if (trxSender && trxSender === senderJettonWalletAddress) {
          return true;
        }
      });
    }

    return false;
  };

  return {
    data: walletData,
    address: jettonWalletContract?.address,
    isLiked,
    sendDonate: (destination: Address, amount: bigint) =>
      jettonWalletContract?.sendDonate(sender, destination, amount),
  };
}
