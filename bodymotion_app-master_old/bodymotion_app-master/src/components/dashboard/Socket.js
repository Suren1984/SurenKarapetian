import { Button, FormGroup, Input, Label } from 'reactstrap';
import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { MOTIONTRONIC_IP } from '../../../constants/Config';
import { getCookie } from 'cookies-next';
import { randInt } from 'three/src/math/MathUtils';


const WebSocketDemo = (props) => {
    //Public API that will echo messages sent to it back to the client
    const [socketUrl, setSocketUrl] = useState('ws://' + MOTIONTRONIC_IP + ':11000/echo');
    const [messageHistory, setMessageHistory] = useState([]);
    const [ip, setIp] = useState(MOTIONTRONIC_IP) //delete


    const handleSetIp = () => {
        setSocketUrl('ws://' + ip + ":11000/echo");
    }



    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory((prev) => prev.concat(lastMessage));
            props.handleDataFromMotionTronic(lastMessage.data);

        }
    }, [lastMessage, setMessageHistory]);

    useEffect(() => {
        setSocketUrl('ws://null:11000/echo')
        let ip = getCookie('ip');
        setSocketUrl('ws://' + ip + ":11000/echo")
        setIp(ip);
    }, [socketUrl, props.handleRefresh2])

    const handleClickChangeSocketUrl = useCallback(
        () => {
            setSocketUrl('ws://null');
        },
        []
    );

    const MINUTE_MS = 2;


    const handleClickSendMessage = useCallback(() => sendMessage('GiveMeData'), []);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    useEffect(() => {
        props.changedStatusMotion(connectionStatus);
    }, [connectionStatus, props])

    return (
        <div style={{ backgroundColor: '#000', position: 'absolute', marginLeft: 16, marginTop: 16, padding: 10, zIndex: 50, flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
            {/*<span style={{ color: '#fff', cursor: 'pointer' }} onClick={handleClickChangeSocketUrl}>
                <i className="bi bi-arrow-clockwise"></i>&nbsp;Refresh
            </span>
            <span style={{ color: '#fff', marginLeft: 50 }}>MotionTronic status: {connectionStatus}</span>
            <div style={{flexDirection: 'row', display: 'flex', alignItems: 'center'}}>
                <span style={{ color: '#fff', marginLeft: 50 }}>IP:&nbsp;&nbsp;</span>
                <Input bsSize='sm' value={ip} onChange={(e) => setIp(e.target.value)}/>
                <Button
                onClick={() => handleSetIp()}
                    color="primary"
                >
                    Set
                </Button>
            </div>
    */}
            <div style={{ position: 'absolute', marginTop: 35, marginLeft: 120, color: '#fff', width: 300 }}>
                <FormGroup switch>
                    <Input type="switch" role="switch" onClick={() => sendMessage("video")}/>
                    <Label check>Calibration Mode</Label>
                </FormGroup>
            </div>
        </div>
    );
};

export default WebSocketDemo;