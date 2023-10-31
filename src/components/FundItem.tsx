import { Address } from "ton-core";
import { useFundItemContract } from "../hooks/useFundItemContract";
import { Card, FlexBoxCol, FlexBoxRow } from "./styled/styled";
import { useAsyncInitialize } from "../hooks/useAsyncInitialize";

export function FundItem({address}: any){

    const {getItemData} = useFundItemContract(address);

    const data = useAsyncInitialize(async () => {
        const res = await getItemData();

        return res;
    });

    return (
        <Card>
            <FlexBoxCol>
                <FlexBoxRow>
                    ITEM ADDRESS: {data?.owner.toString()}
                </FlexBoxRow>
                <FlexBoxRow>
                    ITEM NUMBER: {data?.seqno.toString()}
                </FlexBoxRow>
            </FlexBoxCol>
        </Card>
    )
}