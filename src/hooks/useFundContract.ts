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
  const [addresses, setAddresses] = useState<
    Dictionary<bigint, Address> | undefined
  >();
  const [fundData, setFundData] = useState<FundData>();

  const fundContract = useAsyncInitialize(async () => {
    if (!client) return;
    //EQCotjVl4ABkpigiudLRuyuRLow3R2qw3CJAtnScPzthn6AD

    const contract = new FundContract(
      Address.parse("EQDC7B5IcjQ8Qimnni963sagYAQeh4pE3CwQ49H5NsCxBRpr")
    );

    return client.open(contract) as OpenedContract<FundContract>;
  }, [client]);

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
  };
}
