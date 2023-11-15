import { Address, OpenedContract } from "ton-core";
import FundItemContract from "../contracts/fundItem";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useEffect, useState } from "react";
import FundItemData from "../models/FundItemData";
import { useTonConnect } from "./useTonConnect";
import { useMasterWallet } from "./useMasterWallet";
import useJettonWallet from "./useJettonWallet";

export function useFundItemContract(itemAddress: Address) {
  const { client } = useTonClient();
  const { sender } = useTonConnect();
  const [data, setData] = useState<FundItemData>();
  const [liked, setLiked] = useState<boolean>();
  const { data: itemJettonWallet, address: itemJettonAddress } =
    useJettonWallet(itemAddress);
  const { address: jettonSenderwalletAddress } = useJettonWallet(
    sender.address
  );

  const fundItemContract = useAsyncInitialize(async () => {
    if (!client || !itemJettonAddress || !jettonSenderwalletAddress) return;
    const contract = new FundItemContract(itemAddress);

    const tranxs = await client.getTransactions(itemJettonAddress, {
      //TODO: enlardge limit
      limit: 20,
    });

    if (tranxs) {
      tranxs.some((x) => {
        const trxSender = x.inMessage?.info.src?.toString();
        if (trxSender && trxSender === jettonSenderwalletAddress.toString()) {
          console.log("HERE");

          setLiked(true);
        }
      });
    }

    return client.open(contract) as OpenedContract<FundItemContract>;
  }, [client, itemJettonAddress, jettonSenderwalletAddress]);

  useEffect(() => {
    async function getData() {
      if (!fundItemContract) return;
      const res = await fundItemContract.getItemData();
      setData(res);
    }

    getData();
  }, [fundItemContract]);

  return {
    data: data,
    liked,
    itemJettonWallet,
  };
}
