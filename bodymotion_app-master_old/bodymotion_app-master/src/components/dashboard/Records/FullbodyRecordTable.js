import { useContext, useEffect, useState } from "react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto'
import { Col, Row } from "reactstrap";
import { CHART_COLORS } from "../../../../constants/ChartColors";
import RehabilitationsRecord from "./RehabilitationsRecord";

const FullbodyRecordTable = ({ handleRecord, handleChartView, handleChartData, recordId }) => {
    const [recordPos, setRecordPos] = useState({ id: 0, data: { leftSide: [], rightSide: [], single: [] } })
    const [recordGait, setRecordGait] = useState({ id: 0, data: { leftSide: [], rightSide: [], single: [] } })
    const [chartView, setChartView] = useState(false)
    const [chartData, setChartData] = useState([])
    const [datasets, setDatasets] = useState([])
    const [chartDataGait, setChartDataGait] = useState([])
    const [datasetsGait, setDatasetsGait] = useState([])

    useEffect(() => {
        try {
            setRecordPos(handleRecord().posture.vals)
            setRecordGait(handleRecord().gait.vals)
        } catch (e) {

        }
    }, [handleRecord])

    useEffect(() => {
        setChartView(handleChartView())
    }, [handleChartView])

    useEffect(() => {
        let data = handleChartData();
        if (data.posture != null) {
            setChartData(data.posture)
            setChartDataGait(data.gait)
        }
    }, [handleChartData])

    useEffect(() => {
        let arr = [];
        if (chartData.length > 0) {
            chartData[1].forEach((dataset, index) => {
                let json = {
                    label: dataset.param,
                    data: dataset.data,
                    borderColor: CHART_COLORS[index],
                    backgroundColor: CHART_COLORS[index],
                    hidden: true,
                }
                arr.push(json);
            });
            setDatasets(arr);
        }

        arr = [];
        if (chartDataGait.length > 0) {
            chartDataGait[1].forEach((dataset, index) => {
                let json = {
                    label: dataset.param,
                    data: dataset.data,
                    borderColor: CHART_COLORS[index],
                    backgroundColor: CHART_COLORS[index],
                    hidden: true,
                }
                arr.push(json);
            });
            setDatasetsGait(arr);
        }
    }, [chartData])

    return (
        <div>
            {!chartView ?
                <>
                    <div style={{ marginTop: 30 }}>
                        <Row>
                        <Col lg="4">
                        <h5 style={{padding: 0, margin: 0}}>&nbsp;</h5>
                                <table className="recordsTable">
                                    <tr>
                                        <th>&nbsp;</th>
                                    </tr>
                                    {recordPos.data.leftSide.map((param, i) => (
                                        <tr key={i}>
                                            <td><b>{param.Param}</b></td>
                                        </tr>
                                    ))}
                                    {recordGait.data.leftSide.map((param, i) => (
                                        <tr key={i}>
                                            <td><b>{param.Param}</b></td>
        
                                        </tr>
                                    ))}
                                </table>
                            </Col>
                            <Col lg="4">
                            <h5 style={{padding: 0, margin: 0}}>Left side</h5>
                                <table className="recordsTable">
                                    <tr>
                                        <th>Min</th>
                                        <th>Max</th>
                                        <th>Med</th>
                                        <th>Avg</th>
                                    </tr>
                                    {recordPos.data.leftSide.map((param, i) => (
                                        <tr key={i}>
                                            <td>{param.Min}</td>
                                            <td>{param.Max}</td>
                                            <td>{param.Med}</td>
                                            <td>{param.Avg}</td>
                                        </tr>
                                    ))}
                                    {recordGait.data.leftSide.map((param, i) => (
                                        <tr key={i}>
                                            <td>{param.Min}</td>
                                            <td>{param.Max}</td>
                                            <td>{param.Med}</td>
                                            <td>{param.Avg}</td>
                                        </tr>
                                    ))}
                                </table>
                            </Col>
                            <Col lg="4">
                            <h5 style={{padding: 0, margin: 0}}>Right side</h5>
                                <table className="recordsTable">
                                    <tr>
                                        <th>Min</th>
                                        <th>Max</th>
                                        <th>Med</th>
                                        <th>Avg</th>
                                    </tr>
                                    {recordPos.data.rightSide.map((param, i) => (
                                        <tr key={i}>
                                            <td>{param.Min}</td>
                                            <td>{param.Max}</td>
                                            <td>{param.Med}</td>
                                            <td>{param.Avg}</td>
                                        </tr>
                                    ))}
                                    {recordGait.data.rightSide.map((param, i) => (
                                        <tr key={i}>
                                            <td>{param.Min}</td>
                                            <td>{param.Max}</td>
                                            <td>{param.Med}</td>
                                            <td>{param.Avg}</td>
                                        </tr>
                                    ))}
                                </table>
                            </Col>
                        </Row>
                        <br></br><br></br>
                        <Row>
                            <Col lg="12">
                                <table className="recordsTable">
                                    <tr>
                                        <th></th>
                                        <th>Min</th>
                                        <th>Max</th>
                                        <th>Med</th>
                                        <th>Avg</th>
                                    </tr>
                                    {recordPos.data.single.map((param, i) => (
                                        <tr key={i}>
                                            <td><b>{param.Param}</b></td>
                                            <td>{param.Min}</td>
                                            <td>{param.Max}</td>
                                            <td>{param.Med}</td>
                                            <td>{param.Avg}</td>
                                        </tr>
                                    ))}
                                     {recordGait.data.single.map((param, i) => (
                                        <tr key={i}>
                                            <td><b>{param.Param}</b></td>
                                            <td>{param.Min}</td>
                                            <td>{param.Max}</td>
                                            <td>{param.Med}</td>
                                            <td>{param.Avg}</td>
                                        </tr>
                                    ))}
                                </table>
                            </Col>
                        </Row>

                    </div>
                </>
                :
                <>
                    <div style={{ marginTop: 30 }}>
                        <h4 style={{ textAlign: "center" }}>Posture</h4>
                        <Line
                            options={{
                                animation: {
                                    duration: 0
                                },
                                plugins: { legend: { hidden: true }, }

                            }}
                            datasetIdKey='id'
                            data={{
                                hidden: true,
                                labels: chartData[0],
                                datasets: datasets
                            }}
                        />
                    </div>
                    <div style={{ marginTop: 30 }}>
                        <hr />
                        <h4 style={{ textAlign: "center" }}>Gait</h4>
                        <Line
                            options={{
                                animation: {
                                    duration: 0
                                },
                            }}
                            datasetIdKey='id'
                            data={{
                                labels: chartDataGait[0],
                                datasets: datasetsGait
                            }}
                        />
                    </div>
                    <RehabilitationsRecord
                        recordId={2}
                    >
                    </RehabilitationsRecord>
                </>
            }
        </div>
    );
};

export default FullbodyRecordTable;
