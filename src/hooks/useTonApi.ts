import { HttpClient, Api } from "tonapi-sdk-js";
import { useAsyncInitialize } from "./useAsyncInitialize";

const HOST = "https://testnet.tonapi.io";

export function useTonApiClient() {
  // Configure the HTTP client with your host and token
  const httpClient = new HttpClient({
    baseUrl: HOST,
    baseApiParams: {
      headers: {
        Authorization: `Bearer ${"AFZG2LSEBUA6E3YAAAAOUVHUCLOF43VSRA4WHIXXNJE23IEYHMNFLI5BY73XTO4JWFOVHAA"}`,
        "Content-type": "application/json",
      },
    },
  });

  const client = new Api(httpClient);

  //   const nfts = useAsyncInitialize(async () => {
  //     if (!accountId) return;
  //     return await client.accounts.getAccountNftItems(accountId);
  //   }, [accountId]);

  return { client };
}
