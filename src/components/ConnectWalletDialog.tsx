import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { ConnectedWallet } from "@tonconnect/ui-react";
import React from "react";
import { IDialogProps } from "./FundItem";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function ConnectWalletDialog({
  dialogMessage,
  open,
  handleClose,
  connectWallet,
}: IDialogProps) {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
    >
      <DialogTitle>{dialogMessage}</DialogTitle>
      <DialogActions>
        <Button onClick={handleClose}>Later</Button>
        <Button
          onClick={() => {
            //IF NO INF TOKENS ON WALLET BUY SOME
            handleClose();

            connectWallet();
          }}
        >
          Connect
        </Button>
      </DialogActions>
    </Dialog>
  );
}
