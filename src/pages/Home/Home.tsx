import "../../App.css";
import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import { useTonConnect } from "../../hooks/useTonConnect";
import "@twa-dev/sdk";
import { Address, fromNano } from "ton-core";
import {
  Card,
  CircularProgress,
  Grid,
  Pagination,
  Snackbar,
  SvgIcon,
  createSvgIcon,
} from "@mui/material";
import { useFundContract } from "../../hooks/useFundContract";
import { useEffect, useState } from "react";
import { useTonClient } from "../../hooks/useTonClient";
import Items from "../../components/Items";
import useNftCollection from "../../hooks/useNftCollection";
import { BuyNft } from "../../components/BuyNft";
import { useItems } from "../../hooks/useItems";
import useNftItem from "../../hooks/useNftItem";
import { useTonApiClient } from "../../hooks/useTonApi";

const TonSymbol = (
  <svg
    width="56"
    height="56"
    viewBox="0 0 56 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z"
      fill="#0098EA"
    />
    <path
      d="M37.5603 15.6277H18.4386C14.9228 15.6277 12.6944 19.4202 14.4632 22.4861L26.2644 42.9409C27.0345 44.2765 28.9644 44.2765 29.7345 42.9409L41.5381 22.4861C43.3045 19.4251 41.0761 15.6277 37.5627 15.6277H37.5603ZM26.2548 36.8068L23.6847 31.8327L17.4833 20.7414C17.0742 20.0315 17.5795 19.1218 18.4362 19.1218H26.2524V36.8092L26.2548 36.8068ZM38.5108 20.739L32.3118 31.8351L29.7417 36.8068V19.1194H37.5579C38.4146 19.1194 38.9199 20.0291 38.5108 20.739Z"
      fill="white"
    />
  </svg>
);

export default function Home() {
  //TODO: перенести папку wrappers из tact проекта
  const { connected } = useTonConnect();
  const wallet = useTonWallet();
  const { nftsIndex, likedIds } = useNftItem();
  const { client } = useTonClient();

  const [tonBalance, setTonBalance] = useState<bigint>();
  const { buyNft } = useNftCollection();

  const [page, setPage] = useState(1);
  const handleChange = (_: React.ChangeEvent<unknown>, value: number) =>
    setPage(value);

  const { liked, available, pageAmount, loading, setLoading } = useItems(
    likedIds,
    page
  );
  const [showInsufficientAmount, setShowInsufficientAmount] = useState(false);

  useEffect(() => {
    async function getBalances() {
      const address = Address.parse(wallet!.account.address);
      const tonBalance = await client!.getBalance(address);

      setTonBalance(tonBalance);
    }

    if (client && wallet) {
      getBalances();
    }
  }, [client, wallet]);

  const nanoToFixed = (number: bigint) => {
    const num = fromNano(number);
    const splitted = num.split(".");
    if (splitted.length == 1) {
      return num;
    }
    let res = `${splitted[0]}.${splitted[1].slice(0, 2)}`;
    return res;
  };

  return (
    <Grid container flexDirection={"column"}>
      {/* TODO: open connect modal manually
            TODO: https://github.com/ton-connect/sdk/tree/main/packages/ui#call-connect */}
      <>
        <Grid container display={"flex"} flexDirection={"row"} mb={"10px"}>
          <TonConnectButton />
          {/* <button id="ton-connect-ultra"></button> */}

          {connected ? (
            <Grid item ml={"20px"}>
              <Card
                sx={{
                  display: "flex",
                  paddingLeft: "20px",
                  paddingRight: "20px",
                  height: "36px",
                }}
                elevation={3}
              >
                <Grid
                  container
                  display={"flex"}
                  flexDirection={"row"}
                  alignItems={"center"}
                >
                  <Grid item mr={"5px"}>
                    <h2>{tonBalance ? nanoToFixed(tonBalance) : 0}</h2>
                  </Grid>
                  <SvgIcon
                    component={createSvgIcon(TonSymbol, "ASD")}
                    inheritViewBox
                  />
                </Grid>
              </Card>
            </Grid>
          ) : (
            <Grid item>
              <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                open={!connected}
                // onClose={handleClose}
                message="Connect wallet to donate"
                // key={vertical + horizontal}
              />
            </Grid>
          )}
        </Grid>

        <Grid item mt={"20px"}>
          <BuyNft
            setShowInsufficientAmount={setShowInsufficientAmount}
            buyNft={buyNft}
          />
        </Grid>

        <Grid container display={"flex"} justifyContent={"center"} mt={"2vh"}>
          {!loading ? (
            <>
              <Items
                nftsIndex={nftsIndex}
                setLoading={setLoading}
                fetchItems={() => new Promise((r) => r)}
                likedData={liked}
                availableData={available}
              />

              <Pagination
                siblingCount={2}
                count={pageAmount}
                page={page}
                onChange={handleChange}
              />
            </>
          ) : (
            <Grid
              container
              display={"flex"}
              justifyContent={"center"}
              mt={"10vh"}
            >
              <CircularProgress />
            </Grid>
          )}
        </Grid>
      </>
      <Grid item>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={showInsufficientAmount}
          // onClose={handleClose}
          message="Minimum amount for NFT is 0.07 TON"
          // key={vertical + horizontal}
        />
      </Grid>
    </Grid>
  );
}

export interface IMyProps {
  mintTokens: (amount: bigint, receiver: Address) => Promise<void> | undefined;
}
