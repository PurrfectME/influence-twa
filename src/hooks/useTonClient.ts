import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient } from "ton";
import { useAsyncInitialize } from "./useAsyncInitialize";

export function useTonClient() {
  //TODO: add balances here
  return {
    client: useAsyncInitialize(async () => {
      return new TonClient({
        apiKey:
          "858fcb84f2c0a8f30a0f59f0b204436197069c2b7f9a5c0e0eadb9a687b62ef9",
        endpoint: await getHttpEndpoint({
          network: "testnet",
        }),
      });
    }, []),
  };
}

// // Get user's wallet address from TON wallet browser extension
// const address = (await ton.send('ton_requestAccounts'))[0]

// // Get user's last transaction hash using tonweb
// const lastTx = (await tonweb.getTransactions(address, 1))[0]
// const lastTxHash = lastTx.transaction_id.hash

// // Send your transaction
// await ton.send('ton_sendTransaction', [{
//         to: 'some address',
//         value: '1000'
//     }]
// )

// // Run a loop until user's last tx hash changes
// var txHash = lastTxHash
// while (txHash == lastTxHash) {
//     await sleep(1500) // some delay between API calls
//     let tx = (await tonweb.getTransactions(address, 1))[0]
//     txHash = tx.transaction_id.hash
// }

// console.log('Done!')
