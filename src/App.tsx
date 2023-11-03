import "./App.css";
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import { TransferTon } from "./components/TransferTon";
import styled from "styled-components";
import { Button, FlexBoxCol, FlexBoxRow, ItemsRow } from "./components/styled/styled";
import { useTonConnect } from "./hooks/useTonConnect";
import { CHAIN } from "@tonconnect/protocol";
import "@twa-dev/sdk";
import { Address, Dictionary } from "ton-core";
import { useMasterWallet } from "./hooks/useMasterWallet";
import { useFundContract } from "./hooks/useFundContract";
import { useFundItemContract } from "./hooks/useFundItemContract";
import { FundItem } from "./components/FundItem";
import { useAsyncInitialize } from "./hooks/useAsyncInitialize";
import { useEffect, useState } from "react";
import "@twa-dev/sdk";


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
  //TODO: перенести папку wrappers из tact проекта
  const { network } = useTonConnect();

  const {createFund, mintTokens} = useMasterWallet();
  const {addresses, createItem} = useFundContract();

  const [dict, setDict] = useState<Address[]>();

  useEffect(() => {
    if(addresses){
      let arr: Address[] = [];

      for (let index = 1; index <= addresses.size; index++) {
        const address = addresses.get(BigInt(index));
        if(address){
          arr.push(address);
        }
      }

      setDict(arr);

    }
  }, [addresses]);

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
            {/* <Button onClick={() => getLastFundAddress()?.then(x => console.log(x.toString())
            ) }>Адрес фонда</Button>
            <Button onClick={() => getFundData()?.then(x => console.log(x))}>Данные фонда</Button>
            <Button onClick={() => {getLastItemAddress()?.then(x => console.log(x.toString())
            )}}>Адрес зявки фонда</Button> */}
            <Button onClick={createItem}>Создать заявку</Button>
          </FlexBoxRow>
          <TransferTon mintTokens={mintTokens} />
        </FlexBoxCol>
        <FlexBoxCol>
        <ItemsRow>
          {dict?.map(x => <FundItem address={x} />)}
        </ItemsRow>
        </FlexBoxCol>
      </AppContainer>
    </StyledApp>
  );
}

export interface IMyProps {
  mintTokens: (amount: bigint, receiver: Address) => Promise<void> | undefined
}

export default App;
