import { ItemData } from "../models/ItemData";
import { Grid, Tab, Tabs } from "@mui/material";
import FundItemWrapper from "./FundItemWrapper";
import { Dispatch, SetStateAction, useState } from "react";

export interface IItemsProps {
  likedData: ItemData[];
  availableData: ItemData[];
  nftsIndex: number[];
  fetchItems: () => Promise<void>;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

export default function Items({
  likedData,
  availableData,
  nftsIndex,
  fetchItems,
  setLoading,
}: IItemsProps) {
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <>
      <Grid container flexDirection={"column"} justifyContent={"start"}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Available" />
          <Tab label="Liked" />
        </Tabs>
        <CustomTabPanel value={value} index={0}>
          <Grid mt={"15px"} container justifyContent={"center"} gap={"10px"}>
            {availableData.map((x, i) => (
              <Grid
                key={i}
                item
                xs={12}
                sm={3}
                md={3}
                lg={3}
                minWidth={"281px"}
              >
                <FundItemWrapper
                  nftsIndex={nftsIndex}
                  description={x.description}
                  amountToHelp={x.amountToHelp}
                  title={x.title}
                  currentAmount={x.tonAmount}
                  liked={false}
                  itemSeqno={x.id}
                  fetchItems={fetchItems}
                  setLoading={setLoading}
                />
              </Grid>
            ))}
          </Grid>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Grid mt={"15px"} container justifyContent={"center"} gap={"10px"}>
            {likedData.map((x, i) => (
              <Grid
                key={i}
                item
                xs={12}
                sm={3}
                md={3}
                lg={3}
                minWidth={"281px"}
              >
                <FundItemWrapper
                  nftsIndex={undefined} //TODO: FIX HERE
                  description={x.description}
                  amountToHelp={x.amountToHelp}
                  title={x.title}
                  currentAmount={x.tonAmount}
                  liked={true}
                  itemSeqno={x.id}
                  fetchItems={fetchItems}
                  setLoading={setLoading}
                />
              </Grid>
            ))}
          </Grid>
        </CustomTabPanel>
      </Grid>
    </>
  );
}
