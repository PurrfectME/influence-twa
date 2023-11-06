import { useState, useEffect } from "react";
import { Address } from "ton-core";
import { Button, Card, FlexBoxCol, FlexBoxRow, ItemsRow } from "../../components/styled/styled";
import { useFundContract } from "../../hooks/useFundContract";
import { FundItem } from "../../components/FundItem";
import { useNavigate } from "react-router-dom";

export default function HelpRequest(){
  const navigate = useNavigate();
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


  return(
    <>
    <Button onClick={() => navigate('/influence-twa')}>Назад</Button>
      <Card>
          <FlexBoxCol>
            <ItemsRow>
        {dict?.map(x => <FundItem address={x} />)}
      </ItemsRow>
      </FlexBoxCol>

      </Card>
    </>
  )
}