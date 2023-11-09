import "../../App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { TransferTon } from "../../components/TransferTon";
import styled from "styled-components";
import { Button, FlexBoxCol, FlexBoxRow } from "../../components/styled/styled";
import { useTonConnect } from "../../hooks/useTonConnect";
import { CHAIN } from "@tonconnect/protocol";
import "@twa-dev/sdk";
import { Address } from "ton-core";
import { useMasterWallet } from "../../hooks/useMasterWallet";
import { useNavigate } from "react-router-dom";
import JettonsWallet from "../../components/JettonsWallet";
import Fund from "../../components/Fund";
import { Grid } from "@mui/material";
import { useFundContract } from "../../hooks/useFundContract";
import { useEffect, useState } from "react";
import { FundItem } from "../../components/FundItem";
import { useTonClient } from "../../hooks/useTonClient";

export default function Home() {
  //TODO: перенести папку wrappers из tact проекта
  const { network, sender } = useTonConnect();
  const { client } = useTonClient();
  const navigate = useNavigate();
  const { createFund, mintTokens } = useMasterWallet();
  const { addresses, createItem, data } = useFundContract();
  const [dict, setDict] = useState<Address[]>();

  useEffect(() => {
    // if (client) {
    //   console.log("DATA", client);
    // }
    if (addresses) {
      let arr: Address[] = [];

      for (let index = 1; index <= addresses.size; index++) {
        const address = addresses.get(BigInt(index));
        if (address) {
          arr.push(address);
        }
      }

      setDict(arr);
    }
  }, [addresses, client]);

  return (
    <FlexBoxCol>
      <FlexBoxRow>
        {/* TODO: open connect modal manually
            TODO: https://github.com/ton-connect/sdk/tree/main/packages/ui#call-connect */}
        <TonConnectButton />
        <Button>
          {network
            ? network === CHAIN.MAINNET
              ? "mainnet"
              : "testnet"
            : "N/A"}
        </Button>
      </FlexBoxRow>
      <FlexBoxRow>
        <Button onClick={createFund}>Создать фонд</Button>
        <Button onClick={() => navigate("/influence-twa/requests")}>
          Заявки
        </Button>
      </FlexBoxRow>
      <TransferTon mintTokens={mintTokens} />
      <JettonsWallet owner={sender.address} />
      {/* <Fund /> */}

      <Grid container justifyContent={"center"} mt={"20px"}>
        <Grid spacing={"3px"} container justifyContent={"center"} wrap="wrap">
          {dict?.map((x, i) => (
            <Grid key={i} item>
              <FundItem address={x} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </FlexBoxCol>
  );
}

export interface IMyProps {
  mintTokens: (amount: bigint, receiver: Address) => Promise<void> | undefined;
}
