import { Address, fromNano, toNano } from "ton-core";
import { useFundItemContract } from "../hooks/useFundItemContract";
import { FundItemBox, ImageBox } from "./styled/styled";
import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import { useState } from "react";
import useJettonWallet from "../hooks/useJettonWallet";
import { useTonConnect } from "../hooks/useTonConnect";
import { ConnectedWallet, useTonConnectUI } from "@tonconnect/ui-react";
import { ConnectWalletDialog } from "./ConnectWalletDialog";

export function FundItem({ address }: any) {
  const { sender, connected } = useTonConnect();
  const {
    data: userJettonWallet,
    sendDonate,
    address: jettonSenderwalletAddress,
  } = useJettonWallet(sender.address);

  const { data: itemJettonWallet, address: itemJettonAddress } =
    useJettonWallet(address);

  const { data, liked } = useFundItemContract(
    address,
    jettonSenderwalletAddress,
    itemJettonAddress
  );

  const [tonConnectUI] = useTonConnectUI();
  const [dialogMessage, setDialogMessage] = useState<String>();

  const [open, setOpen] = useState(false);
  const handleOpen = (message: String) => {
    setDialogMessage(message);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  console.log("LIKED", liked);

  return (
    <>
      {/* <Grid container>
        <h2>Available</h2>
        {itemJettonWallet && (liked === undefined || !liked) ? (
          fromNano(itemJettonWallet.balance)
        ) : (
          <></>
        )}
      </Grid>

      <Grid container>
        <h2>Liked</h2>
        {itemJettonWallet && (liked !== undefined || liked) ? (
          fromNano(itemJettonWallet.balance)
        ) : (
          <></>
        )}
      </Grid> */}

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
              <Grid
                container
                direction="column"
                justifyContent={"space-between"}
              >
                <Grid item>
                  <Typography style={{ fontSize: "10px" }}>
                    Собрано:{" "}
                    {itemJettonWallet
                      ? `${fromNano(itemJettonWallet.balance)} INF`
                      : "0 INF"}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography style={{ fontSize: "10px" }}>
                    Нужно:{" "}
                    {data ? `${fromNano(data.amountToHelp)} INF` : "0 INF"}
                  </Typography>
                </Grid>
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
              liked !== undefined && data ? (
                <Button
                  disabled={liked && data ? true : false}
                  style={{
                    backgroundColor:
                      liked && data ? "green" : "var(--tg-theme-button-color)",
                  }}
                  size="small"
                  variant="contained"
                  onClick={() => {
                    if (!connected) {
                      //show modal
                      handleOpen(
                        "To donate you have to connect your ton wallet!"
                      );
                      return;
                    }

                    if (userJettonWallet?.balance == BigInt(0)) {
                      handleOpen("You don't have any INF tokens. Buy some");
                      return;
                    }

                    //TODO: if 10% is > than needed than calculate only needed amount
                    //10% from total user's jetton balance
                    sendDonate(
                      address as Address,
                      userJettonWallet!.balance / BigInt(10)
                    );
                  }}
                >
                  <Typography color="white" fontSize="10px">
                    {liked ? "U helped!" : "Like"}
                  </Typography>
                </Button>
              ) : (
                <CircularProgress />
              )
            ) : (
              <Button
                style={{
                  backgroundColor: "var(--tg-theme-button-color)",
                }}
                size="small"
                variant="contained"
                onClick={() => {
                  if (!connected) {
                    //show modal
                    handleOpen(
                      "To donate you have to connect your ton wallet!"
                    );
                    return;
                  }

                  if (userJettonWallet?.balance == BigInt(0)) {
                    handleOpen("You don't have any INF tokens. Buy some");
                    return;
                  }

                  //TODO: if 10% is > than needed than calculate only needed amount
                  //10% from total user's jetton balance
                  sendDonate(
                    address as Address,
                    userJettonWallet!.balance / BigInt(10)
                  );
                }}
              >
                <Typography color="white" fontSize="10px">
                  Like
                </Typography>
              </Button>
            )}
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
