import React, { useEffect, useMemo, useState } from 'react';

import Axios from 'axios';
import BN from 'bn.js';

import {Container, Modal, Table} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Lottery from './Lottery';

const bn1e8 = new BN(10).pow(new BN(8));

const defaultData = {
  "onlineTime": "[]",
  "dashboard": [
    {
        "targetAddress": "43DHoYgGL3h63M8vt4kC7yGgdUCg2r6yWAhT1E6qZXYtEfNn",
        "targetFire": "43294450161834906",
        "targetFireRatio": "0.00%",
        "targetState": [
            {
                "stashAddress": "44CmwGtpxcNeCPMcpLvv68CrWqEUBkh3Po5J6d4PvSC6TWyE",
                "stashState": {
                    "controller": "43DHoYgGL3h63M8vt4kC7yGgdUCg2r6yWAhT1E6qZXYtEfNn",
                    "overallScore": 280
                }
            }
        ]
    },]
};

const kUnlockHashPowerThreshold = [0, 140000, 280000, 560000];
const kUnlockHashPowerMax = kUnlockHashPowerThreshold[kUnlockHashPowerThreshold.length - 1];

function ProgressBar({currentPower}) {
  const progress = currentPower / kUnlockHashPowerMax;

  function perc(x) {
    x = Math.pow(x, 0.8);
    return `${(100 * x) | 0}%`;
  }

  return (
    <div className='progress-bar'>
      <div className='indicator' style={{width: perc(progress)}}>
      </div>
      <div className='base-label'>Base: 500k PHA</div>
      <div className='marker' style={{left: perc(kUnlockHashPowerThreshold[1]/kUnlockHashPowerMax)}}>
        <div className='label'>600k PHA</div>
      </div>
      <div className='marker' style={{left: perc(kUnlockHashPowerThreshold[2]/kUnlockHashPowerMax)}}>
        <div className='label'>700k PHA</div>
      </div>
      <div className='marker' style={{left: perc(kUnlockHashPowerThreshold[3]/kUnlockHashPowerMax)}}>
        <div className='label'>800k PHA</div>
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    updateData();
    const i = setInterval(() => {
      updateData();
    }, 6000);
    return () => clearInterval(i);
  }, [])

  const [data, setData] = useState(defaultData);
  const [lottery, setLottery] = useState([]);
  async function updateData() {
    const path = (
      process.env.REACT_APP_ENV === 'development'
      ? './testdata.json' : './result.json');
    const resp = await Axios.get(path);
    setData(resp.data);
    if (resp.data.lotteryPool1) {
      setLottery([JSON.parse(resp.data.lotteryPool1)]);
    }
  }

  const dt = useMemo(() => (Date.now() - data.timestamp) / 1000, [data]);

  function formatFire(rawFire) {
    return (new BN(rawFire).div(bn1e8).toNumber() / 10000.0).toFixed(4);
  }

  function totalHashPower(stashes) {
    return stashes.reduce((acc, x) => acc + x.stashState.overallScore, 0);
  }

  return (
    <div className="App">

      <section className="page-head color-white">
        <div className="bg" />
        <Container>
          <h5 className="color-primary">Phala Testnet Vendetta</h5>
          <h1 className="color-primary">1605 Miner Race</h1>

          <h5>Total Prize Pool</h5>

          <ProgressBar
            currentPower={data.maxTotalPower}
          />

          <p>
            Want to increase the total prize pool? <a className="color-primary" href="https://wiki.phala.network/en-us/docs/poc3/">Join mining</a>
          </p>
        </Container>
      </section>

      <Lottery
        currentPower={data.maxTotalPower}
        pool={lottery}
      />

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

      <section>
        <Container>
          <p className="theme-dark">2020 Phala Network - Mining round: {data.round} - Last updated: {dt}s ago</p>
        </Container>
      </section>

    </div>
  );
}

export default App;
