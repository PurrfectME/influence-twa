import { Address } from "ton-core";

export class ItemData {
  destinationAddress: Address;
  description: String;
  amountToHelp: bigint;
  currentAmount: bigint;
  title: String;
  deployTime: bigint;
  imageUrl: String;
  seqno: bigint;
  balance: bigint;
  liked: boolean;

  constructor(
    destinationAddress: Address,
    description: String,
    amountToHelp: bigint,
    currentAmount: bigint,
    title: String,
    deployTime: bigint,
    imageUrl: String,
    seqno: bigint,
    balance: bigint,
    liked: boolean
  ) {
    this.destinationAddress = destinationAddress;
    this.description = description;
    this.amountToHelp = amountToHelp;
    this.currentAmount = currentAmount;
    this.title = title;
    this.deployTime = deployTime;
    this.imageUrl = imageUrl;
    this.seqno = seqno;
    this.balance = balance;
    this.liked = liked;
  }
}
