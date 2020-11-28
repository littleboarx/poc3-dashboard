import React, { useState } from 'react';

import Axios from 'axios';
import BN from 'bn.js';

import {Container} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
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

function ProgressBar () {
  return (
    <div style={{backgroundColor: '#232323', width: '100%', height: '25px'}}>
      <div style={{backgroundColor: '#D1FF52', width: '5%', height: '100%'}}>
      </div>
    </div>
  );
}

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

      <section className="page-head color-white">
        <Container>
          <h5 className="color-primary">Phala Testnet Vendetta</h5>
          <h1 className="color-primary">1605 Miner Race</h1>

          <h5>Total Prize Pool</h5>

          <ProgressBar></ProgressBar>

          <p>
            Want to increase the total prize pool? <a className="color-primary" href="https://www.google.com">Join mining</a>
          </p>
        </Container>
      </section>

      <section className="page-data color-white">
        <Container>
          <table>
            <thead>
              <tr className="color-primary">
                <th>Rank</th>
                <th>💰Miner💰</th>
                <th>👷Miners👷</th>
                <th>🔥Fire🔥</th>
                {/* <th>⛏CPU Power⛏</th> */}
                <th>🔥%🔥</th>
              </tr>
            </thead>
            <tbody>
              {data.dashboard.map((whale, idx) => (
                <tr>
                  <td>{idx + 1}</td>
                  <td>{whale.targetAddress}</td>
                  <td>{whale.targetState.length}</td>
                  <td>{formatFire(whale.targetFire)}</td>
                  {/* <td>{totalHashPower(whale.targetState)}</td> */}
                  <td>{whale.targetFireRatio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Container>
      </section>

    </div>
  );
}

export default App;
