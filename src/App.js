import React, { useState } from 'react';

import Axios from 'axios';
import BN from 'bn.js';

import logo from './logo.svg';
import './App.css';

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

function App() {
  React.useEffect(() => {
    updateData();
  }, [])

  const [data, setData] = useState(defaultData);
  async function updateData() {
    const resp = await Axios.get('./testdata.json');
    setData(resp.data);
  }

  function formatFire(rawFire) {
    return (new BN(rawFire).div(bn1e8).toNumber() / 10000.0).toFixed(4);
  }

  function totalHashPower(stashes) {
    return stashes.reduce((acc, x) => acc + x.stashState.overallScore, 0);
  }

  return (
    <div className="App">

      <section className="page-head">

        <h4>Phala Testnet Vendetta</h4>
        <h1>1605 Miner Race</h1>

        <p>Total Prize Pool</p>

        <p>Want to increase the total prize pool? <a href="">Join miners</a></p>

      </section>

      <section className="page-data">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>💰Miner💰</th>
              <th>🔥Fire🔥</th>
              <th>⛏CPU Power⛏</th>
              <th>👷Miners👷</th>
              <th>🔥%🔥</th>
            </tr>
          </thead>
          <tbody>
            {data.dashboard.map((whale, idx) => (
              <tr>
                <td>{idx + 1}</td>
                <td>{whale.targetAddress}</td>
                <td>{formatFire(whale.targetFire)}</td>
                <td>{totalHashPower(whale.targetState)}</td>
                <td>{whale.targetState.length}</td>
                <td>{whale.targetFireRatio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

    </div>
  );
}

export default App;
