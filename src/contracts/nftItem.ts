import { Address, Contract, ContractProvider } from "ton-core";

export default class NftItem implements Contract {
  async getDeployTime(provider: ContractProvider): Promise<bigint> {
    const { stack } = await provider.get("deployTime", []);

    const deployTime = stack.readBigNumber();

    return deployTime;
  }

  constructor(readonly address: Address) {}
}
