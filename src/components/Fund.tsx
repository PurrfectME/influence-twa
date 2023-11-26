import { useFundContract } from "../hooks/useFundContract";
import { truncateAddress } from "../utils/utils";
import { Card, FlexBoxCol, FlexBoxRow } from "./styled/styled";

export default function Fund() {
  const { data } = useFundContract();

  return (
    <Card>
      <FlexBoxCol>
        <h3>Информация фонда</h3>
      </FlexBoxCol>

      <FlexBoxCol>
        <FlexBoxRow>
          <h3>Владелец:</h3> {truncateAddress(data?.owner.toString())}
        </FlexBoxRow>

        <FlexBoxRow>
          <h3>Название:</h3> {data?.name.toString()}
        </FlexBoxRow>

        <FlexBoxRow>
          <h3>Описание:</h3> {data?.description.toString()}
        </FlexBoxRow>

        <FlexBoxRow>
          <h3>Кол-во заявок:</h3> {data?.fundItemSeqno.toString()}
        </FlexBoxRow>

        {/* <FlexBoxRow>
                    <h3>Баланс токенов INF:</h3> {data?.jettonBalance.toString()}
                </FlexBoxRow> */}
      </FlexBoxCol>
    </Card>
  );
}
