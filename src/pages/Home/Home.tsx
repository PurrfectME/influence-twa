import "../../App.css";
import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import { TransferTon } from "../../components/TransferTon";
import styled from "styled-components";
import { Button, FlexBoxCol, FlexBoxRow } from "../../components/styled/styled";
import { useTonConnect } from "../../hooks/useTonConnect";
import { CHAIN } from "@tonconnect/protocol";
import "@twa-dev/sdk";
import { Address, fromNano } from "ton-core";
import { useMasterWallet } from "../../hooks/useMasterWallet";
import { useNavigate } from "react-router-dom";
import JettonsWallet from "../../components/JettonsWallet";
import Fund from "../../components/Fund";
import {
  Box,
  Card,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useFundContract } from "../../hooks/useFundContract";
import { useEffect, useState } from "react";
import { FundItem } from "../../components/FundItem";
import { useTonClient } from "../../hooks/useTonClient";
import useJettonWallet from "../../hooks/useJettonWallet";

export default function Home() {
  //TODO: перенести папку wrappers из tact проекта
  const { network, sender, connected } = useTonConnect();
  const wallet = useTonWallet();
  const { client } = useTonClient();
  const navigate = useNavigate();
  const { createFund, mintTokens, jettonData } = useMasterWallet();
  const { addresses } = useFundContract();

  const [dict, setDict] = useState<Address[]>();
  const [tonBalance, setTonBalance] = useState<bigint>();

  const { data: jettonWallet } = useJettonWallet(sender.address);

  useEffect(() => {
    if (addresses) {
      let arr: Address[] = [];

      //index starts from 1 because seqno of contract start from 1;
      for (let index = 1; index <= addresses.size; index++) {
        const address = addresses.get(BigInt(index));
        if (address) {
          arr.push(address);
        }
      }

      setDict(arr);
    }

    async function getBalances() {
      const address = Address.parse(wallet!.account.address);
      const tonBalance = await client!.getBalance(address);

      setTonBalance(tonBalance);
    }

    if (client && wallet) {
      getBalances();
    }
  }, [addresses]);

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
        {connected ? (
          <>
            <Grid
              container
              display={"flex"}
              justifyContent={"center"}
              flexDirection={"row"}
            >
              <Grid container display={"flex"} flexDirection={"row"}>
                <Grid item>
                  {tonBalance ? `${fromNano(tonBalance)} TON` : 0}
                </Grid>
              </Grid>
              <Grid container display={"flex"} flexDirection={"row"}>
                <Grid item>
                  {jettonWallet ? fromNano(jettonWallet.balance) : 0} INF
                </Grid>
                <Grid width={"30px"} height={"30px"} item borderRadius={"10px"}>
                  <img
                    width={"30px"}
                    height={"30px"}
                    src={jettonData ? `${jettonData.image}` : ""}
                  />
                </Grid>
              </Grid>
            </Grid>
          </>
        ) : (
          <div>not connected</div>
        )}
      </FlexBoxRow>
      <FlexBoxRow>
        <Button onClick={createFund}>Создать фонд</Button>
        <Button onClick={() => navigate("/influence-twa/requests")}>
          Заявки
        </Button>
      </FlexBoxRow>
      <TransferTon mintTokens={mintTokens} />
      {/* <JettonsWallet owner={sender.address} /> */}
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
