import { useContext, useEffect, useState, useCallback } from "react";
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto'
import { Col, Input, Row } from "reactstrap";
import { CHART_COLORS, CHART_COLORS_LIGHT } from "../../../../constants/ChartColors";
import { BACKEND_URL } from "../../../../constants/Config";
import { UserContext } from "../../../../pages/_app";
import Moment from "moment";
import e from "cors";
import { isNull } from "tls";
import { isUndefined } from "tls";

const RehabilitationsRecord = ({ recordId }) => {
    const userData = useContext(UserContext);

    const [rehabilitations, setRehabilitations] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedRehabGame, setSelectedRehabGame] = useState(null)
    const [selectedRehabRound, setSelectedRehabRound] = useState(null)
    const [selectedRehab, setSelectedRehab] = useState(null)
    const [chartData, setChartData] = useState(null)
    const [chartBarData, setChartBarData] = useState([])
    const [rehabilitation, setRehabilitation] = useState(null)

    useEffect(() => {
        const getRehabilitations = async () => {
            const res = await fetch(BACKEND_URL + "/records/" + recordId + "/rehabilitation", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + userData.token
                },
            })
            const data = await res.json();
            setRehabilitations(data);
        }
        getRehabilitations();
        console.log("useEffect 1 rendered")
    }, [recordId])

    const changeSelectedRehabGame = (name) => {
        setSelectedRehabGame(name)
        if (name == -1) {
            setRehabilitation(null)
            setSelectedRehab(null)
            setSelectedRehabGame(null)
        }
    }

    const changeSelectedRound = (round) => {
        setSelectedRehabRound(round)
    }

    const changeSelectedRehab = (index) => {
        setSelectedRehab(index)
        if (index == -1) {
            setRehabilitation(null)
            setSelectedRehab(null)
        } else {
            setRehabilitation(JSON.parse(rehabilitations[index].data))

        }
    }

    // we are gathering the full list of reabs from API, so we need 
    // to get the distinct names of rehabs
    const getRehabNameDistinct = () => {
        let distinct = []
        rehabilitations.forEach((rehab) => {
            if (!distinct.includes(rehab.rehab_name)) {
                distinct.push(rehab.rehab_name)
            }
        })
        return distinct
    }

    useEffect(() => {
        if (rehabilitation == null)
            return

        let labels = []
        let datasets = []


        // make datasets (joints)
        Object.keys(rehabilitation.pickups_info[0].JointsData).forEach((key, index) => {
            //if type is limit
            if (isLimit(key)) {
                datasets.push({
                    label: key,
                    data: [],
                    borderColor: 'rgba(0, 0, 0, 0)',
                    backgroundColor: CHART_COLORS[index],
                })
                // for each for JointData of rehabilitation where left type is limit
                datasets.push({
                    label: key + " Limit Left",
                    data: [],
                    borderColor: CHART_COLORS_LIGHT[index],
                    backgroundColor: CHART_COLORS_LIGHT[index],
                })
                datasets.push({
                    label: key + " Limit Right",
                    data: [],
                    borderColor: CHART_COLORS_LIGHT[index + 1],
                    backgroundColor: CHART_COLORS_LIGHT[index + 1],
                })
            }
        })


        rehabilitation.pickups_info.forEach((item, index) => {
            labels.push((index + 1) + " (" + item.TimeFromLastPickups.Seconds + "s)")
            datasets.forEach((dataset, datasetIndex) => {
                let key = dataset.label
                if (key.includes("Limit")) {
                    let side = key.includes("Left") ? "Left" : "Right"
                    if (dataset.label.includes("Thoracic Flexion Limit")) {
                        if (side == "Left") {
                            datasets[datasetIndex].data.push(
                                JSON.parse(item.JointsData[key.replace(" Limit " + side, "")].Antero.Value).DynamicLimit * -1
                            )
                        } else {
                            datasets[datasetIndex].data.push(
                                JSON.parse(item.JointsData[key.replace(" Limit " + side, "")].Retro.Value).DynamicLimit
                            )
                        }
                    } else {
                        if (side == "Left") {
                            datasets[datasetIndex].data.push(
                                JSON.parse(item.JointsData[key.replace(" Limit " + side, "")].Left.Value).DynamicLimit * -1
                            )
                        } else {
                            datasets[datasetIndex].data.push(
                                JSON.parse(item.JointsData[key.replace(" Limit " + side, "")].Right.Value).DynamicLimit
                            )
                        }
                    }
                } else {
                    if (dataset.label == "Thoracic Flexion") {
                        datasets[datasetIndex].data.push(
                            JSON.parse(item.JointsData[key].Retro.Value).Angle == 0 ?
                                JSON.parse(item.JointsData[key].Antero.Value).Angle :
                                JSON.parse(item.JointsData[key].Retro.Value).Angle
                        )

                    } else {
                        datasets[datasetIndex].data.push(
                            JSON.parse(item.JointsData[key].Left.Value).Angle == 0 ?
                                JSON.parse(item.JointsData[key].Right.Value).Angle :
                                JSON.parse(item.JointsData[key].Left.Value).Angle
                        )
                    }
                }
            })
        })

        console.log(datasets);
        setChartData({ labels, datasets })

        // chart bar
        labels = []
        datasets = []

        datasets.push({
            label: "Left",
            data: [],
            borderColor: CHART_COLORS[0],
            backgroundColor: CHART_COLORS[0],
        })
        datasets.push({
            label: "Right",
            data: [],
            borderColor: CHART_COLORS[1],
            backgroundColor: CHART_COLORS[1],
        })

        datasets.forEach((dataset, datasetIndex) => {
            Object.keys(rehabilitation.pickups_info[0].JointsData).forEach((key, index) => {
                if (datasetIndex == 0)
                    labels.push(key)
                let vals = []
                const side = dataset.label == "Left" ?
                    (isAnteroRetro(key) ? "Antero" : "Left") :
                    (isAnteroRetro(key) ? "Retro" : "Right")

                rehabilitation.pickups_info.forEach((item, index) => {
                    // if == 0 it means that this side has not been done so skip it
                    if (JSON.parse(item.JointsData[key][side].Value).Angle != 0) {
                        if (isLimit(key)) {
                            let angle = JSON.parse(item.JointsData[key][side].Value).Angle
                            let limit = JSON.parse(item.JointsData[key][side].Value).Limit
                            vals.push(Math.abs(angle) >= Math.abs(limit) ? 1 : 0)
                        } else {
                            let angle = JSON.parse(item.JointsData[key][side].Value).Angle
                            let max = JSON.parse(item.JointsData[key][side].Value).Max
                            vals.push(Math.abs(angle) <= Math.abs(max) ? 1 : 0)
                        }
                    }
                })

                console.log(key + " " + side)
                console.log(vals)
                // get percentag of 1 in vals
                let perc = vals.filter((val) => val == 1).length / vals.length * 100

                datasets[datasetIndex].data.push(perc)
            })
        })

        console.log(datasets);
        setChartBarData({ labels, datasets })

    }, [rehabilitation])

    const isLimit = (key) => {
        if (rehabilitation.pickups_info[0].JointsData[key].Left && rehabilitation.pickups_info[0].JointsData[key].Left.Type == "Limit") {
            return true
        }
        if (rehabilitation.pickups_info[0].JointsData[key].Antero && rehabilitation.pickups_info[0].JointsData[key].Antero.Type == "Limit") {
            return true
        }
        return false
    }

    const isAnteroRetro = (key) => {
        if (rehabilitation.pickups_info[0].JointsData[key].Antero)
            return true
        return false
    }

    return (
        <div>
            <hr></hr>
            <div style={{ marginTop: 30 }}>
                <h4 style={{ textAlign: "center" }}>Rehabilitations</h4>
                {rehabilitations.length > 0 &&
                    <>
                        <div style={{ display: 'flex', justifyContent: 'start', flexDirection: 'row', marginTop: 30, alignItems: 'center' }}>
                            <Input
                                id="exampleSelect"
                                name="select"
                                style={{ maxWidth: 170 }}
                                type="select"
                                value={selectedRehabGame}
                                onChange={(e) => changeSelectedRehabGame(e.target.value)}
                                size="sm"
                            >
                                <option value={-1}>
                                    Select
                                </option>
                                {getRehabNameDistinct()?.map((name, index) => (
                                    <option key={index} value={name}>
                                        {name}
                                    </option>
                                ))}
                            </Input>
                            {selectedRehabGame != null &&
                                <Input
                                    id="exampleSelect"
                                    name="select"
                                    style={{ maxWidth: 170, marginLeft: 10 }}
                                    type="select"
                                    value={selectedRehab}
                                    onChange={(e) => changeSelectedRehab(e.target.value)}
                                    size="sm"
                                >
                                    <option value={-1}>
                                        Select
                                    </option>
                                    {rehabilitations.map((rehabilitation, index) => (
                                        <>
                                            {
                                                rehabilitation.rehab_name == selectedRehabGame &&
                                                <option key={rehabilitation.id} value={index}>
                                                    {Moment(rehabilitation.created_at).format("DD. MM. YYYY HH:mm")}
                                                </option>
                                            }
                                        </>
                                    ))}
                                </Input>
                            }
                            {/* {selectedRehab != null &&
                                <Input
                                    id="exampleSelect"
                                    name="select"
                                    style={{ maxWidth: 170, marginLeft: 10 }}
                                    type="select"
                                    value={selectedRehabRound}
                                    onChange={(e) => changeSelectedRound(e.target.value)}
                                    size="sm"
                                >
                                    {rehabilitations.map((rehabilitation, index) => (
                                        <option key={rehabilitation.id} value={index}>
                                            {Moment(rehabilitation.created_at).format("DD. MM. YYYY HH:mm")}
                                        </option>
                                    ))}
                                </Input>
                            }
                        */}
                        </div>

                        <br></br>

                        {(rehabilitation !== null && chartData != null) ?
                            <>
                                <h5>Limit result chart</h5>
                                <Line
                                    options={{
                                        scales: {
                                            y: {
                                                ticks: {
                                                    callback: function (value) {
                                                        return value + "°"
                                                    }
                                                }
                                            }
                                        },
                                        animation: {
                                            duration: 0
                                        },
                                        plugins: {
                                            legend: {
                                                hidden: true
                                            },

                                        }

                                    }}
                                    datasetIdKey='id'
                                    data={chartData}
                                />
                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 30, flexDirection: 'row', alignItems: 'center' }}>
                                    <div style={{ width: '50%' }}>
                                        <h5>Hip result chart</h5>
                                        <Bar
                                            options={{
                                                scales: {
                                                    y: {
                                                        ticks: {
                                                            max: 100,
                                                            maxTicksLimit: 11,
                                                            callback: function (value) {
                                                                return value + "%"
                                                            }
                                                        }
                                                    }
                                                },
                                                animation: {
                                                    duration: 0
                                                },
                                                plugins: { legend: { hidden: true }, }

                                            }}
                                            datasetIdKey='id'
                                            data={chartBarData}
                                        />
                                    </div>
                                    <div style={{ flexDirection: 'column', display: 'flex', width: '45%', justifyContent: 'center', alignItems: 'center' }}>
                                        <table className="recordsTable">
                                            <tr>
                                                <th>Parameter</th>
                                                <th>Left Def. Limit / Hip</th>
                                                <th>Right Def. Limit / Hip</th>
                                            </tr>
                                            {Object.keys(rehabilitation.pickups_info[0].JointsData)?.map((key, index) => (
                                                <tr key={index}>
                                                    <td>{key}</td>
                                                    {key == "Thoracic Flexion" ?
                                                        <>
                                                            <td>{JSON.parse(rehabilitation.pickups_info[0].JointsData[key].Antero.Value).Limit || JSON.parse(rehabilitation.pickups_info[0].JointsData[key].Antero.Value).Max}</td>
                                                            <td>{JSON.parse(rehabilitation.pickups_info[0].JointsData[key].Retro.Value).Limit || JSON.parse(rehabilitation.pickups_info[0].JointsData[key].Retro.Value).Max}</td>
                                                        </ >
                                                        :
                                                        <>
                                                            <td>{JSON.parse(rehabilitation.pickups_info[0].JointsData[key].Left.Value).Limit || JSON.parse(rehabilitation.pickups_info[0].JointsData[key].Left.Value).Max}</td>
                                                            <td>{JSON.parse(rehabilitation.pickups_info[0].JointsData[key].Right.Value).Limit || JSON.parse(rehabilitation.pickups_info[0].JointsData[key].Right.Value).Max}</td>
                                                        </ >
                                                    }
                                                </tr>
                                            ))}

                                        </table>



                                        <table className="recordsTable">
                                            <tr>
                                                <th>Results %</th>
                                                <th>Left</th>
                                                <th>Right</th>
                                            </tr>
                                            <tr>
                                                <td>Pick ups</td>
                                                <td>{rehabilitation.count_of_picked_pickups_on_left_side + " / " + rehabilitation.total_count_of_pickups}&nbsp;=&nbsp;
                                                    {(rehabilitation.count_of_picked_pickups_on_left_side * 100) / rehabilitation.total_count_of_pickups}%</td>
                                                <td>{rehabilitation.count_of_picked_pickups_on_right_side + " / " + rehabilitation.total_count_of_pickups}&nbsp;=&nbsp;
                                                    {(rehabilitation.count_of_picked_pickups_on_right_side * 100) / rehabilitation.total_count_of_pickups}%</td>
                                            </tr>
                                            <tr>
                                                <td>Overall result</td>
                                                <td colSpan={2}>
                                                    {rehabilitation.count_of_picked_pickups_on_left_side + rehabilitation.count_of_picked_pickups_on_right_side + " / " + rehabilitation.total_count_of_pickups}&nbsp;=&nbsp;
                                                    {((rehabilitation.count_of_picked_pickups_on_left_side + rehabilitation.count_of_picked_pickups_on_right_side) * 100) / rehabilitation.total_count_of_pickups}%

                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </>
                            :
                            <h4 style={{ marginTop: 50, color: 'grey', textAlign: 'center' }}>Select a rehabilitation from the selector</h4>
                        }
                    </>
                }
            </div>
        </div>
    );
};

export default RehabilitationsRecord;