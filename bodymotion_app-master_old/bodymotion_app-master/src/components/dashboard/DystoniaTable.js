import { useContext, useEffect, useState } from "react";
import { DYSTONIA_PARAMS } from "../../../constants/Dystonia";
import { MotionTronicDataContext } from "../../../pages/dashboard";
import { BACKEND_URL, REFRESH_INTERVAL } from "../../../constants/Config"
import { UserContext } from "../../../pages/_app";

const DystoniaTable = () => {
    const motionTronicData = useContext(MotionTronicDataContext)
    const [table, setTable] = useState([])
    const [isTimeToGetData, setIsTimeToGetData] = useState(false)
    const userData = useContext(UserContext);


    const handleDataToShow = (data) => {
        //console.log("IDE: " + data);
        let array = data

        const rows = array.reduce(function (rows, key, index) {
            return (index % 2 == 0 ? rows.push([key])
                : rows[rows.length - 1].push(key)) && rows;
        }, []);
        setTable(rows);
    }

    useEffect(() => {
        handleDataToShow(DYSTONIA_PARAMS)
    }, [])

    const getData = async (data) => {
       // console.log("GET DATA RUNNING");
        const response = await fetch(BACKEND_URL + "/calculate/current-dystonia", {
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
            handleDataToShow(json)
            //console.log(json);
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
        <table className="params-table">
            {table.map((row) => {
                return (
                    // eslint-disable-next-line react/jsx-key
                    <tr className="param-box">
                        {row.map((param) => {
                            return (
                                <>
                                    <td>
                                        <span>{param.param}</span>
                                    </td>
                                    <td className="param-box-value">
                                        <span>{param.text}</span>
                                    </td>
                                </>
                            )
                        })}
                    </tr>
                )
            })}
        </table>
    );
};

export default DystoniaTable;
