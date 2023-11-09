import { Address } from "ton-core";

export default class FundItemData {
  owner: Address;
  description: String;
  amountToHelp: bigint;
  currentAmount: bigint;
  title: String;
  deployTime: bigint;
  imageUrl: String;
  seqno: bigint;

  constructor(
    owner: Address,
    description: String,
    amountToHelp: bigint,
    currentAmount: bigint,
    title: String,
    deployTime: bigint,
    imageUrl: String,
    seqno: bigint
  ) {
    this.owner = owner;
    this.description = description;
    this.amountToHelp = amountToHelp;
    this.currentAmount = currentAmount;
    this.title = title;
    this.deployTime = deployTime;
    this.imageUrl = imageUrl;
    this.seqno = seqno;
  }
}
