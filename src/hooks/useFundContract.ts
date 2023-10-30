import { OpenedContract } from "ton-core";
import Fund from "../contracts/fund";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useMasterWallet } from "./useMasterWallet";

export function useFundContract() {
    const { client } = useTonClient();
    const { getLastFundAddress } = useMasterWallet();

    const fundContract = useAsyncInitialize(async () => {
        if (!client) return;
        const fundAddress = await getLastFundAddress();
        
        const contract = new Fund(fundAddress!);

        return client.open(contract) as OpenedContract<Fund>;
    })

    return {
        getFundData: () => fundContract?.getFundData()
    }
}