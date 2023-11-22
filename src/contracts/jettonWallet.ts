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

    const balance = stack.readBigNumber();

    const owner = stack.readAddress();
    const master = stack.readAddress();
    const walletCode = stack.readCell().asSlice().loadRef();
    // const title = stack.readString();
    // const isDonater = stack.readBoolean();
    // const seqno = stack.readBigNumber();
    // const description = stack.readString();
    // const amountToHelp = stack.readBigNumber();
    // //TODO: remove this from contract. currentAmount == jetton balance of wallet
    // const currentAmount = stack.readBigNumber();
    // const deployTime = stack.readBigNumber();
    // const imageUrl = stack.readString();

    return {
      balance,
      owner,
      master,
      walletCode,
      // title,
      // isDonater,
      // seqno,
      // description,
      // amountToHelp,
      // currentAmount,
      // deployTime,
      // imageUrl,
    };
  }

  async sendDonate(
    provider: ContractProvider,
    sender: Sender,
    destination: Address,
    amount: bigint,
    itemSeqno: bigint
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
      .storeBit(true)
      .storeRef(beginCell().storeInt(itemSeqno, 257).endCell())
      .endCell();

    await provider.internal(sender, {
      value: toNano("0.1"),
      body: body,
    });
  }

  constructor(readonly address: Address) {}
}
