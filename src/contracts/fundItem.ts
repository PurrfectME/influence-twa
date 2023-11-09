import {
  Address,
  Contract,
  ContractProvider,
  Sender,
  beginCell,
  fromNano,
  toNano,
} from "ton-core";
import FundItemData from "../models/FundItemData";

export default class FundItemContract implements Contract {
  async getItemData(provider: ContractProvider): Promise<FundItemData> {
    const { stack } = await provider.get("data", []);

    const owner = stack.readAddress();
    const description = stack.readString();
    const amountToHelp = stack.readBigNumber();
    const currentAmount = stack.readBigNumber();
    const title = stack.readString();
    const deployTime = stack.readBigNumber();
    const imageUrl = stack.readString();
    const seqno = stack.readBigNumber();
    const balance = stack.readBigNumber();

    return {
      owner,
      description,
      amountToHelp,
      currentAmount,
      title,
      deployTime,
      imageUrl,
      seqno,
      balance,
    };
  }

  constructor(readonly address: Address) {}
}
