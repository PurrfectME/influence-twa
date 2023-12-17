import { Grid, Typography, CircularProgress, Button } from "@mui/material";
import { fromNano, Address, toNano } from "ton-core";
import { FundItemBox, ImageBox } from "./styled/styled";
import { ItemData } from "../models/ItemData";
import { useTonConnect } from "../hooks/useTonConnect";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { Dispatch, SetStateAction, useState } from "react";
import { ConnectWalletDialog } from "./ConnectWalletDialog";
import useNftCollection from "../hooks/useNftCollection";

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

  return (
    <>
      <FundItemBox>
        <Grid container onClick={() => {}}>
          <ImageBox />

          <Grid container padding={"0.6rem"}>
            <Grid container>
              <Grid item mb={"0.9rem"}>
                <div>
                  <h3>
                    {title} {itemSeqno}
                  </h3>
                  <div>{description}</div>
                </div>
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
                    Собрано: {`${fromNano(currentAmount)} INF`}
                  </Typography>
                </Grid>
                {/* <Grid item>
                  <Typography style={{ fontSize: "10px" }}>
                    Нужно:{" "}
                    {data ? `${fromNano(data.amountToHelp)} INF` : "0 INF"}
                  </Typography>
                </Grid> */}
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container justifyContent={"center"} mt={"10px"}>
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
                onClick={() => {
                  if (!connected) {
                    //show modal
                    handleOpen(
                      "To donate you have to connect your ton wallet!"
                    );
                    return;
                  }

                  //TODO: проблема в том что юзеру придётся два раза подряд подтверждать транзу в кошельке
                  if (nftsIndex) {
                    let liked = false;
                    for (let i = 0; i < nftsIndex.length; i++) {
                      sendLike(toNano(itemSeqno), nftsIndex[i])?.then((x) => {
                        if (!liked) {
                          const data: ItemData[] = JSON.parse(
                            localStorage.getItem("items")!
                          );
                          let obj = data.find((x) => x.id == itemSeqno)!;
                          obj.likes = obj.likes + 1;
                          liked = true;
                        }
                      });
                    }
                  }
                }}
              >
                <Typography color="white" fontSize="10px">
                  {liked ? "U helped!" : "Like"}
                </Typography>
              </Button>
            }
          </Grid>
        </Grid>
      </FundItemBox>

      <ConnectWalletDialog
        open={open}
        dialogMessage={"To donate you have to connect your ton wallet!"}
        handleClose={handleClose}
        connectWallet={() => tonConnectUI.connectWallet()}
      />
    </>
  );
}
