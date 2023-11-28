import {
  Address,
  Cell,
  Contract,
  ContractProvider,
  Dictionary,
  Sender,
  beginCell,
  toNano,
} from "ton-core";
import { Buffer } from "buffer";
import { sha256_sync } from "ton-crypto";
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
      .storeRef(buildOnchainMetadata(metadata))
      .endCell();

    await provider.internal(sender, {
      value: toNano(amount),
      body,
    });
  }

  constructor(readonly address: Address) {}
}

const OFCHAIN_CONTENT_PREFIX = 0x01;
const SNAKE_PREFIX = 0x00;
const CELL_MAX_SIZE_BYTES = Math.floor((1023 - 8) / 8);

function bufferToChunks(buff: Buffer, chunkSize: number) {
  let chunks: Buffer[] = [];
  while (buff.byteLength > 0) {
    chunks.push(buff.slice(0, chunkSize));
    buff = buff.slice(chunkSize);
  }
  return chunks;
}

function makeSnakeCell(data: Buffer) {
  let chunks = bufferToChunks(data, 127);
  const b = chunks.reduceRight((curCell, chunk, index) => {
    if (index === 0) {
      curCell.storeInt(SNAKE_PREFIX, 8);
    }
    curCell.storeBuffer(chunk);
    if (index > 0) {
      const cell = curCell.endCell();
      return beginCell().storeRef(cell);
    } else {
      return curCell;
    }
  }, beginCell());
  return b.endCell();
}

const toKey = (key: string) => {
  return BigInt(`0x${sha256_sync(key).toString("hex")}`);
};

function buildOnchainMetadata(data: {
  name: string;
  description: string;
  image: string;
  content_url: string;
}): Cell {
  let dict = Dictionary.empty(
    Dictionary.Keys.BigUint(256),
    Dictionary.Values.Cell()
  );
  Object.entries(data).forEach(([key, value]) => {
    dict.set(toKey(key), makeSnakeCell(Buffer.from(value, "utf8")));
  });

  return beginCell()
    .storeInt(OFCHAIN_CONTENT_PREFIX, 8)
    .storeDict(dict)
    .endCell();
}
