import { Address, Contract, ContractProvider, Sender, beginCell, toNano } from "ton-core";
import FundData from "../models/FundData";

export default class FundContract implements Contract {
    async getFundItems(provider: ContractProvider) {
        const {stack} = await provider.get("ownerFund", []);

        return stack.readAddress().toString();
    }

    async getFundData(provider: ContractProvider) : Promise<FundData>{
        const { stack } = await provider.get("fund_data", []);

        const name = stack.readString();
        const description = stack.readCell().asSlice().loadStringTail();
        const jettonBalance = stack.readBigNumber();
        const fundBalance = stack.readBigNumber();
        const image = stack.readString();
        const owner = stack.readAddress();
        const seqno = stack.readBigNumber();
        const fundItemSeqno = stack.readBigNumber();

        return {name, description, jettonBalance, fundBalance, image, owner, seqno, fundItemSeqno};
    }

    async sendCreateItem(provider: ContractProvider, sender: Sender) {
        const body = beginCell()
        .storeUint(0, 32)
        .storeStringTail("item")
        .endCell();

        console.log('HERE');

        await provider.internal(sender, {
            value: toNano("0.2"),
            body: body
        });
    }

    async getLastItemAddress(provider: ContractProvider){
        const {stack} = await provider.get("lastItemAddress", []);

        return stack.readAddress();
    }

    constructor(
        readonly address: Address,

    ){
    }
}