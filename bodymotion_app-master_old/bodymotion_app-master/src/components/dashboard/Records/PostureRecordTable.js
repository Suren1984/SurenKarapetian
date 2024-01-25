import { useContext, useEffect, useState } from "react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto'
import { Col, Row } from "reactstrap";
import { CHART_COLORS } from "../../../../constants/ChartColors";

const PostureRecordTable = ({ handleRecord, handleChartView, handleChartData }) => {
    const [record, setRecord] = useState({ id: 0, data: { leftSide: [], rightSide: [], single: [] } })
    const [chartView, setChartView] = useState(false)
    const [chartData, setChartData] = useState([])
    const [datasets, setDatasets] = useState([])

    useEffect(() => {
        setRecord(handleRecord())
    }, [handleRecord])

    useEffect(() => {
        setChartView(handleChartView())
    }, [handleChartView])

    useEffect(() => {
        setChartData(handleChartData())
    }, [handleChartData])

    useEffect(() => {
        let arr = [];
        if (chartData.length > 0) {
            chartData[1].forEach((dataset, index) => {
                let json = {
                    label: dataset.param,
                    data: dataset.data,
                    borderColor: CHART_COLORS[index],
                    backgroundColor: CHART_COLORS[index]
                }
                arr.push(json);
            });
            setDatasets(arr);
        }
    }, [chartData])

    return (
        <div>
            {!chartView ?
                <div style={{ marginTop: 30 }}>
                    <Row>
                        <Col lg="6">
                            <table className="recordsTable">
                                <h5>Left side</h5>
                                <tr>
                                    <th></th>
                                    <th>Min</th>
                                    <th>Max</th>
                                    <th>Avg</th>
                                </tr>
                                {record.data.leftSide.map((param, i) => (
                                    <tr key={i}>
                                        <td><b>{param.Param}</b></td>
                                        <td>{param.Min}</td>
                                        <td>{param.Max}</td>
                                        <td>{param.Avg}</td>
                                    </tr>
                                ))}
                            </table>
                        </Col>
                        <Col lg="6">
                            <table className="recordsTable">
                                <h5>Right side</h5>
                                <tr>
                                    <th></th>
                                    <th>Min</th>
                                    <th>Max</th>
                                    <th>Avg</th>
                                </tr>
                                {record.data.rightSide.map((param, i) => (
                                    <tr key={i}>
                                        <td><b>{param.Param}</b></td>
                                        <td>{param.Min}</td>
                                        <td>{param.Max}</td>
                                        <td>{param.Avg}</td>
                                    </tr>
                                ))}
                            </table>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="12">
                            <table className="recordsTable">
                                <tr>
                                    <th></th>
                                    <th>Min</th>
                                    <th>Max</th>
                                    <th>Avg</th>
                                </tr>
                                {record.data.single.map((param, i) => (
                                    <tr key={i}>
                                        <td><b>{param.Param}</b></td>
                                        <td>{param.Min}</td>
                                        <td>{param.Max}</td>
                                        <td>{param.Avg}</td>
                                    </tr>
                                ))}
                            </table>
                        </Col>
                    </Row>

                </div>
                :
                <div style={{ marginTop: 30 }}>
                    <Line
                        options={{
                            animation: {
                                duration: 0
                            }
                        }}
                        datasetIdKey='id'
                        data={{
                            labels: chartData[0],
                            datasets: datasets
                        }}
                    />
                </div>
            }
        </div>
    );
};

export default PostureRecordTable;
