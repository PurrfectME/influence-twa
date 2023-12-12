import { Dispatch, SetStateAction, useState } from "react";
import { useTonConnect } from "../hooks/useTonConnect";
import { Card, FlexBoxCol, FlexBoxRow, Button, Input } from "./styled/styled";
import { useTonWallet } from "@tonconnect/ui-react";

interface INftProps {
  buyNft: (amount: string) => Promise<void> | undefined;
  setShowInsufficientAmount: Dispatch<SetStateAction<boolean>>;
}

export function BuyNft({ buyNft, setShowInsufficientAmount }: INftProps) {
  const { connected } = useTonConnect();
  const wallet = useTonWallet();

  const [tonAmount, setTonAmount] = useState("0.07");

  return (
    <Card>
      <FlexBoxCol>
        <h3>Buy NFT</h3>
        <FlexBoxRow>
          <label>Amount </label>
          <Input
            pattern="/^0(?:.d{1,5})?$|^[1-9]d*(?:.d{1,5})?$/"
            disabled={!connected}
            style={{ marginRight: 8 }}
            type="number"
            min={0}
            value={tonAmount}
            onChange={(e) => {
              if (e.target.value < "0.07") {
                setShowInsufficientAmount(true);
              } else {
                setShowInsufficientAmount(false);
              }
              setTonAmount(e.target.value);
            }}
          ></Input>
        </FlexBoxRow>
        <Button
          disabled={!connected || tonAmount < "0.07"}
          style={{ marginTop: 18 }}
          onClick={() => {
            if (wallet) {
              buyNft(tonAmount);
            }
          }}
        >
          Buy
        </Button>
      </FlexBoxCol>
    </Card>
  );
}
