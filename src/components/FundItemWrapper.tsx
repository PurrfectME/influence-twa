import { Grid, Typography, CircularProgress, Button } from "@mui/material";
import { fromNano, Address } from "ton-core";
import { FundItemBox, ImageBox } from "./styled/styled";
import { ItemData } from "../models/ItemData";
import { useTonConnect } from "../hooks/useTonConnect";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { Dispatch, SetStateAction, useState } from "react";
import { ConnectWalletDialog } from "./ConnectWalletDialog";

export interface IItemWrapperProps {
  title: String;
  description: String;
  balance: bigint;
  liked: boolean;
  destinationAddress: Address;
  amountToHelp: bigint;
  senderJettonWalletBalance: bigint;
  itemSeqno: bigint,
  sendDonate: (
    destination: Address,
    amount: bigint,
    itemSeqno: bigint
  ) => Promise<void> | undefined;
  fetchItems: () => Promise<void>;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export default function FundItemWrapper({
  title,
  description,
  balance: currentAmount,
  liked,
  destinationAddress,
  senderJettonWalletBalance,
  itemSeqno,
  sendDonate,
  fetchItems,
  setLoading,
}: IItemWrapperProps) {
  const { connected } = useTonConnect();
  const [tonConnectUI] = useTonConnectUI();
  const [dialogMessage, setDialogMessage] = useState<String>();
  const [open, setOpen] = useState(false);
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
                  <h3>{title} {fromNano(itemSeqno)}</h3>
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

                  if (senderJettonWalletBalance == BigInt(0)) {
                    handleOpen("You don't have any INF tokens. Buy some");
                    return;
                  }

                  //TODO: if 10% is > than needed than calculate only needed amount
                  //TODO: if balance < MIN value then ask to send the remaining balance
                  //10% from total user's jetton balance
                  
                  sendDonate(
                    destinationAddress,
                    senderJettonWalletBalance / BigInt(10),
                    itemSeqno
                  )?.then((_) => {
                    setLoading(true);
                    console.log("FETCH");

                    fetchItems().then((_) => {
                      console.log("inside fetch");
                      setLoading(false);
                    });
                  });
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
