import AppNavBar from "./AppNavBar";
import { Container } from "react-bootstrap";
import { perc } from "./utils";
import { useAppData } from "./App";
import styled from "styled-components";
import { useMemo } from "react";

const kUnlockHashPowerThreshold = [0, 140000, 280000, 560000];
const kUnlockHashPowerMax =
  kUnlockHashPowerThreshold[kUnlockHashPowerThreshold.length - 1];

const PopoverWrapper = styled.div`
  position: relative;
  background: #d1ff52;
  border-radius: 5px;
  color: black;
  width: 212px;
  height: 61px;
  left: 106px;
  top: -81px;
  display: flex;
  align-items: center;
  place-content: center;
  font-size: 17px;
  line-height: 20px;
  text-align: center;

  color: #000000;

  &:after {
    content: " ";
    position: absolute;
    top: 100%; /* At the bottom of the tooltip */
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #d1ff52 transparent transparent transparent;
  }
`;

const Popover = () => {
  const { data } = useAppData();
  const onlineTimeMap = useMemo(() => {
    return JSON.parse(data.onlineTimeMap || '[]')
  }, [data]);

  return (
    <PopoverWrapper>
      Power: {`${data.currentTotalPower}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      <br />
      Miners: {onlineTimeMap.length}
    </PopoverWrapper>
  );
};

function ProgressBar({ currentPower }) {
  const progress = currentPower / kUnlockHashPowerMax;
  return (
    <>
      <div className="progress-bar">
        <div className="indicator" style={{ width: perc(progress) }}>
          <Popover />
        </div>
        <div className="base-label">Base: 500k PHA</div>
        <div
          className="marker"
          style={{
            left: perc(kUnlockHashPowerThreshold[1] / kUnlockHashPowerMax),
          }}
        >
          <div className="label">
            140k POWER
            <br />
            600k PHA
          </div>
        </div>
        <div
          className="marker"
          style={{
            left: perc(kUnlockHashPowerThreshold[2] / kUnlockHashPowerMax),
          }}
        >
          <div className="label">
            280k POWER
            <br />
            700k PHA
          </div>
        </div>
        <div
          className="marker"
          style={{
            left: perc(kUnlockHashPowerThreshold[3] / kUnlockHashPowerMax),
          }}
        >
          <div className="label">
            560k POWER
            <br />
            800k PHA
          </div>
        </div>
      </div>
    </>
  );
}

const DescLine = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;

  color: #ffffff;
  margin: 21px auto 56px;
`;

const Head = () => {
  const { data } = useAppData();
  return (
    <section className="page-head color-white">
      <div className="bg" />
      <AppNavBar />
      <Container>
        <h5 className="color-primary">Phala Testnet Vendetta</h5>
        <h1 className="color-primary">1605 Miner Race</h1>
        <DescLine>
          1605 Race is a miner competition to stress-test Phala Testnet
          Vendetta. The prize pool will be unlocked according to "power"
          contributed by each miner, and PHA rewards will be distributed to your{" "}
          <a
            className="color-primary"
            href="https://forum.phala.network/t/how-to-create-a-phala-account-on-testnet-vendetta/1253"
          >
            Phala account
          </a>{" "}
          according to the ratio of your fire at the end of Jan 1. A Firedrop
          will be triggered each time when the prize pool breaks into the next
          stage, and **5%** of all the qualified miners(running for more than 6{" "}
          <a
            className="color-primary"
            href="https://wiki.phala.network/en-us/docs/poc3/4-faq/"
          >
            rounds
          </a>
          ) will share 720,000 Fires to improve their final ratio and earn more
          PHA.
        </DescLine>

        <h5>Total Prize Pool</h5>

        <ProgressBar currentPower={data.maxTotalPower} />
      </Container>
    </section>
  );
};

export default Head;
