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
  const [likedArr, setLikedArr] = useState<ItemData[]>();
  const [availableArr, setAvailableArr] = useState<ItemData[]>();
  const [addresses, setAddresses] = useState<
    Dictionary<bigint, Address> | undefined
  >();
  const [fundData, setFundData] = useState<FundData>();
  const [items, setItems] = useState<ItemData[]>();
  const [jettonWalletAddress, setJettonWalletAddress] = useState<Address>();

  const fundContract = useAsyncInitialize(async () => {
    if (!client || !isMasterInitialized) return;

    const contract = new FundContract(
      Address.parse("EQBpbv2449mcHTn6wNQtvVe4jEuwNqubcBDg_P0RnoJZgIeF")
    );

    const result = client.open(contract) as OpenedContract<FundContract>;

    // const addresses = await result.getAllItemsAddresses();
    // setAddresses(addresses!);

    const data = await result.getFundData();
    setFundData(data);

    return result;
  }, [client, isMasterInitialized]);

  useEffect(() => {
    async function abf() {
      const fundJettonWalletAddress = await getJettonWalletAddress(
        fundContract!.address
      );
      if (fundJettonWalletAddress) {
        setJettonWalletAddress(fundJettonWalletAddress);
        const tranxs = await client!.getTransactions(fundJettonWalletAddress, {
          //TODO: enlarge limit
          limit: 20,
        });

        if (tranxs) {
          const hasAny = tranxs.map((x) => {
            const trxSender = x.inMessage?.info.src?.toString();
            // console.log("SENDER", trxSender);

            // const reader = new BitReader(x.inMessage!.body!.asSlice().remainingBits);
            const cell = x.inMessage?.body.asSlice()!;

            // const id = cell?.loadBits(cell.remainingBits);

            // const jsonString = cell.toString("utf8");

            // const a = cell?.loadAddress();
            console.log("OP", cell.loadUint(32));

            console.log("DATA", fromNano(cell.loadUintBig(64)!));
            console.log("coins", cell.loadCoins());
            console.log("adr", cell.loadAddress());

            if (
              trxSender &&
              trxSender === senderJettonWalletAddress!.toString()
            ) {
              console.log("HERE");

              return true;
            }

            return false;
          });

          // if (hasAny) {
          //   likedArr.push(
          //     new ItemData(
          //       fundContract!.address,
          //       itemWalletData.description,
          //       itemWalletData.amountToHelp,
          //       itemWalletData.currentAmount,
          //       itemWalletData.title,
          //       itemWalletData.deployTime,
          //       itemWalletData.imageUrl,
          //       itemWalletData.seqno,
          //       itemWalletData.balance,
          //       true
          //     )
          //   );
          // } else {
          //   availableArr.push(
          //     new ItemData(
          //       fundContract!.address,
          //       itemWalletData.description,
          //       itemWalletData.amountToHelp,
          //       itemWalletData.currentAmount,
          //       itemWalletData.title,
          //       itemWalletData.deployTime,
          //       itemWalletData.imageUrl,
          //       itemWalletData.seqno,
          //       itemWalletData.balance,
          //       false
          //     )
          //   );
          // }
        }
      }
    }

    if (!fundContract) return;

    abf();
  }, [fundContract]);

  // async function fetchItems(fundAddress?: Address) {
  //   //sender wallet init
  //   //TODO: init here in useMasterWallet
  //   let senderWalletAddress: Address | undefined;
  //   let sWC: InfluenceJettonWallet;
  //   let senderWalletContract: OpenedContract<InfluenceJettonWallet>;
  //   let jettonSenderwalletAddress: Address | undefined;

  //   if (sender.address) {
  //     senderWalletAddress = await getJettonWalletAddress(sender.address);
  //     sWC = new InfluenceJettonWallet(senderWalletAddress!);
  //     senderWalletContract = client!.open(sWC);
  //     jettonSenderwalletAddress = senderWalletContract.address;
  //   }

  //   let likedArr: ItemData[] = [];
  //   let availableArr: ItemData[] = [];
  //   let arr: Address[] = [];

  //   for (let index = 1; index <= addresses!.size; index++) {
  //     const address = addresses!.get(BigInt(index));
  //     if (address) {
  //       arr.push(address);
  //     }
  //   }

  //   for (let index = 0; index < arr.length; index++) {
  //     const address = arr[index];

  //     //item wallet init
  //     let iWC: InfluenceJettonWallet;
  //     let itemWalletContract: OpenedContract<InfluenceJettonWallet>;
  //     let itemWalletData: JettonWalletData;

  //     iWC = new InfluenceJettonWallet(address);
  //     itemWalletContract = client!.open(iWC);
  //     itemWalletData = await itemWalletContract.getWalletData();

  //     console.log('1', address.toString());

  //     const a = await fundContract!.getItemAddress(itemWalletData.seqno);
  //     console.log('ADRE', a.toString() == address.toString());

  //     if (itemWalletData && sender.address) {
  //       const tranxs = await client!.getTransactions(address, {
  //         //TODO: enlarge limit
  //         limit: 20,
  //       });

  //       if (tranxs) {
  //         const hasAny = tranxs.some((x) => {
  //           const trxSender = x.inMessage?.info.src?.toString();
  //           if (
  //             trxSender &&
  //             trxSender === jettonSenderwalletAddress!.toString()
  //           ) {
  //             return true;
  //           }

  //           return false;
  //         });

  //         if (hasAny) {
  //           likedArr.push(
  //             new ItemData(
  //               fundContract!.address,
  //               itemWalletData.description,
  //               itemWalletData.amountToHelp,
  //               itemWalletData.currentAmount,
  //               itemWalletData.title,
  //               itemWalletData.deployTime,
  //               itemWalletData.imageUrl,
  //               itemWalletData.seqno,
  //               itemWalletData.balance,
  //               true
  //             )
  //           );
  //         } else {
  //           availableArr.push(
  //             new ItemData(
  //               fundContract!.address,
  //               itemWalletData.description,
  //               itemWalletData.amountToHelp,
  //               itemWalletData.currentAmount,
  //               itemWalletData.title,
  //               itemWalletData.deployTime,
  //               itemWalletData.imageUrl,
  //               itemWalletData.seqno,
  //               itemWalletData.balance,
  //               false
  //             )
  //           );
  //         }
  //       }
  //     }
  //   }

  //   setLikedArr(likedArr);
  //   setAvailableArr(availableArr);
  // }

  // useEffect(() => {
  //   if (!addresses || !fundContract) return;

  //   fetchItems(fundContract.address);
  // }, [connected, addresses, fundContract]);

  return {
    data: fundData,
    getLastItemAddress: () => fundContract?.getItemAddress(0n),
    createItem: () => fundContract?.sendCreateItem(sender),
    addresses: addresses,
    likedData: likedArr,
    availableData: availableArr,
    // fetchItems,
    jettonWalletAddress,
    address: fundContract?.address,
  };
}
