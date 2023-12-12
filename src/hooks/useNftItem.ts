import { Address, OpenedContract, fromNano } from "ton-core";
import NftItem from "../contracts/nftItem";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import { useTonApiClient } from "./useTonApi";
import { useTonWallet } from "@tonconnect/ui-react";
import { COLLECTION_ADDRESS } from "./useNftCollection";
import { useEffect } from "react";

export default function useNftItem() {
  const nftDeployPrefix = 608941821;
  const { client } = useTonClient();
  const { sender } = useTonConnect();
  const wallet = useTonWallet();
  const { client: tonApiClient } = useTonApiClient();

  const itemContract = useAsyncInitialize(async () => {
    if (!client || !sender.address) return;

    // await getAdress();

    const contract = new NftItem(
      Address.parse("EQC_j3X1doR4CoPcA3p659Jo-CXbG8LqAdR5-3XOGElh-09v")
    );

    const result = client.open(contract) as OpenedContract<NftItem>;

    return result;
  }, [client]);

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

      console.log("VALID", validNfts);
    }

    if (wallet) {
      getValidNfts();
    }
  }, [wallet]);
}
