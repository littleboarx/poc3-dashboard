import { Container, Table } from "react-bootstrap";
import { useAppData } from "./App";
import { formatFire } from "./utils";

const Data = () => {
  const { data } = useAppData();
  return (
    <section className="page-data color-white">
      <Container>
        <Table responsive borderless variant="dark" size="sm" hover>
          <thead className="higher">
            <tr className="color-primary">
              <th>Rank</th>
              <th>Payout Address</th>
              <th>Miners</th>
              <th>Fire</th>
              {/* <th>CPU Power</th> */}
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {data.dashboard.map((whale, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{whale.targetAddress}</td>
                <td>{whale.targetState.length}</td>
                <td>{formatFire(whale.targetFire)}</td>
                {/* <td>{totalHashPower(whale.targetState)}</td> */}
                <td>{whale.targetFireRatio}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </section>
  );
};
export default Data;
