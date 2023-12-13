import { ItemData } from "../models/ItemData";
import { Grid } from "@mui/material";
import FundItemWrapper from "./FundItemWrapper";
import { Dispatch, SetStateAction } from "react";

export interface IItemsProps {
  likedData: ItemData[];
  availableData: ItemData[];
  nftsIndex: number[];
  fetchItems: () => Promise<void>;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export default function Items({
  likedData,
  availableData,
  nftsIndex,
  fetchItems,
  setLoading,
}: IItemsProps) {
  return (
    <>
      <Grid
        container
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"start"}
      >
        <h2>
          {availableData.length != 0
            ? "Available"
            : "No Available Applications"}
        </h2>
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
              nftsIndex={nftsIndex}
              description={x.description}
              amountToHelp={x.amountToHelp}
              title={x.title}
              currentAmount={x.currentAmount}
              liked={false}
              itemSeqno={x.seqno}
              fetchItems={fetchItems}
              setLoading={setLoading}
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
        <h2>{likedData.length != 0 ? "Liked" : "No Liked Applications"}</h2>
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
              nftsIndex={undefined}
              description={x.description}
              amountToHelp={x.amountToHelp}
              title={x.title}
              currentAmount={x.currentAmount}
              liked={true}
              itemSeqno={x.seqno}
              fetchItems={fetchItems}
              setLoading={setLoading}
            />
          ))}
        </Grid>
      </Grid>
    </>
  );
}
