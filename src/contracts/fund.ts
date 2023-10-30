import { Address, Contract, ContractProvider } from "ton-core";

export default class Fund implements Contract {
    async getFundItems(provider: ContractProvider, fundAddress: Address) {
        const {stack} = await provider.get("ownerFund", []);

        return stack.readAddress().toString();
    }

    async getFundData(provider: ContractProvider){
        const {stack} = await provider.get("fund_data", []);

        console.log('LOG', stack);
        

        return stack.readAddress();
    }

    constructor(
        readonly address: Address,
    ){
    }
}