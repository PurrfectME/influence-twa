import { Address, OpenedContract, fromNano, toNano } from "ton-core";
import NftCollection from "../contracts/nftCollection";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import { useEffect, useState } from "react";
import { useTonWallet } from "@tonconnect/ui-react";
import { useTonApiClient } from "./useTonApi";
import NftItem from "../contracts/nftItem";

export const COLLECTION_ADDRESS =
  "EQBrJuYgDOi5LEFcDln-MgE5eg4FHFw-vK06LkE3uZ_tZ8at";

export default function useNftCollection() {
  const { sender } = useTonConnect();
  const { client } = useTonClient();
  const wallet = useTonWallet();
  const { client: tonApiClient } = useTonApiClient();

  const collectionContract = useAsyncInitialize(async () => {
    if (!client) return;

    const contract = new NftCollection(Address.parse(COLLECTION_ADDRESS));

    const res = client!.open(contract) as OpenedContract<NftCollection>;

    return res;
  }, [client]);

  return {
    buyNft: (amount: string) => collectionContract?.sendBuyNft(sender, amount),
    sendLike: (itemId: bigint, nftIndex: number) =>
      collectionContract?.sendLike(sender, itemId, nftIndex),
  };
}
