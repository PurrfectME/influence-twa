import { Address, fromNano } from "ton-core";
import { useFundItemContract } from "../hooks/useFundItemContract";
import FundItemData from "../models/FundItemData";
import { useEffect, useState } from "react";
import useJettonWallet from "../hooks/useJettonWallet";
import { useTonConnect } from "../hooks/useTonConnect";
import { Grid } from "@mui/material";

export interface ItemsContainerProps {
  addresses: Address[];
}

export default function ItemsContainer({ addresses }: ItemsContainerProps) {
  const { sender, connected } = useTonConnect();
  //   const [likedItems, setLikedItems] = useState<FundItemData[]>();
  //   const [availableItems, setAvailableItems] = useState<FundItemData[]>();

  //   useEffect(() => {
  //     extractItems();
  //   }, [sender]);

  const extractItems = () => {
    let liked: FundItemData[] = [];
    let available: FundItemData[] = [];
    addresses.map((x) => {
      const { data } = useFundItemContract(x);
      const { data: itemJettonWallet, isLiked } = useJettonWallet(x, true);
      const { data: userJettonWallet, address: jettonSenderwalletAddress } =
        useJettonWallet(sender.address);

      if (
        jettonSenderwalletAddress &&
        isLiked(jettonSenderwalletAddress.toString())
      ) {
        liked.push(data!);
      } else {
        available.push(data!);
      }
    });

    // setLikedItems(liked);
    // setAvailableItems(available);
    console.log("available  ", available);

    return (
      <>
        <Grid
          container
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"start"}
        >
          {available.map((x) => (
            <Grid item>{fromNano(x.seqno)}</Grid>
          ))}
        </Grid>
        <Grid
          container
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"start"}
        >
          {liked.map((x) => (
            <Grid item>{fromNano(x.seqno)}</Grid>
          ))}
        </Grid>
      </>
    );
  };

  return <>{extractItems()}</>;
}
