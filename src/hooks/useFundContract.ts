import { OpenedContract } from "ton-core";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useMasterWallet } from "./useMasterWallet";
import { useTonConnect } from "./useTonConnect";
import FundContract from "../contracts/fund";

export function useFundContract() {
    const { client } = useTonClient();
    const { sender } = useTonConnect();
    const { getLastFundAddress } = useMasterWallet();

    const fundContract = useAsyncInitialize(async () => {
        if (!client) return;
        const fundAddress = await getLastFundAddress();
        
        const contract = new FundContract(fundAddress!);

        return client.open(contract) as OpenedContract<FundContract>;
    })

    return {
        getFundData: () => fundContract?.getFundData(),
        getLastItemAddress: () => fundContract?.getLastItemAddress(),
        createItem: () => fundContract?.sendCreateItem(sender),
        getAllAddresses: () => fundContract?.getAllItemsAddresses(),
    }
}