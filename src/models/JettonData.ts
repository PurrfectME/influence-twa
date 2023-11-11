import { Address, Cell } from "ton-core";

export default class JettonData {
  totalSupply: bigint;
  mintable: boolean;
  owner: Address;
  content: Cell;
  walletCode: Cell;

  constructor(
    totalSupply: bigint,
    mintable: boolean,
    owner: Address,
    content: Cell,
    walletCode: Cell
  ) {
    this.totalSupply = totalSupply;
    this.mintable = mintable;
    this.owner = owner;
    this.content = content;
    this.walletCode = walletCode;
  }
}
