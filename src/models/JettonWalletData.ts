import { Address, Cell } from "ton-core";

export default class JettonWalletData {
  balance: bigint;
  owner: Address;
  master: Address;
  walletCode: Cell;
  // title: String;
  // isDonater: boolean;
  // seqno: bigint;
  // description: String;
  // amountToHelp: bigint;
  // currentAmount: bigint;
  // deployTime: bigint;
  // imageUrl: String;

  constructor(
    balance: bigint,
    owner: Address,
    master: Address,
    walletCode: Cell
    // title: String,
    // isDonater: boolean,
    // seqno: bigint,
    // description: String,
    // amountToHelp: bigint,
    // currentAmount: bigint,
    // deployTime: bigint,
    // imageUrl: String
  ) {
    this.balance = balance;
    this.owner = owner;
    this.master = master;
    this.walletCode = walletCode;
    // this.title = title;
    // this.isDonater = isDonater;
    // this.seqno = seqno;
    // this.description = description;
    // this.amountToHelp = amountToHelp;
    // this.currentAmount = currentAmount;
    // this.deployTime = deployTime;
    // this.imageUrl = imageUrl;
  }
}
