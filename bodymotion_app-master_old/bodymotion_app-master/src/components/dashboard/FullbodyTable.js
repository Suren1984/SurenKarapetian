import { useContext, useEffect, useState } from "react";
import { GAIT_PARAMS_SIDES, GAIT_PARAMS_SINGLE } from "../../../constants/Gait";
import { MotionTronicDataContext } from "../../../pages/dashboard";
import { UserContext } from "../../../pages/_app";
import { MAIN_TOKEN, BACKEND_URL, REFRESH_INTERVAL } from "../../../constants/Config";
import { POSTURE_PARAMS_SIDES, POSTURE_PARAMS_SINGLE } from "../../../constants/Posture";
import { isUndefined } from "tls";
import { isNull } from "tls";

const FullbodyTable = () => {
    const motionTronicData = useContext(MotionTronicDataContext)
    //  const [sidesLeftTablePos, setSidesLeftTablePos] = useState(POSTURE_PARAMS_SIDES)
    //  const [sidesRightTablePos, setSidesRightTablePos] = useState(POSTURE_PARAMS_SIDES)
    const [postureTable, setPostureTable] = useState([POSTURE_PARAMS_SIDES, null])
    const [singleTablePos, setSingleTablePos] = useState(POSTURE_PARAMS_SINGLE)
   // const [sidesLeftTableGait, setSidesLeftTableGait] = useState(GAIT_PARAMS_SIDES)
   // const [sidesRightTableGait, setSidesRightTableGait] = useState(GAIT_PARAMS_SIDES)
   const [gaitTable, setGaitTable] = useState([GAIT_PARAMS_SIDES, null])
    const [singleTableGait, setSingleTableGait] = useState(GAIT_PARAMS_SINGLE)
    const [isTimeToGetData, setIsTimeToGetData] = useState(false)
    const userData = useContext(UserContext);

    const getData = async (data) => {
        const response = await fetch(BACKEND_URL + "/calculate/current-fullbody", {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + userData.token,
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify({
                jointDatas: data,
            })
        });
        if (response.status == 200) {
            let json = await response.json();
            //  setSidesLeftTablePos(json.posture[0]);
            //  setSidesRightTablePos(json.posture[1]);
            setPostureTable(json.posture);
            setSingleTablePos(json.posture[2]);
          //  setSidesLeftTableGait(json.gait[0]);
           // setSidesRightTableGait(json.gait[1]);
           setGaitTable(json.gait)
            setSingleTableGait(json.gait[2]);


        }
    }

    const MINUTE_MS = REFRESH_INTERVAL;
    useEffect(() => {
        const interval = setInterval(() => {
            setIsTimeToGetData(true);
        }, MINUTE_MS);

        return () => clearInterval(interval);
    }, [])

    useEffect(() => {
        if (isTimeToGetData) {
            setIsTimeToGetData(false)
            if (motionTronicData[0].isRunning)
                getData(JSON.stringify(motionTronicData[0].jointDatas))
        }
    }, [motionTronicData])


    return (
        <div>
            <div style={{ display: "flex", justifyContent: 'space-between' }}>
                <table className="params-table">
                    <h5>Upper limbs</h5>
                    {postureTable[0].map((param, index) => (
                        <tr key={index} className="param-box">
                            <td>
                            <span>{param.param + (param.param.includes("Flexion") ? " / Extension" : " / Adduction")}</span>
                            </td>
                            <td className="param-box-value" style={isUndefined(param.text) ? null : (param.conf == 0 ? { backgroundColor: "rgba(255,0,0,0.5)" } : null)}>
                                <span>{param.text}</span>
                            </td>
                            <td className="param-box-value" style={isUndefined(param.text) ? null : (param.conf == 0 ? { backgroundColor: "rgba(255,0,0,0.5)" } : null)}>
                                <span>{isNull(postureTable[1]) ? "" : postureTable[1].at(index).text}</span>
                            </td>
                        </tr>
                    ))}
                


                </table>


                <table className="params-table">
                    <h5>Lower limbs</h5>
                    {gaitTable[0].map((param, index) => (
                        <tr key={index} className="param-box">
                            <td>
                                <span>{param.param + (param.param.includes("Flexion") ? " / Extension" : " / Adduction")}</span>
                            </td>
                            <td className="param-box-value" style={isUndefined(param.text) ? null : (param.conf == 0 ? { backgroundColor: "rgba(255,0,0,0.5)" } : null)}>
                                <span>{param.text}</span>
                            </td>
                            <td className="param-box-value" style={isUndefined(param.text) ? null : (param.conf == 0 ? { backgroundColor: "rgba(255,0,0,0.5)" } : null)}>
                                <span>{isNull(gaitTable[1]) ? "" : gaitTable[1].at(index).text}</span>
                            </td>
                        </tr>
                    ))}
                
                </table>
                {/*       </div>
            <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between' }}>
 */}

                <table className="params-table">
                    <h5>Torso</h5>
                    {singleTablePos.map((param, index) => (
                        <tr key={index} className="param-box">
                            <td>
                                <span>{param.param}</span>
                            </td>
                            <td className="param-box-value" style={isUndefined(param.text) ? null : (param.conf == 0 ? { backgroundColor: "rgba(255,0,0,0.5)" } : null)}>
                                <span>{param.text}</span>
                            </td>
                        </tr>
                    ))}
                    {singleTableGait.map((param, index) => (
                        <tr key={index} className="param-box">
                            <td>
                                <span>{param.param}</span>
                            </td>
                            <td className="param-box-value" style={isUndefined(param.text) ? null : (param.conf == 0 ? { backgroundColor: "rgba(255,0,0,0.5)" } : null)}>
                                <span>{param.text}</span>
                            </td>
                        </tr>
                    ))}
                </table>
            </div>
        </div>
    );
};

export default FullbodyTable;
