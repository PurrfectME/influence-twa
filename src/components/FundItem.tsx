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
import { useTonConnectUI } from "@tonconnect/ui-react";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function FundItem({ address }: any) {
  const { data } = useFundItemContract(address);
  const { sender, connected } = useTonConnect();
  const { data: walletData } = useJettonWallet(address);
  const { sendDonate } = useJettonWallet(sender.address!);
  const [tonConnectUI] = useTonConnectUI();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <FundItemBox>
        <Grid container onClick={handleOpen}>
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
                    {walletData ? `${fromNano(walletData?.balance)} INF` : ""}
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
                  handleOpen();
                }

                sendDonate(address as Address, toNano("0.5"));
              }}
            >
              <Typography style={{ fontSize: "10px" }}>Donate!</Typography>
            </Button>
          </Grid>
        </Grid>
      </FundItemBox>

      {/* TODO: move to file */}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          {"To donate you have to connect your ton wallet!"}
        </DialogTitle>
        {/* <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Connect your ton wallet
          </DialogContentText>
        </DialogContent> */}
        <DialogActions>
          <Button onClick={handleClose}>Later</Button>
          <Button
            onClick={() => {
              //IF NO INF TOKENS ON WALLET BUY SOME
              handleClose();

              tonConnectUI.connectWallet();
            }}
          >
            Connect
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
