import Head from "next/head";
import { useRouter } from "next/router";
import React from 'react';
import { Row, Col, Card, CardBody, CardTitle, CardSubtitle, Button, ButtonGroup, Input, Spinner } from "reactstrap";
import { MAIN_TOKEN, BACKEND_URL } from "../../../constants/Config";
import { MODULES } from "../../../constants/Enums";
import DiagnosticsData from "../../../src/components/dashboard/DiagnostcsData";
import ModuleCard from "../../../src/components/dashboard/ModuleCard";
import NewPatientButton from "../../../src/components/dashboard/NewPatientButton";
import SelectPatientList from "../../../src/components/dashboard/SelectPatientList";
import { useContext, useState, useEffect, useCallback } from "react";
import { UserContext } from "../../_app";
import Moment from "moment";
import DystoniaRecordTable from "../../../src/components/dashboard/Records/DystoniaRecordTable";
import PostureRecordTable from "../../../src/components/dashboard/Records/PostureRecordTable";
import FullbodyRecordTable from "../../../src/components/dashboard/Records/FullbodyRecordTable";
import Rehabilitations from "../../../src/components/dashboard/Records/Rehabilitations";
import { PilotAcademyArgument } from "../../../constants/UnityArguments";
import EditPatientModal from "../../../src/components/dashboard/EditPatientModal";

function PatientsRecords() {
  const router = useRouter();
  const { param } = router.query;

  const userData = useContext(UserContext);
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([])
  const [module, setModule] = useState(MODULES.FULLBODY)
  const [loading, setLoading] = useState(false)
  const [record, setRecord] = useState(null)
  const [chartView, setChartView] = useState(false)
  const [chartData, setChartData] = useState([])
  const [dataLoading, setDataLoading] = useState(false)
  const [recordId, setRecordId] = useState(null)
  const [selectedRehabs, setSelectedRehabs] = useState([])
  const [pilotAcademyArgument, setPilotAcademyArgument] = useState()
  const [showPatientEditModal, setShowPatientEditModal] = useState(false)

  const changePatient = async (patient) => {
    setLoading(true);
    setPatient(patient)
    const response = await fetch(BACKEND_URL + '/patients/' + patient.id + '/records/' + module, {
      method: 'GET',
      headers: new Headers({
        'Authorization': 'Bearer ' + userData.token,
        'Content-Type': 'application/json',
      })
    });
    if (response.status == 200) {
      let json = await response.json();
      setRecords(json);
      console.log(json[0]);
      if (json.length > 0)
        getRecord(json[0].id)
    } else {
      console.log("Error");
    }
    setLoading(false)
  }


  const handleDeleteRecord = async (id) => {
    setLoading(true);
    const response = await fetch(BACKEND_URL + '/records/' + id, {
      method: 'DELETE',
      headers: new Headers({
        'Authorization': 'Bearer ' + userData.token,
        'Content-Type': 'application/json',
      }),
    });
    if (response.status == 204) {
      setLoading(false);
      changePatient(patient);
    } else {
      console.log(response.status);
    }
    setLoading(false);
  }

  const handleModuleChange = (module) => {
    setRecord(null)
    setModule(module);
  }

  useEffect(() => {
    if (patient != null)
      changePatient(patient)
  }, [module])

  const changedPatientRecordDate = (id) => {
    getRecord(id)
  }

  const handleRecord = useCallback(() => {
    return record;
  }, [record])


  const handleChartView = useCallback(() => {
    return chartView;
  }, [chartView])

  const handleChartData = useCallback(() => {
    return chartData;
  }, [chartData])

  const getRecord = async (id) => {
    setSelectedRehabs([])
    setRecordId(id);
    setRecord(null);
    setDataLoading(true);
    let response = await fetch(BACKEND_URL + '/records/' + id + '/' + module + '/table', {
      method: 'GET',
      headers: new Headers({
        'Authorization': 'Bearer ' + userData.token,
        'Content-Type': 'application/json',
      }),
    });
    if (response.status == 200) {
      let json = await response.json();
      setRecord(json)
      setPilotAcademyArgument(PilotAcademyArgument(json));
    } else {
      setRecord(null)
      console.log(response.status);
    }

    //chart data
    response = await fetch(BACKEND_URL + '/records/' + id + '/' + module + '/chart', {
      method: 'GET',
      headers: new Headers({
        'Authorization': 'Bearer ' + userData.token,
        'Content-Type': 'application/json',
      }),
    });
    if (response.status == 200) {
      let json = await response.json();
      console.log(json);
      setChartData(json)
    } else {
      console.log(response.status);
      setChartData([])
    }
    setDataLoading(false);
  }

  const handleStartRehab = () => {
    let mess = JSON.stringify(pilotAcademyArgument) + "|" + recordId
    console.log(mess);
    window.chrome.webview.postMessage(mess);
  }

  const handleRehabSelected = (rehab) => {
    setSelectedRehabs(rehab)
  }

  // if record loaded
  //if (record != null) {

  // }

  const handleUnityArgumentChange = (argument) => {
    setPilotAcademyArgument(argument)
    console.log(argument)
  }

  const handlePatientEditChanged = () => {
    setShowPatientEditModal(false)
    changePatient(patient)
    console.log(patient);
  }

  return (
    <div>
      {patient != null &&
        <EditPatientModal
          patient={patient}
          displayModal={showPatientEditModal}
          changedPatient={handlePatientEditChanged}
        ></EditPatientModal>
      }
      <Head>
        <title>BodyMotion Dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div>
        {/*<Row>
          <Col lg="6" sm="6">
            <ModuleCard selected={module} handleModuleChange={handleModuleChange} />
          </Col>
        </Row>
  */}
        <Row>
          <Col lg="4" sm="4">
            <Card>
              <CardBody>
                <SelectPatientList changePatient={changePatient} showTitle={true}/>
              </CardBody>
            </Card>
          </Col>
          <Col lg="8" sm="8">
            <Card>
              <CardBody>
                <CardTitle tag="h5">
                  {param == 'rehabilitation' ?
                    <>
                      Rehabilitation
                    </>
                    :
                    <>
                      Patient records
                    </>
                  }
                </CardTitle>
                <CardSubtitle className="mb-2 text-muted" tag="h6">
                </CardSubtitle>
                {!loading && !dataLoading ?
                  <div>
                    {patient != null && records.length > 0 && record != null ?
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', marginTop: 30, alignItems: 'center' }}>
                          <Input
                            id="exampleSelect"
                            name="select"
                            style={{ maxWidth: 160 }}
                            type="select"
                            value={recordId}
                            onChange={(e) => changedPatientRecordDate(e.target.value)}
                            size="sm"
                          >

                            {records.map((record_in_list) => (
                              <option key={record_in_list.id} value={record_in_list.id} selected={recordId == record_in_list.id ? true : false}>
                                {Moment(record_in_list.created_at).format("DD. MM. YYYY HH:mm")} {record_in_list.note != undefined ? "- " + record_in_list.note : null}
                              </option>
                            ))}
                          </Input>
                          <span>
                            <b><i className="bi bi-person-fill"></i>&nbsp;{record.id} Name: </b>{patient.first_name} {patient.surname}
                          </span>
                          <span>
                            <b>Birth: </b>{patient.since}
                          </span>
                          <span style={{ textTransform: 'capitalize' }}>
                            {patient.gender + " / " + patient.height + "cm / " + patient.weight + "kg"}
                          </span>
                          {param != 'rehabilitation' ?
                            <>
                              <ButtonGroup>
                                <Button
                                  active={!chartView && "true"}
                                  color="primary"
                                  onClick={() => setChartView(false)}
                                >
                                  <i className="bi bi-table"></i>&nbsp;Table
                                </Button>
                                <Button
                                  active={chartView && "true"}
                                  color="primary"
                                  onClick={() => setChartView(true)}
                                >
                                  <i className="bi bi-graph-up"></i>&nbsp;Chart
                                </Button>
                              </ButtonGroup>
                              <a href={
                                "https://bodymotion.sensohealthserver.com/excel/" + (module == MODULES.FULLBODY ? record.posture.vals.id : record.id)
                              }>
                                <Button
                                  color="dark"
                                  size="sm"
                                  outline
                                >
                                  <i className="bi bi-file-earmark-excel-fill" style={{ fontSize: 14 }}></i>&nbsp;XLS
                                </Button>
                              </a>
                              <div>
                                <Button
                                  color="dark"
                                  size="sm"
                                  onClick={() => setShowPatientEditModal(true)}
                                  outline
                                >
                                  <i className="bi bi-pencil" style={{ fontSize: 14 }}></i>
                                </Button>
                              </div>
                              <div>
                                <Button
                                  color="dark"
                                  size="sm"
                                  onClick={() => handleDeleteRecord(record.id)}
                                  outline
                                >
                                  <i className="bi bi-trash-fill" style={{ fontSize: 14 }}></i>
                                </Button>
                              </div>
                            </>
                            :
                            <>
                              <Button
                                color="primary"
                                size="sm"
                                disabled={selectedRehabs != null && selectedRehabs.length > 0 ? false : true}
                                onClick={handleStartRehab}
                              >
                                <i className="bi bi-play" style={{ fontSize: 14 }}></i>&nbsp;Start
                              </Button>
                            </>
                          }
                        </div>
                
                        {param != 'rehabilitation' ?
                          <>
                            {record != null &&
                              <>
                                {module == "dystonia" &&
                                  <DystoniaRecordTable
                                    handleRecord={handleRecord}
                                    handleChartView={handleChartView}
                                    handleChartData={handleChartData}
                                  />
                                }
                                {(module == "posture" || module == "gait") &&
                                  <PostureRecordTable
                                    handleRecord={handleRecord}
                                    handleChartView={handleChartView}
                                    handleChartData={handleChartData}
                                  />
                                }
                                {module == "fullbody" &&
                                  <FullbodyRecordTable
                                    handleRecord={handleRecord}
                                    handleChartView={handleChartView}
                                    handleChartData={handleChartData}
                                    recordId={recordId}
                                  />
                                }
                              </>
                            }
                          </>
                          :
                          <>
                            <Rehabilitations
                              data={record}
                              selected={selectedRehabs}
                              onChange={handleRehabSelected}
                              pilotAcademyArgument={pilotAcademyArgument}
                              onChangeArguments={handleUnityArgumentChange}
                            />
                          </>
                        }
                      </div>
                      :
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 350, flexDirection: 'column' }}>
                        <i className="bi bi-cloudy-fill" style={{ marginBottom: 0, fontSize: 50 }}></i>
                        {patient == null ?
                          <span>No patient selected. Please select a patient from the list on the left</span>
                          :
                          <span>No records found</span>
                        }
                      </div>

                    }
                  </div>
                  :
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'center', height: 350 }}>
                    <Spinner style={{ margin: 50, alignSelf: 'center' }}></Spinner>
                  </div>
                }
              </CardBody>
            </Card>
          </Col>
        </Row>

      </div>
    </div >
  );
}

export default PatientsRecords