import { useContext, useEffect, useState } from "react";
import { DYSTONIA_PARAMS } from "../../../constants/Dystonia";
import { POSTURE_PARAMS_SIDES, POSTURE_PARAMS_SINGLE } from "../../../constants/Posture";
import { MotionTronicDataContext } from "../../../pages/dashboard";
import { UserContext } from "../../../pages/_app";
import { MAIN_TOKEN, BACKEND_URL, REFRESH_INTERVAL } from "../../../constants/Config";
import { isUndefined } from "tls";

const PostureTable = () => {
    const motionTronicData = useContext(MotionTronicDataContext)
    const [sidesLeftTable, setSidesLeftTable] = useState(POSTURE_PARAMS_SIDES)
    const [sidesRightTable, setSidesRightTable] = useState(POSTURE_PARAMS_SIDES)
    const [singleTable, setSingleTable] = useState(POSTURE_PARAMS_SINGLE)
    const [isTimeToGetData, setIsTimeToGetData] = useState(false)
    const userData = useContext(UserContext);

    const getData = async (data) => {
        const response = await fetch(BACKEND_URL + "/calculate/current-posture", {
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
            setSidesLeftTable(json.original[0]);
            setSidesRightTable(json.original[1]);
            setSingleTable(json.original[2]);
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
            <div style={{ display: "flex", flexDirection: 'row' }}>
                <table className="params-table">
                    <h5>Left side</h5>
                    {sidesLeftTable.map((param, index) => (
                        <tr key={index} className="param-box">
                            <td>
                                <span>{param.param}</span>
                            </td>
                            <td className="param-box-value" style={isUndefined(param.text) ? null : (param.conf == 0 ? {backgroundColor: "rgba(255,0,0,0.5)"} : null) }>
                                <span>{param.text}</span>
                            </td>
                        </tr>
                    ))}
                </table>


                <table className="params-table">
                    <h5>Right side</h5>
                    {sidesRightTable.map((param, index) => (
                        <tr key={index} className="param-box">
                            <td>
                                <span>{param.param}</span>
                            </td>
                            <td className="param-box-value" style={isUndefined(param.text) ? null : (param.conf == 0 ? {backgroundColor: "rgba(255,0,0,0.5)"} : null) }>
                                <span>{param.text}</span>
                            </td>
                        </tr>
                    ))}
                </table>
    {/*             </div>
    <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between' }}>
 */}

                <table className="params-table">
                    <h5>Single data</h5>
                {singleTable.map((param, index) => (
                    <tr key={index} className="param-box">
                        <td>
                            <span>{param.param}</span>
                        </td>
                        <td className="param-box-value" style={isUndefined(param.text) ? null : (param.conf == 0 ? {backgroundColor: "rgba(255,0,0,0.5)"} : null) }>
                            <span>{param.text}</span>
                        </td>
                    </tr>
                ))}
            </table>
            </div>

</div>
           
   );
};

export default PostureTable;
