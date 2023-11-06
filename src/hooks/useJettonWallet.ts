import { Address, OpenedContract } from "ton-core";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import { useMasterWallet } from "./useMasterWallet";
import InfluenceJettonWallet from "../contracts/jettonWallet";
import { useEffect, useState } from "react";
import JettonWalletData from "../models/JettonWalletData";

export default function useJettonWallet(){
    const { client } = useTonClient();
    const {jettonWalletAddress} = useMasterWallet();
    const [walletData, setWalletData] = useState<JettonWalletData>();

    const jettonWalletContract = useAsyncInitialize(async () => {
        if (!client || !jettonWalletAddress) return;

        const contract = new InfluenceJettonWallet(
            jettonWalletAddress,
        );
        
        const res = client.open(contract) as OpenedContract<InfluenceJettonWallet>;
        return res;

        
    }, [client, jettonWalletAddress]);

    useEffect(() => {
        async function getWalletData() {
            if(!jettonWalletContract) return;

            const res = await jettonWalletContract.getWalletData();
            
            setWalletData(res);
        }

        getWalletData();

    }, [jettonWalletContract]);


    return {
        data: walletData
    }
}