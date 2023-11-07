import { useState, useEffect } from "react";
import { Address } from "ton-core";
import {
  Button,
  Card,
  FlexBoxCol,
  FlexBoxRow,
  ItemsRow,
} from "../../components/styled/styled";
import { useFundContract } from "../../hooks/useFundContract";
import { FundItem } from "../../components/FundItem";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";

export default function HelpRequest() {
  const navigate = useNavigate();
  const { addresses, createItem } = useFundContract();

  const [dict, setDict] = useState<Address[]>();

  useEffect(() => {
    if (addresses) {
      let arr: Address[] = [];

      for (let index = 1; index <= addresses.size; index++) {
        const address = addresses.get(BigInt(index));
        if (address) {
          arr.push(address);
        }
      }

      setDict(arr);
    }
  }, [addresses]);

  return (
    <>
      <Button onClick={() => navigate(-1)}>Назад</Button>
      <Button onClick={createItem}>Создать заявку</Button>

      <Grid container justifyContent={"center"} mt={"20px"}>
        <Grid spacing={"3px"} container justifyContent={"center"} wrap="wrap">
          {dict?.map((x) => (
            <Grid item>
              <FundItem address={x} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
}
