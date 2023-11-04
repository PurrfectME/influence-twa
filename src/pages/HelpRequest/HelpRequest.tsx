import { useState, useEffect } from "react";
import { Address } from "ton-core";
import { Card, FlexBoxCol, FlexBoxRow, ItemsRow } from "../../components/styled/styled";
import { useFundContract } from "../../hooks/useFundContract";
import { FundItem } from "../../components/FundItem";

export default function HelpRequest(){
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
        <Card>
            <FlexBoxCol>
             <ItemsRow>
          {dict?.map(x => <FundItem address={x} />)}
        </ItemsRow>
        </FlexBoxCol>

        </Card>
    )
}