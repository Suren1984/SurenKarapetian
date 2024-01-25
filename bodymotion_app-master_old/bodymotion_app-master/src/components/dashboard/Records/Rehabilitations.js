import { useContext, useEffect, useState } from "react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto'
import { Col, Row } from "reactstrap";
import Modal from 'react-modal'
import Image from "next/image";
import { CHART_COLORS } from "../../../../constants/ChartColors";
import { customStyles } from "../../../../constants/Config";
import { getGames } from "../../../../constants/Games";

const Rehabilitations = ({ data, selected, onChange, pilotAcademyArgument, onChangeArguments }) => {
    const [showModal, setShowModal] = useState(false)

    const games = getGames(data)

    useEffect(() => {
        console.log("DATA:")
        console.log(data.posture.vals.data);
    }, [])

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        if (checked) {
            onChange([...selected, name]);
        } else {
            onChange(selected.filter(item => item !== name));
        }
    }



    const handleLimitValueChange = (game, param, side, e) => {
        // check if the parameter is the main parameter (max limit)
        let isMain = false
        games.forEach(g => {
            g.params.forEach(parameter => {
                parameter.data.forEach(d => {
                    if (g.name == game && d.name === param && d.type === 'main') {
                        // param is main
                        isMain = true
                    }
                })
            })
        })
        isMain ? pilotAcademyArgument["Torso"][param.replace('Torso ', '')][side]["Value"]["Limit"] = parseInt(e.target.value)
            : pilotAcademyArgument["Torso"][param.replace('Torso ', '')][side]["Value"] = parseInt(e.target.value)
        onChangeArguments(pilotAcademyArgument)
    }


    return (
        <div style={{ marginTop: 30 }}>
            <Modal
                isOpen={showModal}
                onRequestClose={() => setShowModal(false)}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <Row>
                    <div style={{
                        display: 'flex', justifyContent: 'space-between', flexDirection: 'row', marginBottom: 20,
                        borderBottom: '1px solid #f0f0f0', paddingBottom: 10
                    }}>
                        <h2><i className="bi bi-plus-circle-fill"></i>&nbsp;Description</h2>
                        <span style={{ cursor: 'pointer' }} onClick={() => setShowModal(false)}><i className="bi bi-x-lg"></i> </span>
                    </div>
                </Row>
                <Row>
                    <p>This is description</p>
                </Row>
            </Modal>

            <div>
                {games.map((game, index) => {
                    return (
                        <Row key={index} className="align-items-center" style={{
                            backgroundColor: "#f8f8f8",
                            margin: 10,
                            borderRadius: 10,
                            padding: 20,
                        }}>
                            <Col lg={1}>
                                <div style={{ marginTop: 25 }}>
                                    <input
                                        type="checkbox"
                                        name={game.name}
                                        style={{ width: 20, height: 20 }}
                                        onChange={handleCheckboxChange} />
                                    <br></br>
                                    <span style={{ fontSize: 12 }}>Rounds:</span>
                                    <input type="number"
                                        min={1}
                                        max={10}
                                        defaultValue={1}
                                        style={{ width: 50 }}
                                    />
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div style={{ borderRadius: 10 }}>
                                    <h4>{game.name}</h4>
                                    <Image src={game.image}
                                        onClick={() => setShowModal(true)}
                                        alt="image" objectFit='contain'
                                        style={{ alignSelf: 'center', cursor: 'pointer', width: 250, height: 130, borderRadius: 10 }}></Image>
                                </div>
                            </Col>
                            <Col>
                                <table>
                                    {game.params.map((param, mainIndex) => {
                                        return (
                                            <>
                                                <tr>
                                                    <th></th>
                                                    <th colSpan={"2"} style={{ textAlign: 'center' }}>
                                                        {param.mode === 'leftright' ? 'Left' : 'Antero'}
                                                    </th>
                                                    <th></th>
                                                    <th colSpan={"2"} style={{ textAlign: 'center' }}>
                                                        {param.mode === 'leftright' ? 'Right' : 'Retro'}
                                                    </th>
                                                </tr>

                                                {param.data.map((d, index) => {
                                                    return (
                                                        <>
                                                            {(index == 0 || (param.data[index - 1] && param.data[index - 1].type == 'main')) &&
                                                                <tr>
                                                                    {d.type == 'main' ?
                                                                        <>
                                                                            <th></th>
                                                                            <th>Max</th>
                                                                            <th>Limit</th>
                                                                            <th></th>
                                                                            <th>Max</th>
                                                                            <th>Limit</th>
                                                                        </>
                                                                        :
                                                                        <>
                                                                            <th></th>
                                                                            <th>Tip</th>
                                                                            <th></th>
                                                                            <th></th>
                                                                            <th>Tip</th>
                                                                            <th></th>
                                                                        </>
                                                                    }
                                                                </tr>
                                                            }
                                                            <tr key={index}>
                                                                <td style={{ paddingRight: 10 }}>
                                                                    <span style={{ fontWeight: d.type == 'main' ? 'bold' : null }}>{d.name}</span>
                                                                </td>
                                                                <td>
                                                                    <input type="text"
                                                                        value={Math.abs(d.value1) + "°"}
                                                                        disabled={true}
                                                                        style={{ width: 40 }}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input type="number"
                                                                        style={{ width: 50 }}
                                                                        onChange={(e) => handleLimitValueChange(game.name, d.name, param.mode === 'leftright' ? 'Left' : 'Antero', e)}
                                                                    />
                                                                </td>
                                                                <td>&nbsp;&nbsp;&nbsp;</td>
                                                                <td>
                                                                    <input type="text"
                                                                        value={Math.abs(d.value2) + "°"}
                                                                        disabled={true}
                                                                        style={{ width: 40 }}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input type="number"
                                                                        style={{ width: 50 }}
                                                                        onChange={(e) => handleLimitValueChange(game.name, d.name, param.mode === 'leftright' ? 'Right' : 'Retro', e)}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        </>
                                                    )
                                                })
                                                }
                                                <br></br>
                                            </>
                                        )
                                    })}
                                </table>
                            </Col>
                        </Row>
                    )
                })}
            </div>
        </div >
    );
};

export default Rehabilitations;
