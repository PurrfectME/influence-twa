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
  const { sender, connected, tonConnectUI } = useTonConnect();
  const { getJettonWalletAddress, isInitialized: isMasterInitialized } =
    useMasterWallet();
  const [likedArr, setLikedArr] = useState<ItemData[]>();
  const [availableArr, setAvailableArr] = useState<ItemData[]>();
  const [addresses, setAddresses] = useState<
    Dictionary<bigint, Address> | undefined
  >();
  const [fundData, setFundData] = useState<FundData>();

  const fundContract = useAsyncInitialize(async () => {
    if (!client || !isMasterInitialized) return;

    const contract = new FundContract(
      Address.parse("EQDC7B5IcjQ8Qimnni963sagYAQeh4pE3CwQ49H5NsCxBRpr")
    );

    const result = client.open(contract) as OpenedContract<FundContract>;

    const addresses = await result.getAllItemsAddresses();
    setAddresses(addresses!);

    const data = await result.getFundData();
    setFundData(data);

    return result;
  }, [client, isMasterInitialized]);

  async function fetchItems() {
    //sender wallet init
    let senderWalletAddress: Address | undefined;
    let sWC: InfluenceJettonWallet;
    let senderWalletContract: OpenedContract<InfluenceJettonWallet>;
    let jettonSenderwalletAddress: Address | undefined;

    if (sender.address) {
      senderWalletAddress = await getJettonWalletAddress(sender.address);
      sWC = new InfluenceJettonWallet(senderWalletAddress!);
      senderWalletContract = client!.open(sWC);
      jettonSenderwalletAddress = senderWalletContract.address;
    }

    let likedArr: ItemData[] = [];
    let availableArr: ItemData[] = [];
    let arr: Address[] = [];

    for (let index = 1; index <= addresses!.size; index++) {
      const address = addresses!.get(BigInt(index));
      if (address) {
        arr.push(address);
      }
    }

    for (let index = 0; index < arr.length; index++) {
      const address = arr[index];

      //fund item contract init
      const fundItem = new FundItemContract(address);
      const fundItemContract = client!.open(
        fundItem
      ) as OpenedContract<FundItemContract>;
      const data = await fundItemContract.getItemData();

      //item wallet init
      let iWC: InfluenceJettonWallet;
      let itemWalletContract: OpenedContract<InfluenceJettonWallet>;
      let itemJettonAddress: Address;
      let itemWalletData: JettonWalletData;
      const itemWalletAddress = await getJettonWalletAddress(address);

      if (
        itemWalletAddress &&
        (await client!.isContractDeployed(itemWalletAddress))
      ) {
        iWC = new InfluenceJettonWallet(itemWalletAddress);
        itemWalletContract = client!.open(iWC);
        itemJettonAddress = itemWalletContract.address;
        itemWalletData = await itemWalletContract.getWalletData();

        if (data && itemWalletData && sender.address) {
          const tranxs = await client!.getTransactions(itemJettonAddress, {
            //TODO: enlardge limit
            limit: 20,
          });

          if (tranxs) {
            const hasAny = tranxs.some((x) => {
              const trxSender = x.inMessage?.info.src?.toString();
              if (
                trxSender &&
                trxSender === jettonSenderwalletAddress!.toString()
              ) {
                return true;
              }

              return false;
            });

            if (hasAny) {
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
              itemWalletData.balance,
              false
            )
          );
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
    }

    // Promise.all(
    //   arr.map(async (address, i) => {

    //     // await new Promise((r) => setTimeout(r, 1500));
    //   })
    // );

    setLikedArr(likedArr);
    setAvailableArr(availableArr);
  }

  useEffect(() => {
    if (!addresses) return;

    fetchItems();
  }, [connected, addresses]);

  // tonConnectUI.onStatusChange(async (wallet) => {
  //   if (addresses && isMasterInitialized) {
  //     console.log("kjkj");

  //     fetchItems();
  //   }
  // });

  return {
    data: fundData,
    getLastItemAddress: () => fundContract?.getLastItemAddress(),
    createItem: () => fundContract?.sendCreateItem(sender),
    addresses: addresses,
    likedData: likedArr,
    availableData: availableArr,
    fetchItems,
  };
}
