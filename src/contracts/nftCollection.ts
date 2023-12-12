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
    //я на фронте проверяю лайкнул ли чел завяку

    //case 1 (1 NFT)
    //TODO: определить есть ли у чела нфт, у которой deployTime <= 30 days
    //TODO: смотрим контракты и определяем, что с айди нфт нет никаких лайков на айди именно этого айди айтема
    //TODO: далее отправляем минимальное количество TON на контракт коллекции message LikeItem и помечаем, что этот айтем лайкнут(инкремент количества лайков на 1 и запрещаем лайкать текущего кошельку)

    //case 2 (many NFTs)
    //TODO: определить есть ли у чела нфт, у которой deployTime <= 30 days для каждой выполнить case 1
    //TODO: количество лайков +1 независимо от количества его НФТ

    //TODO: API для пагинации
    //TODO: API для получения рейтов (TON + ITEM_CURRENCY)

    //TOHA
    //TODO: API для рейтов, API для пагинации, CRUD для айтемов
    //TODO: взять из БД все заявки и отправить на фронт через пагинацию
    //TODO: при этом в таблице Likes нужно посчитать кол-во лайков по itemId(айди заявки) и walletAddress. если лайки на один и тот же айтем с разных нфт то считаем это как один лайк
    //TODO: каждую минуту мы проверяем контракт коллекции на новые транзы, если новая транза LikeItem найдена, то
    //TODO: 1. проверяем что wallet ни разу не лайкал этот айтем и nft index тоже не лайкал
    //TODO: 2. если это 1 раз, то проверяем есть ли у него нфт и валидна ли она deployTime <= 30 days
    //TODO: 3. добавляем к айтему tonAmount = tonAmount + ((кол-во TON в коллекции - 1%) / кол-во адрессов, которые могут лайкать / кол-во активных заявок)
    //TODO: 4. добавить в таблицу лайков itemId и wallet address и nft index
    //TODO: 5. если транза на покупку НФТ, то добавляем в таблицу NFT(id, deployDate)

    //TODO: в 12 ночи ищем все заявки, которые закрылись => Достаём все азявки из базы, у которых (tonAmount * курс TONUSDT) > amountToHelp
    //TODO: если заявка заполнена, то помечаем, что она закрыта. Закрытые заявки отображаем в конце в пагинации
    //TODO: пересылаем ton на кошелёк в заявке(в заявке будет ton wallet но на фронт отправлять не будем) с сообщением айди заявки, количество тон
    //TODO: если у нас осталось больше 15к ТОН, 10001 отправляем на адрес валидатора(адрес валидатора, кол-ва тона, кол-во тона на стейкинг в конфиге установить)

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
