import { Address, Contract, ContractProvider, Sender, beginCell, contractAddress, fromNano, toNano } from "ton-core";

export default class MasterWallet implements Contract {
    async getJettonData(provider: ContractProvider) {
        const {stack} = await provider.get("bebe", []);
        
        return fromNano(stack.readBigNumber());
    }

    async sendMint(provider: ContractProvider, via: Sender, amount: number) {
        const body = beginCell()
            .storeUint(0, 32)
            .storeStringTail('buy')
            .endCell();
        await provider.internal(via, {
            value: toNano(amount),
            body: body
        }, );
    }

    async sendCreateFund(provider: ContractProvider, via: Sender){
        const body = beginCell()
        .storeUint(0, 32)
        .storeStringTail("fund")
        .endCell();

        await provider.internal(via, {
            value: toNano("0.5"),
            body: body
        }, );
    }

    async getLastFundAddress(provider: ContractProvider, sender: Address){
        const {stack} = await provider.get("lastFundAddress", [
            {type: "slice", cell: beginCell().storeAddress(sender).endCell()}
        ]);

        return stack.readAddress();
    }
    
    constructor(readonly address: Address){
    }
}