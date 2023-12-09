import {
  Address,
  Contract,
  ContractProvider,
  Sender,
  beginCell,
  toNano,
} from "ton-core";
const metadata = {
  name: "E BUDDY",
  description: "LIGHTWEIGHT",
  image:
    "https://yt3.googleusercontent.com/YR8JivTsOQ4svnDFCdnIqYAPhwIeTRg8w0Sukv1orUYJoN2iZtaEprhWXcweMdrtcGGmptvSgQ=s176-c-k-c0x00ffffff-no-rj",
  //   attributes: [{ trait_type: "Awesomeness", value: "Super cool" }],
  content_url:
    "https://s.getgems.io/nft/b/c/62fba50217c3fe3cbaad9e7f/content/84f7f698b337de3bfd1bc4a8118cdfd8226bbadf",
};

function createOffchainContent(str: string) {
  return beginCell().storeUint(1, 8).storeStringTail(str).endCell();
}

export default class NftCollection implements Contract {
  async sendBuyNft(provider: ContractProvider, sender: Sender, amount: string) {
    const body = beginCell()
      .storeUint(608941821, 32)
      .storeCoins(toNano(amount))
      .storeAddress(sender.address)
      .storeRef(
        createOffchainContent(
          "https://raw.githubusercontent.com/PurrfectME/influence-twa/3470f7e75a0d19032b32efd39158db678aa56ae1/src/items/meta.json"
        )
      )
      .endCell();

    await provider.internal(sender, {
      value: toNano(amount),
      body,
    });
  }

  async sendLike(provider: ContractProvider, sender: Sender, itemId: bigint) {
    const body = beginCell()
      .storeUint(877159261, 32)
      .storeUint(itemId, 256)
      .endCell();

    await provider.internal(sender, {
      value: toNano("0.02"),
      body,
    });
  }

  constructor(readonly address: Address) {}
}
