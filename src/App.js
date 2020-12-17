import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import Axios from 'axios';

import {Container, Table} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Lottery from './Lottery';
import Head from './Head';
import { defaultData } from './utils';

const AppDataContext = createContext();
const useAppData = () => useContext(AppDataContext);

const AppWrapper = () => {
  const [data, setData] = useState(defaultData);
  const [lottery, setLottery] = useState([]);

  const updateData = useCallback(async () => {
    const path = process.env.REACT_APP_RESULT_URL || (
      process.env.REACT_APP_ENV === 'development'
        ? './testdata.json' : './result.json');
    const resp = await Axios.get(path);
    setData(resp.data);
    if (resp.data.lotteryPool1) {
      setLottery([JSON.parse(resp.data.lotteryPool1)]);
    }
  }, [setData, setLottery]);

  const dt = useMemo(() => (Date.now() - data.timestamp) / 1000, [data]);

  const contextValue = useMemo(() => ({ data, lottery, dt }), [data, lottery, dt])

  useEffect(() => {
    updateData();
    const i = setInterval(() => {
      updateData();
    }, 6000);
    return () => clearInterval(i);
  }, [updateData])

  return <AppDataContext.Provider value={contextValue}>
    <App />
  </AppDataContext.Provider>


}

const Data = () => {
  return <section className="page-data color-white">
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
}

const App = () => {
  return (
    <div className="App">
      <Head />
      {/* <Lottery
        currentPower={data.maxTotalPower}
        pool={lottery}
      /> */}

      {/* <Data /> */}

      {/* <section>
        <Container>
          <p className="theme-dark">2020 Phala Network - Mining round: {data.round} - Last updated: {dt}s ago</p>
        </Container>
      </section> */}

    </div>
  );
}

export default AppWrapper;
export {
  useAppData
};
