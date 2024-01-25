import { useContext, useEffect, useState } from "react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto'
import { CHART_COLORS } from "../../../../constants/ChartColors";

const DystoniaRecordTable = ({ handleRecord, handleChartView, handleChartData }) => {
    const [record, setRecord] = useState({id: 0, data: []})
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
                    <table className="recordsTable">
                        <tr>
                            <th></th>
                            <th>Max</th>
                            <th>Avg</th>
                            <th>Med</th>
                            <th>0 - 14</th>
                            <th>15 - 29</th>
                            <th>30 - 44</th>
                            <th>45+</th>
                        </tr>
                        {record.data.map((param, i) => (
                            <tr key={i}>
                                <td><b>{param.Param}</b></td>
                                <td>{param.Avg}</td>
                                <td>{param.Med}</td>
                                <td>{param.v014}</td>
                                <td>{param.v1529}</td>
                                <td>{param.v3044}</td>
                                <td>{param.v45}</td>
                            </tr>
                        ))}
                    </table>

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

export default DystoniaRecordTable;
