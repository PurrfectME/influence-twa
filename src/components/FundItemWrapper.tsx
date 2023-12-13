import { Grid, Typography, CircularProgress, Button } from "@mui/material";
import { fromNano, Address } from "ton-core";
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
  itemSeqno: bigint;
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
                    {title} {fromNano(itemSeqno)}
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
                  sendLike(itemSeqno, nftsIndex![0]);
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
