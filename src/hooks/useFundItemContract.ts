import { Address, OpenedContract } from "ton-core";
import FundItemContract from "../contracts/fundItem";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useEffect, useState } from "react";
import FundItemData from "../models/FundItemData";
import { useTonConnect } from "./useTonConnect";
import { useMasterWallet } from "./useMasterWallet";
import useJettonWallet from "./useJettonWallet";

export function useFundItemContract(
  itemAddress: Address,
  jettonSenderwalletAddress: Address | undefined,
  itemJettonAddress: Address | undefined
) {
  const { client } = useTonClient();
  const { sender } = useTonConnect();
  const [data, setData] = useState<FundItemData>();
  const [liked, setLiked] = useState<boolean>(false);

  // const { address: jettonSenderwalletAddress } = useJettonWallet(
  //   sender.address
  // );

  const fundItemContract = useAsyncInitialize(async () => {
    if (!client || !jettonSenderwalletAddress) return;
    const contract = new FundItemContract(itemAddress);

    //У свежей созданной заявки ещё нет жеттон кошелька!!!!
    if (itemJettonAddress) {
      const tranxs = await client.getTransactions(itemJettonAddress, {
        //TODO: enlardge limit
        limit: 20,
      });

      if (tranxs) {
        tranxs.some((x) => {
          const trxSender = x.inMessage?.info.src?.toString();
          if (trxSender && trxSender === jettonSenderwalletAddress.toString()) {
            setLiked(true);
          }
        });
      }
    }

    return client.open(contract) as OpenedContract<FundItemContract>;
  }, [client, jettonSenderwalletAddress, itemJettonAddress]);

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
  };
}
