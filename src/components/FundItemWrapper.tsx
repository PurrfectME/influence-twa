import { Grid, Typography, Button, Box, Chip } from "@mui/material";
import { fromNano, Address, toNano } from "ton-core";
import {
  Circle,
  FundItemBox,
  ImageBox,
  Rectangle,
  RectangleContainer,
} from "./styled/styled";
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
  nftsIndex: number[];
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

    if (nftsIndex.length != 0) {
      let likedByUser = false;

      for (let i = 0; i < nftsIndex.length; i++) {
        sendLike(toNano(itemSeqno), nftsIndex[i])?.then((x) => {
          if (!likedByUser) {
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
      //TODO: show dialog to user of NO EXISITNG NFTs
    }
  };

  const readMoreClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();

    handleItemDialogOpen();
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
                <Grid item height={"21vh"}>
                  <Typography
                    variant="subtitle1"
                    lineHeight={1}
                    fontSize={"0.87em"}
                    mt={"0.5em"}
                    color={"black"}
                  >
                    {description.length < 270
                      ? description
                      : description.substring(0, 270)}
                    {description.length > 270 ? (
                      <Chip
                        sx={{ height: "11px" }}
                        size="small"
                        label="Show more"
                        onClick={(e) => readMoreClick(e)}
                      />
                    ) : (
                      // <Button
                      //   sx={{ minWidth: "0px", padding: "0px", ml: "5px" }}
                      //   centerRipple
                      //   onClick={(e) => readMoreClick(e)}
                      // >
                      //   <RectangleContainer>
                      //     <Rectangle>
                      //       <Circle />
                      //       <Circle />
                      //       <Circle />
                      //     </Rectangle>
                      //   </RectangleContainer>
                      // </Button>
                      <></>
                    )}
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
              <Typography fontWeight={"bold"} fontSize={"10px"} color={"black"}>
                Collected: {fromNano(currentAmount)} TON
              </Typography>
            </Grid>
            <Grid item>
              <Typography fontWeight={"bold"} fontSize={"10px"} color={"black"}>
                Needed: {fromNano(amountToHelp)} TON
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
