import {
  Address,
  Contract,
  ContractProvider,
  Dictionary,
  Sender,
  beginCell,
  toNano,
} from "ton-core";
import FundData from "../models/FundData";

export default class FundContract implements Contract {
  async getFundData(provider: ContractProvider): Promise<FundData> {
    const { stack } = await provider.get("fund_data", []);

    const name = stack.readString();
    const description = stack.readString();
    const fundBalance = stack.readBigNumber();
    const image = stack.readString();
    const owner = stack.readAddress();
    const seqno = stack.readBigNumber();
    const fundItemSeqno = stack.readBigNumber();

    return {
      name,
      description,
      fundBalance,
      image,
      owner,
      seqno,
      fundItemSeqno,
    };
  }

  async sendCreateItem(provider: ContractProvider, sender: Sender) {
    const body = beginCell().storeUint(0, 32).storeStringTail("item").endCell();

    await provider.internal(sender, {
      value: toNano("0.2"),
      body: body,
    });
  }

  async getAllItemsAddresses(
    provider: ContractProvider
  ): Promise<Dictionary<bigint, Address> | undefined> {
    const { stack } = await provider.get("getAllItemsAddresses", []);

    //TODO: catch error or fuck it. TOnCLient cant process emptyMap from tact
    if (stack.remaining == 0) {
      return Dictionary.empty();
    }

    const res = stack
      .readCell()
      .asSlice()
      .loadDictDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.Address());

    return res;
  }

  async getItemAddress(provider: ContractProvider, itemSeqno: bigint) {
    const { stack } = await provider.get("getItemAddress", [
      { type: 'int', value: itemSeqno },
    ]);

    return stack.readAddress();
  }

  constructor(readonly address: Address) {}
}
