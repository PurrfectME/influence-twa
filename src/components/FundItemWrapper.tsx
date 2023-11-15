import { Grid, Typography, CircularProgress, Button } from "@mui/material";
import { fromNano, Address } from "ton-core";
import { FundItemBox, ImageBox } from "./styled/styled";
import { ItemData } from "../models/ItemData";
import { useTonConnect } from "../hooks/useTonConnect";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useState } from "react";

export interface IItemWrapperProps {
  title: String;
  description: String;
  balance: bigint;
  liked: boolean;
  destinationAddress: Address;
  amountToHelp: bigint;
  senderJettonWalletBalance: bigint;
  sendDonate: (
    destination: Address,
    amount: bigint
  ) => Promise<void> | undefined;
}

export default function FundItemWrapper({
  title,
  description,
  balance: currentAmount,
  liked,
  destinationAddress,
  amountToHelp,
  senderJettonWalletBalance,
  sendDonate,
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
    <FundItemBox>
      <Grid container onClick={() => {}}>
        <ImageBox />

        <Grid container padding={"0.6rem"}>
          <Grid container>
            <Grid item mb={"0.9rem"}>
              <div>
                <h3>{title}</h3>
                <div>{description}</div>
              </div>
            </Grid>
          </Grid>
          <Grid container>
            <Grid container direction="column" justifyContent={"space-between"}>
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
          {connected ? (
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
                  handleOpen("To donate you have to connect your ton wallet!");
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
                  senderJettonWalletBalance / BigInt(10)
                );
              }}
            >
              <Typography color="white" fontSize="10px">
                {liked ? "U helped!" : "Like"}
              </Typography>
            </Button>
          ) : (
            <CircularProgress />
          )}
        </Grid>
      </Grid>
    </FundItemBox>
  );
}
