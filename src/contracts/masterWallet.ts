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

    //manual tokens mint
    //TODO: generate QR code to send via tonkeeper
    async sendMintTokens(provider: ContractProvider, amount: bigint, receiver: Address, sender: Sender){
        console.log('ASD', sender.address?.toString());
        
        const body = beginCell()
            .storeUint(4235234258, 32)
            .storeInt(amount, 257)
            .storeAddress(receiver)
            .endCell();

        await provider.internal(sender, {
            value: amount,
            body: body
        });
    }
    
    constructor(readonly address: Address){
    }
}