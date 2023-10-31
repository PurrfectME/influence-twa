import "./App.css";
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import { Counter } from "./components/Counter";
import { Jetton } from "./components/Jetton";
import { TransferTon } from "./components/TransferTon";
import styled from "styled-components";
import { Button, FlexBoxCol, FlexBoxRow } from "./components/styled/styled";
import { useTonConnect } from "./hooks/useTonConnect";
import { CHAIN } from "@tonconnect/protocol";
import "@twa-dev/sdk";
import { Address } from "ton-core";
import { useMasterWallet } from "./hooks/useMasterWallet";
import { useFundContract } from "./hooks/useFundContract";
import { useFundItemContract } from "./hooks/useFundItemContract";
import { FundItem } from "./components/FundItem";


//TODO: add manifestUrl 

const StyledApp = styled.div`
  background-color: #e8e8e8;
  color: black;

  @media (prefers-color-scheme: dark) {
    background-color: #222;
    color: white;
  }
  min-height: 100vh;
  padding: 20px 20px;
`;

const AppContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

function App() {
  const { network } = useTonConnect();

  const {createFund, getLastFundAddress} = useMasterWallet();
  const {getFundData, createItem, getLastItemAddress} = useFundContract();
  


  return (
    <StyledApp>
      <AppContainer>
        <FlexBoxCol>
          <FlexBoxRow>
            <TonConnectButton />
            <Button>
              {network
                ? network === CHAIN.MAINNET
                  ? "mainnet"
                  : "testnet"
                : "N/A"}
            </Button>
            <Button onClick={createFund}>Создать фонд</Button>
            <Button onClick={() => getLastFundAddress()?.then(x => console.log(x.toString())
            ) }>Адрес фонда</Button>
            <Button onClick={() => getFundData()?.then(x => console.log(x))}>Данные фонда</Button>
            <Button onClick={() => {getLastItemAddress()?.then(x => console.log(x.toString())
            )}}>Адрес зявки фонда</Button>
            <Button onClick={createItem}>Создать заявку</Button>
          </FlexBoxRow>
          <TransferTon />
          <FundItem address={Address.parse("EQB46IPTKUE_pQEFUZQbWceJvsPKc9kaHz0V9wudGN6gzacN")} />
        </FlexBoxCol>
      </AppContainer>
    </StyledApp>
  );
}

export default App;
