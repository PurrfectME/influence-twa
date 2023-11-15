import { Address, Dictionary, OpenedContract } from "ton-core";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useMasterWallet } from "./useMasterWallet";
import { useTonConnect } from "./useTonConnect";
import FundContract from "../contracts/fund";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import FundData from "../models/FundData";
import { ItemData } from "../models/ItemData";
import { useFundItemContract } from "./useFundItemContract";
import useJettonWallet from "./useJettonWallet";
import InfluenceJettonWallet from "../contracts/jettonWallet";
import FundItemContract from "../contracts/fundItem";
import JettonWalletData from "../models/JettonWalletData";

//-13 - у новой созданной заяки ещё нет своего волета

export function useFundContract() {
  const { client } = useTonClient();
  const { sender } = useTonConnect();
  const [addresses, setAddresses] = useState<
    Dictionary<bigint, Address> | undefined
  >();
  const [fundData, setFundData] = useState<FundData>();
  const { getJettonWalletAddress, isInitialized: isMasterInitialized } =
    useMasterWallet();

  const fundContract = useAsyncInitialize(async () => {
    if (!client) return;
    //EQCotjVl4ABkpigiudLRuyuRLow3R2qw3CJAtnScPzthn6AD

    const contract = new FundContract(
      Address.parse("EQDC7B5IcjQ8Qimnni963sagYAQeh4pE3CwQ49H5NsCxBRpr")
    );

    const c = client.open(contract) as OpenedContract<FundContract>;
    const res = await c.getAllItemsAddresses();
    setAddresses(res);

    return client.open(contract) as OpenedContract<FundContract>;
  }, [client]);

  const a = useAsyncInitialize(async () => {
    if (!addresses || !client || !sender.address || !isMasterInitialized)
      return;
    let arr: Address[] = [];

    for (let index = 1; index <= addresses.size; index++) {
      const address = addresses.get(BigInt(index));
      if (address) {
        arr.push(address);
      }
    }
    let likedArr: ItemData[] = [];
    let availableArr: ItemData[] = [];

    //FOR LOOP OR AWAIT PROMISE ALL
    await Promise.all(
      arr.map(async (address, index) => {
        //sender wallet init
        const senderWalletAddress = await getJettonWalletAddress(
          sender.address!
        );
        const sWC = new InfluenceJettonWallet(senderWalletAddress!);
        const senderWalletContract = client.open(
          sWC
        ) as OpenedContract<InfluenceJettonWallet>;
        const { address: jettonSenderwalletAddress } = senderWalletContract;

        //fund item contract init
        const fundItem = new FundItemContract(address);
        const fundItemContract = client.open(
          fundItem
        ) as OpenedContract<FundItemContract>;
        const data = await fundItemContract.getItemData();

        let iWC: InfluenceJettonWallet;
        let itemWalletContract: OpenedContract<InfluenceJettonWallet>;
        let itemJettonAddress: Address;
        let itemWalletData: JettonWalletData;
        //item wallet init
        const itemWalletAddress = await getJettonWalletAddress(address);
        console.log("ADDR", itemWalletAddress);

        if (
          itemWalletAddress &&
          (await client.isContractDeployed(itemWalletAddress))
        ) {
          iWC = new InfluenceJettonWallet(itemWalletAddress!);
          itemWalletContract = client.open(iWC);
          itemJettonAddress = itemWalletContract.address;
          itemWalletData = await itemWalletContract.getWalletData();

          if (itemJettonAddress && data && itemWalletData) {
            const tranxs = await client.getTransactions(itemJettonAddress, {
              //TODO: enlardge limit
              limit: 20,
            });

            if (tranxs) {
              tranxs.some((x) => {
                const trxSender = x.inMessage?.info.src?.toString();
                if (
                  trxSender &&
                  trxSender === jettonSenderwalletAddress.toString()
                ) {
                  likedArr.push(
                    new ItemData(
                      address,
                      data.description,
                      data.amountToHelp,
                      data.currentAmount,
                      data.title,
                      data.deployTime,
                      data.imageUrl,
                      data.seqno,
                      itemWalletData.balance,
                      true
                    )
                  );
                } else {
                  availableArr.push(
                    new ItemData(
                      address,
                      data.description,
                      data.amountToHelp,
                      data.currentAmount,
                      data.title,
                      data.deployTime,
                      data.imageUrl,
                      data.seqno,
                      itemWalletData.balance,
                      false
                    )
                  );
                }
              });
            }
          }
        } else {
          availableArr.push(
            new ItemData(
              address,
              data.description,
              data.amountToHelp,
              data.currentAmount,
              data.title,
              data.deployTime,
              data.imageUrl,
              data.seqno,
              0n,
              false
            )
          );
        }
      })
    );

    return { likedArr, availableArr };
  }, [client, isMasterInitialized]);

  useEffect(() => {
    async function getAddresses() {
      const res = await fundContract!.getAllItemsAddresses();
      setAddresses(res);
    }
    async function getFundData() {
      const res = await fundContract!.getFundData();
      setFundData(res);
    }

    if (fundContract) {
      getAddresses();
      getFundData();
    }
  }, [fundContract]);

  return {
    data: fundData,
    getLastItemAddress: () => fundContract?.getLastItemAddress(),
    createItem: () => fundContract?.sendCreateItem(sender),
    addresses: addresses,
    likedData: a?.likedArr,
    availableData: a?.availableArr,
  };
}
