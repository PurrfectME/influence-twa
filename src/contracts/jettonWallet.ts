import {
  Address,
  Builder,
  Contract,
  ContractProvider,
  Sender,
  beginCell,
  toNano,
} from "ton-core";
import JettonWalletData from "../models/JettonWalletData";

export default class InfluenceJettonWallet implements Contract {
  async getWalletData(provider: ContractProvider): Promise<JettonWalletData> {
    const { stack } = await provider.get("get_wallet_data", []);
    console.log("HERE");

    const balance = stack.readBigNumber();
    const owner = stack.readAddress();
    const master = stack.readAddress();
    const walletCode = stack.readCell().asSlice().loadRef();

    return { balance, owner, master, walletCode };
  }

  async sendDonate(
    provider: ContractProvider,
    sender: Sender,
    //ADDRESS of jetton wallet of fund item
    destination: Address,
    amount: bigint
  ) {
    const body = beginCell()
      //TOKEN TRANSFER MESSAGE
      .storeUint(260734629, 32)
      .storeUint(1, 64)
      .storeCoins(amount)
      .storeAddress(destination)
      .storeAddress(sender.address)
      .storeBit(false)
      .storeCoins(0)
      .storeBuilder(beginCell().storeInt(1, 32))
      .endCell();

    await provider.internal(sender, {
      value: toNano("0.3"),
      body: body,
    });
  }

  constructor(readonly address: Address) {}
}
