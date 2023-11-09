import { Address, Dictionary, OpenedContract } from "ton-core";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useMasterWallet } from "./useMasterWallet";
import { useTonConnect } from "./useTonConnect";
import FundContract from "../contracts/fund";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import FundData from "../models/FundData";

export function useFundContract() {
  const { client } = useTonClient();
  const { sender } = useTonConnect();
  const { lastFundAddress, address } = useMasterWallet();
  const [addresses, setAddresses] = useState<
    Dictionary<bigint, Address> | undefined
  >();
  const [fundData, setFundData] = useState<FundData>();

  const fundContract = useAsyncInitialize(async () => {
    if (!client || !lastFundAddress) return;

    const contract = new FundContract(lastFundAddress!);

    return client.open(contract) as OpenedContract<FundContract>;
  }, [client, lastFundAddress]);

  useEffect(() => {
    async function getAddresses() {
      if (!fundContract) return;
      const res = await fundContract.getAllItemsAddresses(address!);
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
    createItem: () => fundContract?.sendCreateItem(sender, address!),
    addresses: addresses,
  };
}
