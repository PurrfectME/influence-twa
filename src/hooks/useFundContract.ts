import { Address, Dictionary, OpenedContract } from "ton-core";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useMasterWallet } from "./useMasterWallet";
import { useTonConnect } from "./useTonConnect";
import FundContract from "../contracts/fund";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import FundData from "../models/FundData";
import FundItemData from "../models/FundItemData";

export function useFundContract() {
  const { client } = useTonClient();
  const { sender } = useTonConnect();
  const [addresses, setAddresses] = useState<
    Dictionary<bigint, Address> | undefined
  >();
  const [fundData, setFundData] = useState<FundData>();
  const [likedItems, setLikedItems] = useState<FundItemData[]>();
  const [availableItems, setAvailableItems] = useState<FundItemData[]>();

  const fundContract = useAsyncInitialize(async () => {
    if (!client) return;

    const contract = new FundContract(
      Address.parse("EQCotjVl4ABkpigiudLRuyuRLow3R2qw3CJAtnScPzthn6AD")
    );

    return client.open(contract) as OpenedContract<FundContract>;
  }, [client]);

  useEffect(() => {
    async function getAddresses() {
      if (!fundContract) return;
      const res = await fundContract.getAllItemsAddresses();
      setAddresses(res);
    }

    async function getFundData() {
      if (!fundContract) return;

      const res = await fundContract.getFundData();
      setFundData(res);
    }

    getAddresses();
    getFundData();
  }, [fundContract]);

  return {
    data: fundData,
    getLastItemAddress: () => fundContract?.getLastItemAddress(),
    createItem: () => fundContract?.sendCreateItem(sender),
    addresses: addresses,
  };
}
