import { Address, OpenedContract } from "ton-core";
import FundItemContract from "../contracts/fundItem";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useEffect, useState } from "react";
import FundItemData from "../models/FundItemData";

export function useFundItemContract(address: Address){
    const { client } = useTonClient();
    const [data, setData] = useState<FundItemData>();

    const fundItemContract = useAsyncInitialize(async () => {
        if (!client) return;
        const contract = new FundItemContract(address);

        return client.open(contract) as OpenedContract<FundItemContract>;
    }, [client]);

    useEffect(() => {
        async function getData() {
            if(!fundItemContract) return;
            const res =  await fundItemContract.getItemData();
            setData(res);
        }

        getData();
    }, [fundItemContract]);

    return {
        data: data
    }
}