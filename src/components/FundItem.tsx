import { Address, fromNano, toNano } from "ton-core";
import { useFundItemContract } from "../hooks/useFundItemContract";
import { FlexBoxCol, FundItemBox, ImageBox, Spacer } from "./styled/styled";
import ProgressBar from "@ramonak/react-progress-bar";
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Modal,
  Slide,
  Typography,
} from "@mui/material";
import { useState } from "react";
import useJettonWallet from "../hooks/useJettonWallet";
import { useMasterWallet } from "../hooks/useMasterWallet";
import { useTonConnect } from "../hooks/useTonConnect";
import React from "react";
import { TransitionProps } from "@mui/material/transitions";
import { ConnectedWallet, useTonConnectUI } from "@tonconnect/ui-react";
import { ConnectWalletDialog } from "./ConnectWalletDialog";

export function FundItem({ address }: any) {
  const { data } = useFundItemContract(address);
  const { sender, connected } = useTonConnect();
  const { data: itemJettonWallet } = useJettonWallet(address);
  const { data: userJettonWallet } = useJettonWallet(sender.address);

  const { sendDonate } = useJettonWallet(sender.address!);
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
                  <h3>{data?.title}</h3>
                  <div>{data?.description}</div>
                </div>
              </Grid>
            </Grid>
            <Grid container>
              <Grid container direction="row" justifyContent={"space-between"}>
                <Grid item>
                  <Typography style={{ fontSize: "10px" }}>
                    Собрано:{" "}
                    {itemJettonWallet
                      ? `${fromNano(itemJettonWallet?.balance)} INF`
                      : ""}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography style={{ fontSize: "10px" }}>
                    Нужно: {data ? `${fromNano(data?.amountToHelp)} INF` : ""}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container justifyContent={"center"} mt={"10px"}>
          <Grid item>
            <Button
              style={{ backgroundColor: "var(--tg-theme-button-color)" }}
              size="small"
              variant="contained"
              onClick={() => {
                if (!connected) {
                  //show modal
                  handleOpen("To donate you have to connect your ton wallet!");
                  return;
                }

                console.log("BALANCE", userJettonWallet?.balance);

                if (userJettonWallet?.balance == BigInt(0)) {
                  handleOpen("You don't have any INF tokens. Buy some");
                  return;
                }

                sendDonate(address as Address, toNano("0.5"));
              }}
            >
              <Typography style={{ fontSize: "10px" }}>Donate!</Typography>
            </Button>
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

export interface IDialogProps {
  dialogMessage: String;
  open: boolean;
  handleClose: () => void;
  connectWallet: () => Promise<ConnectedWallet> | undefined;
}
