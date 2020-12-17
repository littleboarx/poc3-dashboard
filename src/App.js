import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import Axios from 'axios';

import {Container} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Lottery from './Lottery';
import Head from './Head';
import { defaultData } from './utils';
import Data from './Data';

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
    setLottery([
      resp.data.lotteryPool1,
      resp.data.lotteryPool2,
      resp.data.lotteryPool3
    ].map(x => JSON.parse(x))
      .filter(x => x.length > 0))
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

const App = () => {
  return (
    <div className="App">
      <Head />
      <Lottery />
      <Data />
      <Foot />
    </div>
  );
}

const Foot = () => {
  const { data, dt } = useAppData()
  return <section>
    <Container>
      <p className="theme-dark">2020 Phala Network - Mining round: {data.round} - Last updated: {dt}s ago</p>
    </Container>
  </section>
}

export default AppWrapper;
export {
  useAppData
};
