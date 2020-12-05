import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { Tabs, Tab } from 'react-bootstrap';
import { ChevronDown, ChevronUp } from 'react-bootstrap-icons';

const Wrapper = styled.div`
    position: relative;
    height: 0;
    width: 100%;
`;

const Inner = styled.div`
    position: absolute;
    width: 100%;
`;

const ExpandableDialog = styled.div`
    max-width: 600px;
    background-color: #282828;
    border: solid #D1FF52 3px;
    margin: -30px auto 0 auto;
    padding: 15px 30px;
`;

const Outline = styled.div`
    display: flex;
    flex-direction: row;
    align-items: baseline;
`;

const Title = styled.div`
    flex: 1 1 auto;
`;
const Button = styled(ExpandButton)`
    flex: 0 0 auto;
`;
function ExpandButton({expanded, onClick}) {
    return (
        <div onClick={onClick}>
            {expanded ? (<ChevronUp />) : (<ChevronDown />)}
        </div>
    );
}

const Body = styled.div`
    margin: 45px 15px 25px 0;
    font-size: 13px;
`;

const AddrTabs = styled(Tabs)`
    margin-top: 30px;
`;

const AddrTableSpace = styled.div`
    max-height: 300px;
    overflow-y: scroll;
`;

const AddrTableRow = styled.tr`
    td:nth-child(2) {
        text-align: right;
    }
`;

const kUnlockHashPowerThreshold = [0, 140000, 280000, 560000];
const kMessages = [
    `The 1st round Firedrop is at ${kUnlockHashPowerThreshold[1]} points`,
    `The winners of the 1st round Firedrop has came out!`,
    `The winners of the 2st round Firedrop has came out!`,
    `The winners of the 3st round Firedrop has came out!`,
];

function Lottery ({currentPower = 0, pool = []}) {
    const [msg, level] = useMemo(() => {
        for (let i = kUnlockHashPowerThreshold.length - 1; i >= 0; i--) {
            if (currentPower >= kUnlockHashPowerThreshold[i]) {
                return [kMessages[i], i];
            }
        }
        return ['', 0];
    }, [currentPower]);

    const [expanded, setExpanded] = useState(false);
    function toggleExpand () {
        console.log('toggle');
        setExpanded(!expanded);
    }

    return (
        <Wrapper>
            <Inner>
                <ExpandableDialog className="color-white">
                    <Outline>
                        <Title>
                            {msg}
                        </Title>
                        <Button expanded={expanded} onClick={toggleExpand} />
                    </Outline>
                    {expanded && 
                        <Body>
                            <p>
                                Firedrop is a way to randomly distribute some amount of Fire to 5% of the miner stash accounts if they are online for at least 6 mining rounds. It ONLY happens once the prize pool breaks into the next stage. The table below shows the stash account and the prize. The winners will get their prize in the payout target account in 24 hours.
                            </p>
                            {level > 0 && <Pool pool={pool} />}
                        </Body>
                    }
                </ExpandableDialog>
            </Inner>
        </Wrapper>
    );
}

function Pool({pool}) {
    const [tabKey, setTabKey] = useState(1);
    return (
        <AddrTabs
            activeKey={tabKey}
            onSelect={k => setTabKey(k)}
        >
            {pool.map((p, idx) => (
                <Tab key={idx} eventKey={idx + 1} title={`Round ${idx + 1}`}>
                    <AddrTableSpace>
                        <table>
                            {p.map(([addr, value], idx2) => 
                                <AddrTableRow key={idx2}>
                                    <td>{addr}</td>
                                    <td>{value} FIRE</td>
                                </AddrTableRow>
                            )}
                        </table>
                    </AddrTableSpace>
                </Tab>
            ))}
        </AddrTabs>
    );
}

export default Lottery;
