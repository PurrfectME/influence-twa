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
import { Avatar, CircularProgress, Grid, Paper } from "@mui/material";
import { useFundContract } from "../../hooks/useFundContract";
import { useEffect, useState } from "react";
import { useTonClient } from "../../hooks/useTonClient";
import useJettonWallet from "../../hooks/useJettonWallet";
import Items from "../../components/Items";

export default function Home() {
  //TODO: перенести папку wrappers из tact проекта
  const { sender, connected } = useTonConnect();
  const wallet = useTonWallet();
  const { client } = useTonClient();
  const navigate = useNavigate();
  const { createFund, mintTokens, jettonData } = useMasterWallet();
  const { likedData, availableData, addresses } = useFundContract();
  const [tonBalance, setTonBalance] = useState<bigint>();

  const { data: jettonWallet, sendDonate } = useJettonWallet(sender.address);

  useEffect(() => {
    async function getBalances() {
      const address = Address.parse(wallet!.account.address);
      const tonBalance = await client!.getBalance(address);

      setTonBalance(tonBalance);
    }

    if (client && wallet) {
      getBalances();
    }
  }, [client, wallet]);

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
        <Grid container display={"flex"} justifyContent={"center"} mt={"2vh"}>
          {addresses && likedData && availableData && jettonWallet ? (
            <Items
              sendDonate={sendDonate}
              senderJettonWalletBalance={jettonWallet.balance}
              likedData={likedData ? likedData : []}
              availableData={availableData ? availableData : []}
            />
          ) : (
            <Grid
              container
              display={"flex"}
              justifyContent={"center"}
              mt={"10vh"}
            >
              <CircularProgress />
            </Grid>
          )}
        </Grid>
      </>
    </Grid>
  );
}

export interface IMyProps {
  mintTokens: (amount: bigint, receiver: Address) => Promise<void> | undefined;
}
