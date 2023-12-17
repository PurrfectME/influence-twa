export class ItemData {
  description: String;
  amountToHelp: bigint;
  tonAmount: bigint;
  title: String;
  imageUrl: String;
  id: number;
  likes: number;
  currency: String;

  constructor(
    description: String,
    amountToHelp: bigint,
    tonAmount: bigint,
    title: String,
    imageUrl: String,
    seqno: number,
    likes: number,
    currency: String
  ) {
    this.description = description;
    this.amountToHelp = amountToHelp;
    this.tonAmount = tonAmount;
    this.title = title;
    this.imageUrl = imageUrl;
    this.id = seqno;
    this.likes = likes;
    this.currency = currency;
  }
}
