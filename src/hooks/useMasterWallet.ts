import { Address, OpenedContract } from "ton-core";
import MasterWallet from "../contracts/masterWallet";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";

export function useMasterWallet(){
    const { wallet, sender } = useTonConnect();
    const { client } = useTonClient();
    const addr = "EQASijGTuK5jVWsYsTCyxFQa3Iz2JyNwIwA9BUYdPiGBKTUh";

    const masterContract = useAsyncInitialize(async () => {
        if (!client || !wallet) return;
        const contract = new MasterWallet(
            Address.parse(addr),
        );
        return client.open(contract) as OpenedContract<MasterWallet>;
    }, [client, wallet]);


    return {
        data: () => masterContract?.getJettonData(),
        sendMint: () => masterContract?.sendMint(sender, 0.3),
        createFund: () => masterContract?.sendCreateFund(sender),
        balance: masterContract?.address,
        getLastFundAddress: () => masterContract?.getLastFundAddress(sender.address!)
    }
}