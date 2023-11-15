import { ItemData } from "../models/ItemData";
import { Grid } from "@mui/material";
import FundItemWrapper from "./FundItemWrapper";
import { Address } from "ton-core";

export interface IItemsProps {
  likedData: ItemData[];
  availableData: ItemData[];
  senderJettonWalletBalance: bigint;
  sendDonate: (
    destination: Address,
    amount: bigint
  ) => Promise<void> | undefined;
}

export default function Items({
  likedData,
  availableData,
  senderJettonWalletBalance,
  sendDonate,
}: IItemsProps) {
  return (
    <>
      <Grid
        container
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"start"}
      >
        <h2>Available</h2>
        <Grid
          container
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"start"}
          gap={"10px"}
        >
          {availableData.map((x, i) => (
            <FundItemWrapper
              key={i}
              senderJettonWalletBalance={senderJettonWalletBalance}
              destinationAddress={x.destinationAddress}
              description={x.description}
              amountToHelp={x.amountToHelp}
              title={x.title}
              balance={x.balance}
              liked={x.liked}
              sendDonate={sendDonate}
            />
          ))}
        </Grid>
      </Grid>

      <Grid
        container
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"start"}
        mt={"2vh"}
      >
        <h2>Liked</h2>
        <Grid
          container
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"start"}
          gap={"10px"}
        >
          {likedData.map((x, i) => (
            <FundItemWrapper
              key={i}
              senderJettonWalletBalance={senderJettonWalletBalance}
              destinationAddress={x.destinationAddress}
              description={x.description}
              amountToHelp={x.amountToHelp}
              title={x.title}
              balance={x.balance}
              liked={x.liked}
              sendDonate={sendDonate}
            />
          ))}
        </Grid>
      </Grid>
    </>
  );
}
