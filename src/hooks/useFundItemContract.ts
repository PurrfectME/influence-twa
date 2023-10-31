import { Address, OpenedContract } from "ton-core";
import FundItemContract from "../contracts/fundItem";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";

export function useFundItemContract(address: Address){
    const { wallet, sender } = useTonConnect();
    const { client } = useTonClient();

    const fundItemContract = useAsyncInitialize(async () => {
        if (!client || !wallet) return;
        const contract = new FundItemContract(address);

        return client.open(contract) as OpenedContract<FundItemContract>;
    }, [client, wallet]);

    return {
        getItemData: () => fundItemContract?.getItemData()
    }
}