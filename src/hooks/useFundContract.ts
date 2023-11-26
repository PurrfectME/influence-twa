import {
  Address,
  BitBuilder,
  BitReader,
  BitString,
  Cell,
  Dictionary,
  OpenedContract,
  contractAddress,
  fromNano,
  toNano,
} from "ton-core";
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
import data from "../items/data.json";
//-13 - у новой созданной заяки ещё нет своего волета

export function useFundContract() {
  const { client } = useTonClient();
  const { sender, connected, tonConnectUI } = useTonConnect();
  const {
    getJettonWalletAddress,
    isInitialized: isMasterInitialized,
    // jettonWalletAddress: senderJettonWalletAddress,
  } = useMasterWallet();
  const [liked, setLiked] = useState<ItemData[]>([]);
  const [available, setAvailable] = useState<ItemData[]>([]);
  const [addresses, setAddresses] = useState<
    Dictionary<bigint, Address> | undefined
  >();
  const [fundData, setFundData] = useState<FundData>();
  const [jettonWalletAddress, setJettonWalletAddress] = useState<Address>();
  const [loading, setLoading] = useState<boolean>(true);

  const fundContract = useAsyncInitialize(async () => {
    if (!client || !isMasterInitialized) return;

    const contract = new FundContract(
      Address.parse("EQC_j3X1doR4CoPcA3p659Jo-CXbG8LqAdR5-3XOGElh-09v")
    );

    const result = client.open(contract) as OpenedContract<FundContract>;

    // const addresses = await result.getAllItemsAddresses();
    // setAddresses(addresses!);

    const data = await result.getFundData();
    setFundData(data);

    return result;
  }, [client, isMasterInitialized]);

  async function fetchItems() {
    setLoading(true);
    setAvailable([]);
    setLiked([]);
    let likedArr: ItemData[] = [];
    let availableArr: ItemData[] = [];

    // if (!sender.address) {
    //   data.map((x) => {
    //     availableArr.push(
    //       new ItemData(
    //         fundContract!.address,
    //         x.description,
    //         toNano(x.amountToHelp),
    //         toNano(x.currentAmount),
    //         x.title,
    //         x.imageUrl,
    //         toNano(x.id),
    //         0n,
    //         false
    //       )
    //     );
    //   });

    //   setLiked([]);
    //   setAvailable(availableArr);

    //   return;
    // }

    const fundJettonWalletAddress = await getJettonWalletAddress(
      fundContract!.address
    );
    console.log("DEAD", sender.address);
    let senderJettonWalletAddress: Address | undefined;

    if (sender.address) {
      console.log("INSIDE");

      senderJettonWalletAddress = await getJettonWalletAddress(sender.address!);
    }

    if (fundJettonWalletAddress) {
      setJettonWalletAddress(fundJettonWalletAddress);

      let dict: Map<bigint, SenderLike> = new Map();

      const tranxs = await client!.getTransactions(fundJettonWalletAddress, {
        //TODO: enlarge limit
        limit: 20,
      });

      tranxs!.map((x) => {
        let amount: bigint;
        let itemSeqno: bigint;

        const cell = x.inMessage?.body.asSlice()!;

        const op = cell.loadUint(32);

        //TOKEN TRANSFER INTERNAL CODE
        if (op === 395134233) {
          const queryId = cell.loadUintBig(64);
          amount = cell.loadCoins();
          itemSeqno = cell.loadIntBig(257);

          let existing = dict.get(itemSeqno);

          if (existing) {
            dict.set(itemSeqno, {
              total: existing.total! + amount,
              liked: false,
            });
            // existing += amount;
          } else {
            if (itemSeqno != 0n)
              dict.set(itemSeqno, { total: amount, liked: false });
          }

          const trxSender = x.inMessage?.info.src?.toString();
          if (
            trxSender &&
            senderJettonWalletAddress &&
            trxSender === senderJettonWalletAddress!.toString()
          ) {
            let likedItem = dict.get(itemSeqno);
            dict.set(itemSeqno, { total: likedItem!.total, liked: true });
          }
        }
      });

      if (dict.size != 0) {
        data.map((x) => {
          if (dict.has(toNano(x.id))) {
            const item = dict.get(toNano(x.id))!;

            if (item.liked && sender.address != undefined) {
              likedArr.push(
                new ItemData(
                  fundContract!.address,
                  x.description,
                  toNano(x.amountToHelp),
                  toNano(x.currentAmount),
                  x.title,
                  x.imageUrl,
                  toNano(x.id),
                  item.total,
                  true
                )
              );
            } else {
              availableArr.push(
                new ItemData(
                  fundContract!.address,
                  x.description,
                  toNano(x.amountToHelp),
                  toNano(x.currentAmount),
                  x.title,
                  x.imageUrl,
                  toNano(x.id),
                  item.total,
                  false
                )
              );
            }
          } else {
            availableArr.push(
              new ItemData(
                fundContract!.address,
                x.description,
                toNano(x.amountToHelp),
                toNano(x.currentAmount),
                x.title,
                x.imageUrl,
                toNano(x.id),
                0n,
                false
              )
            );
          }
        });
      } else {
        data.map((x) => {
          availableArr.push(
            new ItemData(
              fundContract!.address,
              x.description,
              toNano(x.amountToHelp),
              toNano(x.currentAmount),
              x.title,
              x.imageUrl,
              toNano(x.id),
              0n,
              false
            )
          );
        });
      }

      setLiked(likedArr);
      setAvailable(availableArr);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!fundContract) return;

    fetchItems();
  }, [fundContract, connected]);

  return {
    data: fundData,
    getLastItemAddress: () => fundContract?.getItemAddress(0n),
    createItem: () => fundContract?.sendCreateItem(sender),
    addresses: addresses,
    likedData: liked,
    availableData: available,
    fetchItems,
    jettonWalletAddress,
    address: fundContract?.address,
    loading,
    setLoading,
  };
}

class SenderLike {
  total: bigint = 0n;
  liked: boolean = false;
}
