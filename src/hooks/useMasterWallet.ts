import {
  Address,
  BitBuilder,
  BitReader,
  BitString,
  Cell,
  Dictionary,
  OpenedContract,
  Slice,
} from "ton-core";
import MasterWallet from "../contracts/masterWallet";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { sha256_sync } from "ton-crypto";

const toKey = (key: string) => {
  return BigInt(`0x${sha256_sync(key).toString("hex")}`);
};

const parseJettonData = (dict: Slice) => {
  dict.loadBits(8);
  const dic = dict.loadDict(
    Dictionary.Keys.BigUint(256),
    Dictionary.Values.Cell()
  );
  const name = dic.get(toKey("name"))?.asSlice().loadStringTail();
  const description = dic.get(toKey("description"))?.asSlice().loadStringTail();
  const image = dic.get(toKey("image"))?.asSlice().loadStringTail();
  const symbol = dic.get(toKey("symbol"))?.asSlice().loadStringTail();

  return { name, description, image, symbol };
};

export function useMasterWallet() {
  const { sender } = useTonConnect();
  const { client } = useTonClient();
  const addr = "EQDp0CdW7opfD4uOWQV_WY7_6QlNc0P93DFhwx6LNihpGV4T";
  const [jettonWalletAddress, setJettonWalletAddress] = useState<Address>();
  const [isInitialized, setIsInitialized] = useState(false);
  const [jettonData, setJettonData] = useState<{
    name: String | undefined;
    symbol: String | undefined;
    description: String | undefined;
    image: String | undefined;
  }>();

  const masterContract = useAsyncInitialize(async () => {
    if (!client) return;

    const contract = new MasterWallet(Address.parse(addr));

    const res = client.open(contract) as OpenedContract<MasterWallet>;

    if (sender.address) {
      const jd = await res.getJettonData();

      const jettonData = parseJettonData(jd.content.asSlice());
      setJettonData(jettonData);

      const jettonAddress = await res.getJettonWalletAddress(sender.address);

      setJettonWalletAddress(jettonAddress);
    }

    return res;
  }, [client]);

  useEffect(() => {
    if (!masterContract) return;

    setIsInitialized(true);
  }, [masterContract]);

  return {
    data: () => masterContract?.getJettonData(),
    createFund: () => masterContract?.sendCreateFund(sender),
    // lastFundAddress: lastFundAddress,
    mintTokens: (amount: bigint, receiver: Address) =>
      masterContract?.sendMintTokens(amount, receiver, sender),
    jettonWalletAddress: jettonWalletAddress,
    address: masterContract?.address,
    getJettonWalletAddress: (owner: Address) =>
      masterContract?.getJettonWalletAddress(owner),
    isInitialized: isInitialized,
    jettonData: jettonData,
  };
}
