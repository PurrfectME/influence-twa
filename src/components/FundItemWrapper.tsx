import {
  Grid,
  Typography,
  CircularProgress,
  Button,
  SvgIcon,
  createSvgIcon,
} from "@mui/material";
import { fromNano, Address, toNano } from "ton-core";
import { FundItemBox, ImageBox } from "./styled/styled";
import { ItemData } from "../models/ItemData";
import { useTonConnect } from "../hooks/useTonConnect";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { Dispatch, SetStateAction, useState } from "react";
import { ConnectWalletDialog } from "./ConnectWalletDialog";
import useNftCollection from "../hooks/useNftCollection";
import { TonSymbol } from "../pages/Home/Home";

export interface IItemWrapperProps {
  title: String;
  description: String;
  liked: boolean;
  currentAmount: bigint;
  amountToHelp: bigint;
  itemSeqno: number;
  nftsIndex: number[] | undefined;
  fetchItems: () => Promise<void>;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export default function FundItemWrapper({
  title,
  description,
  currentAmount,
  itemSeqno,
  liked,
  nftsIndex,
  amountToHelp,
  fetchItems,
  setLoading,
}: IItemWrapperProps) {
  const { connected } = useTonConnect();
  const [tonConnectUI] = useTonConnectUI();
  const [dialogMessage, setDialogMessage] = useState<String>();
  const [open, setOpen] = useState(false);
  const { sendLike } = useNftCollection();
  const handleOpen = (message: String) => {
    setDialogMessage(message);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const donate = () => {
    if (!connected) {
      //show modal
      handleOpen("To donate you have to connect your ton wallet!");
      return;
    }

    //check for nft and show modal box if user doesnt own any
    console.log("INDEXS", nftsIndex);

    if (nftsIndex?.length) {
      let likedByUser = false;
      console.log("HERE");

      for (let i = 0; i < nftsIndex.length; i++) {
        // console.log("HERE");

        sendLike(toNano(itemSeqno), nftsIndex[i])?.then((x) => {
          if (!likedByUser) {
            // console.log("HERE");

            const data: ItemData[] = JSON.parse(localStorage.getItem("items")!);

            for (let i = 0; i < data.length; i++) {
              const item = data[i];

              if (item.id !== itemSeqno) {
                continue;
              }

              item.likes = item.likes + 1;
            }
            likedByUser = true;
            localStorage.setItem("items", JSON.stringify(data));
          }
        });
      }
    } else {
      console.log("EMPTY");
    }
  };

  return (
    <>
      <Grid
        container
        flexDirection={"column"}
        justifyContent={"space-between"}
        border={"1px solid black"}
        borderRadius={"25px"}
        style={{ backgroundColor: "white" }}
        width={"13.125em"}
        height={"365px"}
      >
        <Grid container onClick={() => {}}>
          <ImageBox />

          <Grid container padding={"0.6rem"}>
            <Grid container>
              <Grid item mb={"0.9rem"}>
                <Typography variant="h6" component="h6" lineHeight={1}>
                  {title}
                </Typography>
                <Typography
                  variant="subtitle1"
                  lineHeight={1}
                  fontSize={"0.87em"}
                  mt={"0.5em"}
                >
                  {description}
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid
                container
                direction="column"
                justifyContent={"space-between"}
              >
                <Grid item>
                  <Typography style={{ fontSize: "10px" }}>
                    Собрано: {fromNano(currentAmount)} TON
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography style={{ fontSize: "10px" }}>
                    Нужно: {fromNano(amountToHelp)} TON
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          container
          flexDirection={"column"}
          alignItems={"center"}
          marginBottom={"25px"}
        >
          <Grid
            item
            sx={{
              "& span": {
                width: "20px !important",
                height: "20px !important",
              },
            }}
          >
            {
              <Button
                disabled={liked}
                style={{
                  backgroundColor: liked
                    ? "green"
                    : "var(--tg-theme-button-color)",
                }}
                size={"small"}
                variant="contained"
                onClick={donate}
              >
                <Typography color="white" fontSize="10px">
                  {liked ? "U helped!" : "Like"}
                </Typography>
              </Button>
            }
          </Grid>
        </Grid>
      </Grid>

      <ConnectWalletDialog
        open={open}
        dialogMessage={"To donate you have to connect your ton wallet!"}
        handleClose={handleClose}
        connectWallet={() => tonConnectUI.connectWallet()}
      />
    </>
  );
}
