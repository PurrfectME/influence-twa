import { Grid, Typography, Button, Box } from "@mui/material";
import { fromNano, Address, toNano } from "ton-core";
import { FundItemBox, ImageBox } from "./styled/styled";
import { ItemData } from "../models/ItemData";
import { useTonConnect } from "../hooks/useTonConnect";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { Dispatch, SetStateAction, useState } from "react";
import { ConnectWalletDialog } from "./ConnectWalletDialog";
import useNftCollection from "../hooks/useNftCollection";
import img from "../images/img.jpeg";
import { ItemDialog } from "./ItemDialog";

export interface IItemWrapperProps {
  title: String;
  description: String;
  liked: boolean;
  currentAmount: bigint;
  amountToHelp: bigint;
  itemSeqno: number;
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
  amountToHelp,
  fetchItems,
  setLoading,
}: IItemWrapperProps) {
  const { connected } = useTonConnect();
  const [tonConnectUI] = useTonConnectUI();
  const { sendLike } = useNftCollection();

  const [dialogMessage, setDialogMessage] = useState<String>("");
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);

  const handleWalletDialogOpen = (message: String) => {
    setDialogMessage(message);
    setWalletDialogOpen(true);
  };
  const handleWalletDialogClose = () => setWalletDialogOpen(false);

  const handleItemDialogOpen = () => {
    setItemDialogOpen(true);
  };
  const handleItemDialogClose = () => setItemDialogOpen(false);

  const donate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();

    if (!connected) {
      //show modal
      handleWalletDialogOpen("To donate you have to connect your ton wallet!");
      return;
    }

    //check for nft and show modal box if user doesnt own any
    console.log("INDEXS", nftsIndex);

    if (nftsIndex?.length) {
      let likedByUser = false;
      console.log("HERE");

      for (let i = 0; i < nftsIndex.length; i++) {
        // console.log("HERE");

        sendLike(toNano(itemSeqno), nftsIndex[i])?.then((x) => {
          if (!likedByUser) {
            // console.log("HERE");

            const data: ItemData[] = JSON.parse(localStorage.getItem("items")!);

            for (let i = 0; i < data.length; i++) {
              const item = data[i];

              if (item.id !== itemSeqno) {
                continue;
              }

              item.likes = item.likes + 1;
            }
            likedByUser = true;
            localStorage.setItem("items", JSON.stringify(data));
          }
        });
      }
    } else {
      console.log("EMPTY");
    }
  };

  return (
    <>
      <Grid
        container
        flexDirection={"column"}
        justifyContent={"space-between"}
        border={"1px solid black"}
        borderRadius={"25px"}
        style={{ backgroundColor: "white" }}
        // width={"13.125em"}
        height={"31em"}
        onClick={(e) => {
          setItemDialogOpen(true);
        }}
      >
        <Grid container>
          {/* <ImageBox /> */}
          <Box
            sx={{
              backgroundImage: `url(${img})`,
              backgroundRepeat: "no-repeat",
              height: "180px",
              width: "inherit",
              borderTopLeftRadius: "25px",
              borderTopRightRadius: "25px",
              backgroundSize: "cover",
            }}
          />

          <Grid container padding={"0.6rem 0.6rem 0 0.6rem"}>
            <Grid container>
              <Grid item mb={"0.9rem"}>
                <Typography
                  color={"black"}
                  variant="h6"
                  component="h6"
                  lineHeight={1}
                >
                  {title}
                </Typography>
                <Grid item overflow={"overlay"} height={"21vh"}>
                  <Typography
                    variant="subtitle1"
                    lineHeight={1}
                    fontSize={"0.87em"}
                    mt={"0.5em"}
                    color={"black"}
                  >
                    {description}
                  </Typography>
                </Grid>
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
              <Typography fontSize={"10px"} color={"black"}>
                Собрано: {fromNano(currentAmount)} TON
              </Typography>
            </Grid>
            <Grid item>
              <Typography fontSize={"10px"} color={"black"}>
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
                onClick={(e) => donate(e)}
              >
                <Typography color="white" fontSize="10px">
                  {liked ? "U helped!" : "Like"}
                </Typography>
              </Button>
            }
          </Grid>
        </Grid>
      </Grid>

      <ConnectWalletDialog
        open={walletDialogOpen}
        dialogMessage={dialogMessage}
        handleClose={handleWalletDialogClose}
        connectWallet={() => tonConnectUI.connectWallet()}
      />

      <ItemDialog
        open={itemDialogOpen}
        appTitle={`Application №${itemSeqno}`}
        title={title}
        description={description}
        currentAmount={currentAmount}
        amountToHelp={amountToHelp}
        liked={liked}
        donate={donate}
        handleClose={handleItemDialogClose}
      />
    </>
  );
}
