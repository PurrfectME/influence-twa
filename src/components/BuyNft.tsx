import { useState } from "react";
import { useTonConnect } from "../hooks/useTonConnect";
import { Card, FlexBoxCol, FlexBoxRow, Button, Input } from "./styled/styled";
import { useTonWallet } from "@tonconnect/ui-react";

interface INftProps {
  buyNft: (amount: string) => Promise<void> | undefined;
}

export function BuyNft({ buyNft }: INftProps) {
  const { connected } = useTonConnect();
  const wallet = useTonWallet();

  const [tonAmount, setTonAmount] = useState("0.01");

  return (
    <Card>
      <FlexBoxCol>
        <h3>Buy NFT</h3>
        <FlexBoxRow>
          <label>Amount </label>
          <Input
            disabled={!connected}
            style={{ marginRight: 8 }}
            type="digits"
            value={tonAmount}
            onChange={(e) => setTonAmount(e.target.value)}
          ></Input>
        </FlexBoxRow>
        <Button
          disabled={!connected}
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
