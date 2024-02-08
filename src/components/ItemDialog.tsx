import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Slide,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";
import img from "../images/img.jpeg";
import { fromNano } from "ton-core";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IItemDialogProps {
  appTitle: String;
  title: String;
  description: String;
  currentAmount: bigint;
  amountToHelp: bigint;
  liked: boolean;
  open: boolean;
  handleClose: () => void;
}

export function ItemDialog({
  appTitle,
  open,
  handleClose,
  title,
  description,
  currentAmount,
  amountToHelp,
  liked,
}: IItemDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullScreen={fullScreen}
      >
        <DialogTitle>
          <Grid
            container
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography>{appTitle}</Typography>
            <Button onClick={handleClose}>Close</Button>
          </Grid>
        </DialogTitle>
        <Grid
          container
          flexDirection={"column"}
          justifyContent={"space-between"}
          // width={"13.125em"}
          height={"27.8em"}
        >
          <Grid container>
            {/* <ImageBox /> */}
            <Box
              sx={{
                backgroundImage: `url(${img})`,
                backgroundRepeat: "no-repeat",
                height: "180px",
                width: "inherit",
                backgroundSize: "cover",
              }}
            />

            <Grid container padding={"0 0.6rem 0.6rem"}>
              <Grid container>
                <Grid item mb={"0.9rem"}>
                  <Typography variant="h6" component="h6" lineHeight={1}>
                    {title}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    lineHeight={1}
                    fontSize={"0.87em"}
                    mt={"0.5em"}
                  >
                    {description}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            container
            flexDirection={"column"}
            alignItems={"center"}
            marginBottom={"0.938em"}
          >
            <Grid
              container
              direction="column"
              justifyContent={"space-between"}
              padding={"0.6rem"}
            >
              <Grid item>
                <Typography style={{ fontSize: "10px" }}>
                  Собрано: {fromNano(currentAmount)} TON
                </Typography>
              </Grid>
              <Grid item>
                <Typography style={{ fontSize: "10px" }}>
                  Нужно: {fromNano(amountToHelp)} TON
                </Typography>
              </Grid>
            </Grid>

            <Grid
              item
              sx={{
                "& span": {
                  width: "20px !important",
                  height: "20px !important",
                },
              }}
            >
              <Button
                disabled={liked}
                style={{
                  backgroundColor: liked
                    ? "green"
                    : "var(--tg-theme-button-color)",
                }}
                size={"small"}
                variant="contained"
                // onClick={(e) => donate(e)}
              >
                <Typography color="white" fontSize="10px">
                  {liked ? "U helped!" : "Like"}
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/* <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          
        </DialogActions> */}
      </Dialog>
    </>
  );
}
