import Head from "next/head";
import { Col, Row, ModalHeader, ModalBody, Button, ModalFooter } from "reactstrap";
import Controls from "../../src/components/dashboard/Controls";
import { useEffect, useState, useCallback, createContext } from "react";
import React from 'react';
import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { MAIN_TOKEN, BACKEND_URL, customStyles } from "../../constants/Config";
import ModuleCard from './../../src/components/dashboard/ModuleCard';
import { MODULES } from './../../constants/Enums';
import NewPatientButton from './../../src/components/dashboard/NewPatientButton';
import RefreshMotionButton from './../../src/components/dashboard/RefreshMotionButton';
import DiagnosticsData from './../../src/components/dashboard/DiagnostcsData';
import Modal from 'react-modal';
import { Card, CardBody, CardSubtitle, CardTitle, Form, FormGroup, Label, Input, FormText, Spinner } from "reactstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SelectPatientList from "../../src/components/dashboard/SelectPatientList";
import { getCookie } from 'cookies-next';

export const MotionTronicDataContext = createContext();

function Home(props) {
  const [showModal, setShowModal] = useState(false)
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("")
  const [since, setSince] = useState("")
  const [weight, setWeight] = useState(0)
  const [height, setHeight] = useState(0)
  const [gender, setGender] = useState("female")
  const [loadingNewPatient, setLoadingNewPatient] = useState(false)
  const [patient, setPatient] = useState(null)
  const motionTronicData = useState({ image: "test" })
  const [module, setModule] = useState(MODULES.FULLBODY)
  const [motionTronicDataArray, setMotionTronicDataArray] = useState([])
  const [moduleChanging, setModuleChanging] = useState(false)
  const [running, setRunning] = useState(false)
  const [motionStatus, setMotionStatus] = useState("Connecting")
  const [refClick, setRefClick] = useState(0)

  const handleModal = (value) => {
    setShowModal(value);
  }

  function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  const moduleChangingHandler = async () => {
    setModuleChanging(true);
    await delay(200);
    setModuleChanging(false);
  }

  // Just for an effect when user change a module
  useEffect(() => {
    moduleChangingHandler();
  }, [module])

  const handlePatient = useCallback(() => {
    return patient;
  }, [patient])

  const handleModuleChangeCallback = useCallback(() => {
    return module;
  }, [module])

  const changedStatus = (status) => {
    setMotionStatus(status);
  }

  useEffect(() => {
    const cookie = getCookie("token");

    //const cookie = getCookie("OursiteJWT");
    // var jwt = require('jsonwebtoken');
    // var decoded = jwt.verify(cookie, MAIN_TOKEN)
    const handleCookie = async () => {
      // const { payload } = await jwtVerify(cookie, new TextEncoder().encode(MAIN_TOKEN));
      // setToken(localStorage.getItem("token"));
    }
    //handleCookie();
    setToken(cookie);


    //ip param
    const urlParams = new URLSearchParams(window.location.search);
    const ip = urlParams.get('ip');
    console.log(ip);
    if (ip != null && ip.length > 5)
      document.cookie = `ip=` + ip + `; path=/`;
  }, [])

  // create a new patient
  const handleSubmitNewPatient = async (e) => {
    e.preventDefault();
    setLoadingNewPatient(true);
    if (name.length > 1 && surname.length > 1 && since > 1900) {
      const response = await fetch(BACKEND_URL + '/patients', {
        method: 'POST',
        headers: new Headers({
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          first_name: name,
          surname: surname,
          since: since,
          weight: weight,
          height: height,
          gender: gender,
          phoneotype: "phoneotype"
        })
      });
      if (response.status == 200) {
        let json = await response.json();
        setPatient(json);
        toast.success("Patient successfully created")
        setShowModal(false);
      } else {
        console.log(response.status)
        toast.error("Error while creating the patient. Try it again")
      }
    } else {
      toast.error("Please check your inputs")
    }
    setLoadingNewPatient(false);
  }

  const changePatient = (patient) => {
    setPatient(patient)
    setShowModal(false);
  }

  // clicked refresh motiontronic button
  const handleRefresh = () => {
    try{
      window.chrome.webview.postMessage("refresh");
    }catch(e){
      window.location.reload();
    }
    //window.location.reload();
  }

  const handleModuleChange = (module) => {
    setModule(module);
    console.log(module);
  }

  const handleData = (data) => {
    setData(data)
  }

  const handleRunning = (running) => {
    setRunning(running)
  }

  const handleDuration = (duration) => {
    //setDuration(duration)
  }

  /*  // handle data from MotionTronic
   const handleMotionTronicData = (motionTronicData) => {
     //setMotionTronicDataArray([...motionTronicDataArray, motionTronicData]);
   } */

  return (
    <div>
      <Head>
        <title>BodyMotion Dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div>
        {/*
        <Row>
          <Col lg="7" sm="7">
            <ModuleCard selected={MODULES.FULLBODY} handleModuleChange={handleModuleChange} />
          </Col>

          <Col lg="5" sm="5">
            <NewPatientButton handleModal={(value) => { handleModal(value) }} />
            <RefreshMotionButton handleRefresh={() => { handleRefresh() }} />
            <div style={{ width: '300px', alignContent: 'end', float: 'right' }}>
              {patient != null ?
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div style={{ backgroundColor: "#008000", width: 20, height: 20, borderRadius: 10, marginRight: 10 }}></div>
                  <span><b>Patient: </b> {patient.first_name} {patient.surname}</span>
                </div>
                :
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div style={{ backgroundColor: "#dc3545", width: 20, height: 20, borderRadius: 10, marginRight: 10 }}></div>
                  <span>Patient not selected</span>
                </div>
              }
              {motionStatus == "Open" ?
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div style={{ backgroundColor: "#008000", width: 20, height: 20, borderRadius: 10, marginRight: 10 }}></div>
                  <span>MotionTronic connected</span>
                </div>
                :
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div style={{ backgroundColor: "#dc3545", width: 20, height: 20, borderRadius: 10, marginRight: 10 }}></div>
                  <span>MotionTronic status: {motionStatus}</span>
                </div>
              }


            </div>
          </Col>
        </Row>
  */}
        {!moduleChanging ?

          <MotionTronicDataContext.Provider value={motionTronicData}>
            <Row>
              <Controls
                handlePatient={handlePatient}
                handleRunning={handleRunning}
                handleDuration={handleDuration}
                handleModuleChange={handleModuleChangeCallback}
                changedStatus={changedStatus}
                handleRefresh={handleRefresh}
                handleNewPatientModal={handleModal}
              />

              <DiagnosticsData handleModuleChange={handleModuleChangeCallback} />


            </Row>
          </MotionTronicDataContext.Provider>
          :
          <div style={{ display: 'flex', width: '100%', justifyContent: 'center', height: 350 }}>
            <Spinner style={{ margin: 50, alignSelf: 'center' }}></Spinner>
          </div>
        }

      </div>


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
            <h2><i className="bi bi-plus-circle-fill"></i>&nbsp;New patient</h2>
            <span style={{ cursor: 'pointer' }} onClick={() => setShowModal(false)}><i className="bi bi-x-lg"></i> </span>
          </div>
        </Row>

        <Row>
          <Col sm="6">
            <h4 style={{ textAlign: 'center' }}>New Patient</h4>
            <Form onSubmit={handleSubmitNewPatient}>
              <FormGroup>
                <Label for="exampleEmail">
                  Firstname
                </Label>
                <Input
                  id="exampleEmail"
                  name="firstname"
                  placeholder="Firstname"
                  type="text"
                  onChange={e => { setName(e.target.value) }}
                />
              </FormGroup>
              <FormGroup>
                <Label for="exampleEmail">
                  Surname
                </Label>
                <Input
                  id="exampleEmail"
                  name="surname"
                  placeholder="Surname"
                  type="text"
                  onChange={e => { setSurname(e.target.value) }}
                />
              </FormGroup>
              <FormGroup>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <div style={{ flexDirection: 'column', width: '30%' }}>
                    <Label for="examplePassword">
                      Birth year
                    </Label>
                    <Input
                      id="examplePassword"
                      name="password"
                      placeholder="Birth year"
                      type="number"
                      onChange={e => { setSince(e.target.value) }}
                    />
                  </div>
                  <div style={{ flexDirection: 'column', width: '30%' }}>
                    <Label for="examplePassword">
                      Height
                    </Label>
                    <Input
                      id="examplePassword"
                      name="password"
                      placeholder="cm"
                      type="number"
                      onChange={e => { setHeight(e.target.value) }}
                    />
                  </div>
                  <div style={{ flexDirection: 'column', width: '30%' }}>
                    <Label for="examplePassword">
                      Weight
                    </Label>
                    <Input
                      id="examplePassword"
                      name="password"
                      placeholder="kg"
                      type="number"
                      onChange={e => { setWeight(e.target.value) }}
                    />
                  </div>
                </div>
              </FormGroup>
              <FormGroup onChange={(e) => setGender(e.target.value)}>
                <Input type="radio" id="womanRadio" name="radio1" value={"female"} checked={gender === "female"}></Input>
                <Label for="womanRadio" style={{marginLeft: 5}}> Female</Label>
                <Input type="radio" id="manRadio" name="radio1" value={"male"} style={{marginLeft: 20}} checked={gender === "male"}></Input>
                <Label for="manRadio" style={{marginLeft: 5}}> Male</Label>
              </FormGroup>

              {loadingNewPatient ?
                <Spinner>
                  Loading...
                </Spinner>
                :
                <Button>
                  Submit
                </Button>
              }
            </Form>
          </Col>
          <Col sm="6" align="center">
            <h4>Select an existing patient</h4>
            <SelectPatientList changePatient={changePatient} />
          </Col>
        </Row>


      </Modal>

      <ToastContainer />

    </div >
  );
}

export default Home