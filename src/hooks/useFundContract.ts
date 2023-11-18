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
  const { getJettonWalletAddress, isInitialized: isMasterInitialized } =
    useMasterWallet();

  const fundContract = useAsyncInitialize(async () => {
    if (!client) return;

    //EQCotjVl4ABkpigiudLRuyuRLow3R2qw3CJAtnScPzthn6AD

    const contract = new FundContract(
      Address.parse("EQDC7B5IcjQ8Qimnni963sagYAQeh4pE3CwQ49H5NsCxBRpr")
    );

    const c = client.open(contract) as OpenedContract<FundContract>;

    return client.open(contract) as OpenedContract<FundContract>;
  }, [client]);

  const { data: addresses } = useQuery(
    ["addresses"],
    async () => {
      return await fundContract!.getAllItemsAddresses();
    },
    { enabled: fundContract !== undefined }
  );

  const { data: fundData } = useQuery(
    ["fundData"],
    async () => {
      return await fundContract!.getFundData();
    },
    { enabled: fundContract !== undefined }
  );

  const { data, status, isFetching } = useQuery(
    ["likedAndAvailableData"],
    async () => {
      console.log("BLIP");

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

      await Promise.all(
        arr.map(async (address, i) => {
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
                limit: 40,
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
        })
      );

      return { likedArr, availableArr };
    },
    {
      enabled: addresses != undefined && isMasterInitialized,
    }
  );

  return {
    data: fundData,
    getLastItemAddress: () => fundContract?.getLastItemAddress(),
    createItem: () => fundContract?.sendCreateItem(sender),
    addresses: addresses,
    likedData: data?.likedArr,
    availableData: data?.availableArr,
  };
}
