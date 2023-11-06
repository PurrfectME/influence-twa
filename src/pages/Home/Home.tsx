import "../../App.css";
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import { TransferTon } from "../../components/TransferTon";
import styled from "styled-components";
import { Button, FlexBoxCol, FlexBoxRow, ItemsRow } from "../../components/styled/styled";
import { useTonConnect } from "../../hooks/useTonConnect";
import { CHAIN } from "@tonconnect/protocol";
import "@twa-dev/sdk";
import { Address, Dictionary } from "ton-core";
import { useMasterWallet } from "../../hooks/useMasterWallet";
import { useNavigate } from "react-router-dom";
import JettonsWallet from "../../components/JettonsWallet";
import Fund from "../../components/Fund";


//TODO: add manifestUrl 

const AppContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

export default function Home() {
  //TODO: перенести папку wrappers из tact проекта
  const { network } = useTonConnect();
  const navigate = useNavigate();
  const {createFund, mintTokens} = useMasterWallet();


  return (
      
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
            <Button onClick={() => navigate('/influence-twa/requests')}>Заявки</Button>
            {/* <Button onClick={() => getLastFundAddress()?.then(x => console.log(x.toString())
            ) }>Адрес фонда</Button>
            <Button onClick={() => getFundData()?.then(x => console.log(x))}>Данные фонда</Button>
            <Button onClick={() => {getLastItemAddress()?.then(x => console.log(x.toString())
            )}}>Адрес зявки фонда</Button> */}
            {/* <Button onClick={createItem}>Создать заявку</Button> */}
          </FlexBoxRow>
          <TransferTon mintTokens={mintTokens} />
          <JettonsWallet />
          <Fund />
        </FlexBoxCol>

  );
}

export interface IMyProps {
  mintTokens: (amount: bigint, receiver: Address) => Promise<void> | undefined
}