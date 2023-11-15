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
  Avatar,
  Box,
  Card,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useFundContract } from "../../hooks/useFundContract";
import { useEffect, useState } from "react";
import { FundItem } from "../../components/FundItem";
import { useTonClient } from "../../hooks/useTonClient";
import useJettonWallet from "../../hooks/useJettonWallet";
import ItemsContainer from "../../components/ItemsContainer";

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
    <Grid container flexDirection={"column"}>
      {/* TODO: open connect modal manually
            TODO: https://github.com/ton-connect/sdk/tree/main/packages/ui#call-connect */}
      <>
        <Grid container display={"flex"} flexDirection={"row"}>
          <TonConnectButton />

          {connected ? (
            <Paper
              sx={{ paddingLeft: "20px", paddingRight: "20px" }}
              elevation={3}
            >
              <Grid
                container
                display={"flex"}
                flexDirection={"row"}
                alignItems={"center"}
              >
                <Grid item mr={"20px"}>
                  <h2>{tonBalance ? `${fromNano(tonBalance)} TON` : 0}</h2>
                </Grid>
                <Grid item>
                  <Grid container alignItems={"center"}>
                    <Grid item>
                      <h2>
                        {jettonWallet ? fromNano(jettonWallet.balance) : 0} INF
                      </h2>
                    </Grid>
                    <Grid>
                      <Avatar
                        sx={{ width: 30, height: 30 }}
                        src={jettonData ? `${jettonData.image}` : ""}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          ) : (
            <div>Connect wallet to see actual balances</div>
          )}
        </Grid>
        <FlexBoxRow>
          <Button onClick={createFund}>Создать фонд</Button>
          <Button onClick={() => navigate("/influence-twa/requests")}>
            Заявки
          </Button>
        </FlexBoxRow>
        <TransferTon mintTokens={mintTokens} />
        {/* <JettonsWallet owner={sender.address} /> */}
        {/* <Fund /> */}
        {dict ? (
          <Grid
            spacing={"3px"}
            container
            justifyContent={"start"}
            wrap="wrap"
            mt={"20px"}
          >
            {/* <ItemsContainer addresses={dict} /> */}
            {dict.map((x, i) => (
              <Grid key={i} item>
                <FundItem address={x} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <></>
        )}
      </>
    </Grid>
  );
}

export interface IMyProps {
  mintTokens: (amount: bigint, receiver: Address) => Promise<void> | undefined;
}
