import { Address, Contract, ContractProvider } from "ton-core";
import JettonWalletData from "../models/JettonWalletData";

export default class InfluenceJettonWallet implements Contract {
    
    async getWalletData(provider: ContractProvider): Promise<JettonWalletData>{
        const {stack} = await provider.get("get_wallet_data", []);

        const balance = stack.readBigNumber();
        const owner = stack.readAddress();
        const master = stack.readAddress();
        const walletCode = stack.readCell().asSlice().loadRef();

        console.log('GAG', balance);


        return {balance, owner, master, walletCode};
    }


    constructor(readonly address: Address){}
}