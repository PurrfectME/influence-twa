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
    jettonWalletAddress: senderJettonWalletAddress,
  } = useMasterWallet();
  const [liked, setLiked] = useState<ItemData[]>();
  const [available, setAvailable] = useState<ItemData[]>();
  const [addresses, setAddresses] = useState<
    Dictionary<bigint, Address> | undefined
  >();
  const [fundData, setFundData] = useState<FundData>();
  const [items, setItems] = useState<ItemData[]>();
  const [jettonWalletAddress, setJettonWalletAddress] = useState<Address>();

  const fundContract = useAsyncInitialize(async () => {
    if (!client || !isMasterInitialized) return;

    const contract = new FundContract(
      Address.parse("EQA0yRJDfhzWzhmuFtJm3XXApf5JYK5S_rawKNbxKTDYTtwo")
    );

    const result = client.open(contract) as OpenedContract<FundContract>;

    // const addresses = await result.getAllItemsAddresses();
    // setAddresses(addresses!);

    const data = await result.getFundData();
    setFundData(data);

    return result;
  }, [client, isMasterInitialized]);

  async function fetchItems() {
    let likedArr: ItemData[] = [];
    let availableArr: ItemData[] = [];

    const fundJettonWalletAddress = await getJettonWalletAddress(
      fundContract!.address
    );
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

        if (op === 260734629) {
          const queryId = cell.loadUintBig(64);
          amount = cell.loadCoins();
          const dest = cell.loadAddress();
          const respDest = cell.loadAddress();
          const customPayload = cell.loadBit() ? cell.loadRef() : null;
          const forwardTonAmount = cell.loadCoins();
          const forwardPayload = cell.asCell();
          const isDonate = cell.loadBit();
          itemSeqno = cell.loadRef().asSlice().loadIntBig(257);

          let existing = dict.get(itemSeqno);

          if (existing) {
            dict.set(itemSeqno, {
              total: existing.total! + amount,
              liked: false,
            });
            // existing += amount;
          } else {
            dict.set(itemSeqno, { total: amount, liked: false });
          }

          const trxSender = x.inMessage?.info.src?.toString();
          if (
            trxSender &&
            trxSender === senderJettonWalletAddress!.toString()
          ) {
            let likedItem = dict.get(itemSeqno);
            dict.set(itemSeqno, { total: likedItem!.total, liked: true });
          }
        }
      });

      if (dict.size != 0) {
        for (const [key, value] of Object.entries(dict)) {
          const item = data.find((x) => x.id.toString() == fromNano(key))!;
          if (value.liked) {
            likedArr.push(
              new ItemData(
                fundContract!.address,
                item.description,
                toNano(item.amountToHelp),
                toNano(item.currentAmount),
                item.title,
                item.imageUrl,
                toNano(key),
                value.total,
                true
              )
            );
          } else {
            availableArr.push(
              new ItemData(
                fundContract!.address,
                item.description,
                toNano(item.amountToHelp),
                toNano(item.currentAmount),
                item.title,
                item.imageUrl,
                toNano(key),
                value.total,
                false
              )
            );
          }
        }
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
    }
  }

  useEffect(() => {
    if (!fundContract) return;

    fetchItems();
  }, [fundContract]);

  return {
    data: fundData,
    getLastItemAddress: () => fundContract?.getItemAddress(0n),
    createItem: () => fundContract?.sendCreateItem(sender),
    addresses: addresses,
    likedData: liked,
    availableData: available,
    // fetchItems,
    jettonWalletAddress,
    address: fundContract?.address,
  };
}

class SenderLike {
  total: bigint = 0n;
  liked: boolean = false;
}
