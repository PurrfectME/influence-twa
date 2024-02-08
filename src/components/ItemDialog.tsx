import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IItemDialogProps {
  dialogMessage: String;
  open: boolean;
  handleClose: () => void;
}

export function ItemDialog({
  dialogMessage,
  open,
  handleClose,
}: IItemDialogProps) {
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
          }}
        >
          Connect
        </Button>
      </DialogActions>
    </Dialog>
  );
}
