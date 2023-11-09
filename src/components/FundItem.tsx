import { Address, fromNano, toNano } from "ton-core";
import { useFundItemContract } from "../hooks/useFundItemContract";
import { FlexBoxCol, FundItemBox, ImageBox, Spacer } from "./styled/styled";
import ProgressBar from "@ramonak/react-progress-bar";
import { Box, Button, Container, Grid, Modal, Typography } from "@mui/material";
import { useState } from "react";
import useJettonWallet from "../hooks/useJettonWallet";
import { useMasterWallet } from "../hooks/useMasterWallet";
import { useTonConnect } from "../hooks/useTonConnect";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export function FundItem({ address }: any) {
  const { data } = useFundItemContract(address);
  const { sender } = useTonConnect();
  // console.log(address.toString());

  const { data: walletData } = useJettonWallet(address);

  console.log("sender", sender.address?.toString());

  const { sendDonate } = useJettonWallet(sender.address!);

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

        <Grid container justifyContent={"center"} mt={"30px"}>
          <Grid item>
            <Button
              style={{ backgroundColor: "var(--tg-theme-button-color)" }}
              size="small"
              variant="contained"
              onClick={() => sendDonate(address as Address, toNano("0.5"))}
            >
              <Typography style={{ fontSize: "10px" }}>Donate!</Typography>
            </Button>
          </Grid>
        </Grid>
      </FundItemBox>

      {/* TODO: move to file */}
      <Modal
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </>
  );
}
