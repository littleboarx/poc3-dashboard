import { Container, Table, InputGroup, FormControl } from "react-bootstrap";
import { useAppData } from "./App";
import { formatFire } from "./utils";
import {
  Search as SearchIcon,
  XCircle as XCircleIcon,
} from "react-bootstrap-icons";
import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";

const NotFoundLine = styled.p`
  text-align: center;
  width: 100%;
`;

const Data = () => {
  const { data } = useAppData();
  const [filter, setFilter] = useState("");

  const isFilterValid = useMemo(() => filter.trim().length > 0, [filter]);
  const isFilterHasResult = useMemo(() => {
    if (!isFilterValid) {
      return true;
    }
    return (
      data.dashboard.filter((i) => i.targetAddress.indexOf(filter) > -1)
        .length > 0
    );
  }, [data, filter, isFilterValid]);

  const onFilterChange = useCallback(
    (e) => {
      setFilter(e.target.value.trim());
    },
    [setFilter]
  );

  return (
    <section className="page-data color-white">
      <Container>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text>
              <SearchIcon />
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            aria-describedby="Search"
            placeholder="Search address..."
            aria-label="Search address..."
            onChange={onFilterChange}
            value={filter}
          />
          {isFilterValid ? (
            <InputGroup.Append onClick={() => setFilter("")}>
              <InputGroup.Text>
                <XCircleIcon />
              </InputGroup.Text>
            </InputGroup.Append>
          ) : null}
        </InputGroup>
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
            {isFilterValid
              ? data.dashboard.map((whale, idx) =>
                  whale.targetAddress.indexOf(filter) > -1 ? (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{whale.targetAddress}</td>
                      <td>{whale.targetState.length}</td>
                      <td>{formatFire(whale.targetFire)}</td>
                      {/* <td>{totalHashPower(whale.targetState)}</td> */}
                      <td>{whale.targetFireRatio}</td>
                    </tr>
                  ) : null
                )
              : data.dashboard.map((whale, idx) => (
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
        {!isFilterHasResult ? <NotFoundLine>Not Found</NotFoundLine> : null}
      </Container>
    </section>
  );
};
export default Data;
