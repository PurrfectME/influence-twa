import { Address } from "ton-core";
import { useFundItemContract } from "../hooks/useFundItemContract";
import { Card, FlexBoxCol, FlexBoxRow, FundItemBox, ImageBox } from "./styled/styled";
import { useAsyncInitialize } from "../hooks/useAsyncInitialize";

export function FundItem({address}: any){

    const {data} = useFundItemContract(address);

    return (
        <FundItemBox>
            <FlexBoxCol>
                    <ImageBox />
                
            </FlexBoxCol>
            
            <FlexBoxCol>
                <FlexBoxRow>
                    {/* ITEM ADDRESS: {address.toString()} */}
                </FlexBoxRow>
                <FlexBoxRow>
                    {/* ITEM OWNER: {data?.owner.toString()} */}
                </FlexBoxRow>
                <FlexBoxRow>
                    ITEM NUMBER: {data?.seqno.toString()}
                </FlexBoxRow>
            </FlexBoxCol>
        </FundItemBox>
    )
}