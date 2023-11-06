import { fromNano } from "ton-core";
import useJettonWallet from "../hooks/useJettonWallet";
import { Card, FlexBoxCol, FlexBoxRow } from "./styled/styled";
import { useEffect, useState } from "react";
import JettonWalletData from "../models/JettonWalletData";
import { truncateAddress } from "../utils/utils";

export default function JettonsWallet() {
    const { data } = useJettonWallet();
    
    return(
        <Card>
            <FlexBoxCol>
                <h3>INF Wallet info</h3>
            </FlexBoxCol>
            <FlexBoxCol>
                <FlexBoxRow>
                    <h3>Balance:</h3> {data ? fromNano(data?.balance) : 0}
                </FlexBoxRow>
                <FlexBoxRow>
                    <h3>Wallet owner:</h3> {data ? truncateAddress(data.owner.toString()) : ""}
                </FlexBoxRow>
                <FlexBoxRow>
                    <h3>Token master contract:</h3> {data ? truncateAddress(data.master.toString()) : ""}
                </FlexBoxRow>
            </FlexBoxCol>
        </Card>
    )
}