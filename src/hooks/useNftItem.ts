import { Address, OpenedContract, fromNano } from "ton-core";
import NftItem from "../contracts/nftItem";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import { useTonApiClient } from "./useTonApi";
import { useTonWallet } from "@tonconnect/ui-react";
import { COLLECTION_ADDRESS } from "./useNftCollection";
import { useEffect, useState } from "react";

export default function useNftItem() {
  const LIKE_PREFIX = 798965746;
  const nftDeployPrefix = 608941821;
  const { client } = useTonClient();
  const wallet = useTonWallet();
  const { client: tonApiClient } = useTonApiClient();
  const [nftsIndex, setNftsIndex] = useState<number[]>([]);
  const [likedIds, setLikedIds] = useState<number[]>([]);

  useEffect(() => {
    async function getValidNfts() {
      const result = (
        await tonApiClient.accounts.getAccountNftItems(wallet!.account.address)
      ).nft_items;

      const userNfts = result.filter((x) => {
        return (
          x.collection!.address ==
          Address.parse(COLLECTION_ADDRESS).toRawString()
        );
      });

      console.log("USER NFTS", userNfts);

      const validNfts: number[] = [];

      for (let i = 0; i < userNfts.length; i++) {
        const nft = userNfts[i];

        const contract = new NftItem(Address.parseRaw(nft.address));

        const result = client!.open(contract) as OpenedContract<NftItem>;

        const deployTime = await result.getDeployTime();

        const nowInSeconds = Math.floor(Date.now() / 1000);
        const isNftValid =
          BigInt(nowInSeconds) - deployTime < 30 * 24 * 60 * 60;

        if (isNftValid) {
          validNfts.push(nft.index);
        }

        //если нфт 2 и более то два реквеста с лайком, но в модели поле likes увеличить на 1
      }

      setNftsIndex(validNfts);

      console.log("validNfts", validNfts);

      const transactions = await client!.getTransactions(
        Address.parse(COLLECTION_ADDRESS),
        { limit: 10 }
      );

      const likedItemIds: number[] = [];

      for (let i = 0; i < transactions.length; i++) {
        const trx = transactions[i];

        const bodySlice = trx.inMessage?.body.asSlice();

        if (!bodySlice || bodySlice?.clone().loadUint(32) != LIKE_PREFIX)
          continue;

        bodySlice.loadUint(32);
        const itemId = bodySlice.loadUint(256);
        const nftIndex = bodySlice.loadUint(256);

        if (validNfts.some((x) => x === nftIndex)) {
          likedItemIds.push(parseInt(fromNano(itemId)));
        }
      }

      setLikedIds(likedItemIds);
    }

    if (wallet && client) {
      getValidNfts();
    }
  }, [wallet, client]);

  return { nftsIndex, likedIds };
}
