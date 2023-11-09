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

export default function Home() {
  //TODO: перенести папку wrappers из tact проекта
  const { network, sender } = useTonConnect();
  const navigate = useNavigate();
  const { createFund, mintTokens } = useMasterWallet();

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
      <Fund />
    </FlexBoxCol>
  );
}

export interface IMyProps {
  mintTokens: (amount: bigint, receiver: Address) => Promise<void> | undefined;
}
