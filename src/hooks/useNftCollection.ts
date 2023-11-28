import { Address, OpenedContract } from "ton-core";
import NftCollection from "../contracts/nftCollection";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";

const addr = "EQB9y04L6aCcbfJCCyfB48HULTp09WWhpFL3JED-iE3H-mrh";

export default function useNftCollection() {
  const { sender } = useTonConnect();
  const { client } = useTonClient();

  const collectionContract = useAsyncInitialize(async () => {
    if (!client) return;

    const contract = new NftCollection(Address.parse(addr));

    const res = client.open(contract) as OpenedContract<NftCollection>;

    return res;
  }, [client]);

  return {
    buyNft: (amount: string) => collectionContract?.sendBuyNft(sender, amount),
  };
}
