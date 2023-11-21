import { Address } from "ton-core";

export default class FundData {
  name: String;
  description: String;
  fundBalance: bigint;
  image: String;
  owner: Address;
  seqno: bigint;
  fundItemSeqno: bigint;

  constructor(
    name: String,
    description: String,
    fundBalance: bigint,
    image: String,
    owner: Address,
    seqno: bigint,
    fundItemSeqno: bigint
  ) {
    this.name = name;
    this.description = description;
    this.fundBalance = fundBalance;
    this.image = image;
    this.owner = owner;
    this.seqno = seqno;
    this.fundItemSeqno = fundItemSeqno;
  }
}
