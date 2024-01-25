import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  ListGroup,
  CardSubtitle,
  ListGroupItem,
  Button,
  Row,
  Col,
  Spinner,
  FormGroup,
  Input,
  Label,
} from 'reactstrap';
import { useStopwatch } from 'react-timer-hook';
import { Decoder, Encoder, tools, Reader } from 'ts-ebml';
import WebSocketDemo from './Socket';
import { MotionTronicDataContext } from '../../../pages/dashboard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MODULES } from '../../../constants/Enums';
import { UserContext } from '../../../pages/_app';
import { BACKEND_URL, MAX_RECORDING_TIME } from '../../../constants/Config';
import Model from './Model/Model';
import NewPatientButton from './NewPatientButton';
import RefreshMotionButton from './RefreshMotionButton';
import Image from 'next/image';

const Controls = ({ handlePatient, handleDuration, handleRunning, handleMotionTronicData, handleModuleChange, changedStatus, handleRefresh, handleNewPatientModal }) => {
  const [motionTronicData, setMotionTronicData] = useContext(MotionTronicDataContext)
  const [message, setMessage] = useState("Waiting for first data")
  const [motionStatus, setMotionStatus] = useState("Closed")
  const [showMessage, setShowMessage] = useState(true)
  const [refClick, setRefClick] = useState(0) //callback doenst work with the same value, thats why we use increment

  const readAsArrayBuffer = function (blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(blob);
      reader.onloadend = () => { resolve(reader.result); };
      reader.onerror = (ev) => { reject(ev.error); };
    });
  }

  const injectMetadata = function (blob) {
    const decoder = new Decoder();
    const reader = new Reader();
    reader.logging = false;
    reader.drop_default_duration = false;

    readAsArrayBuffer(blob).then((buffer) => {
      const elms = decoder.decode(buffer);
      elms.forEach((elm) => { reader.read(elm); });
      reader.stop();

      var refinedMetadataBuf = tools.makeMetadataSeekable(
        reader.metadatas, reader.duration, reader.cues);
      var body = buffer.slice(reader.metadataSize);

      const result = new Blob([refinedMetadataBuf, body],
        { type: 'video/webm' });

      return result;
    });
  }


  const changedStatusMotion = (status) => {
    changedStatus(status)
    setMotionStatus(status)
  }


  // refresh motiontronic button clicked in dashboard
  useEffect(() => {
    setRefClick(refClick + 1)
    handleRefresh2()
  }, [handleRefresh])

  const handleRefresh2 = useCallback(
    () => {
      return refClick
    },
    [refClick]
  )


  const [spinePosition, setSpinePosition] = useState([10, 20, 30])

  const userData = useContext(UserContext);
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: false });

  const formatTime = (time) => {
    return String(time).padStart(2, '0')
  }

  const [patient, setPatient] = useState(null)
  const [allowStart, setAllowStart] = useState(false)
  const [allowClean, setAllowClean] = useState(false)
  const [image, setImage] = useState("iVBORw0KGgoAAAANSUhEUgAAB4AAAAQ4AQMAAADSHVMAAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAGUExURQAAAAAAAKVnuc8AAAABdFJOU/4a4wd9AAAED0lEQVR42u3PQQ0AAAgEIDf7V1ZfpjhoQG2WKWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYeHccIj+8AGdU9s1O0HsQgAAAABJRU5ErkJggg==")
  const [runningData, setRunningData] = useState([])
  const [module, setModule] = useState(MODULES.DYSTONIA)
  const [exporting, setExporting] = useState(false)
  const [distance, setDistance] = useState(0)
  const [shotJointsDistances, setShotJointsDistances] = useState(false)
  const [jointsDistances, setJointsDistances] = useState(null)
  const [note, setNote] = useState("")

  const handleShotJointsDistances = (json) => {
    setJointsDistances(
      {
        "sides":
        {
          "Shoulder - Elbow": {
            "left": getDistance(json.jointDatas[6].real, json.jointDatas[7].real) + "cm",
            "right": getDistance(json.jointDatas[12].real, json.jointDatas[13].real) + "cm"
          },
          "Elbow - Hand": {
            "left": getDistance(json.jointDatas[7].real, json.jointDatas[9].real) + "cm",
            "right": getDistance(json.jointDatas[13].real, json.jointDatas[15].real) + "cm"
          },
          "Hip - Knee": {
            "left": getDistance(json.jointDatas[17].real, json.jointDatas[18].real) + "cm",
            "right": getDistance(json.jointDatas[21].real, json.jointDatas[22].real) + "cm"
          },
          "Knee - Ankle": {
            "left": getDistance(json.jointDatas[18].real, json.jointDatas[19].real) + "cm",
            "right": getDistance(json.jointDatas[22].real, json.jointDatas[23].real) + "cm"
          },
        },
        "single":
        {
          "Shoulders": {
            "value": getDistance(json.jointDatas[6].real, json.jointDatas[12].real) + "cm",
          },
          "Hips": {
            "value": getDistance(json.jointDatas[17].real, json.jointDatas[21].real) + "cm",
          }
        }
      }
    )
  }


  // get distance between two joints in cm
  const getDistance = (joint1, joint2) => {
    return Math.round(Math.sqrt(Math.pow(joint1.X - joint2.X, 2) + Math.pow(joint1.Y - joint2.Y, 2) + Math.pow(joint1.Z - joint2.Z, 2))) / 10;
  }


  const handleDataFromMotionTronic = (data) => {
    if (data != "video_data") {
      let json = JSON.parse(data);
      setImage(json.image);
      let newJson = { jointDatas: json.jointDatas, isRunning: isRunning, date: json.date }
      if (json.jointDatas != null) {
        setSpinePosition(json.jointDatas[3].real);
        setDistance((json.jointDatas[3].real.Z / 1000).toFixed(2));
        if (shotJointsDistances) {
          if (!isConfidence(json)) {
            handleShotJointsDistances(json);
            setShotJointsDistances(false);
            let oneTimeJSON = { jointDatas: json.jointDatas, isRunning: true, date: json.date }
            setMotionTronicData(oneTimeJSON);
          } else {
            console.log("Confidence is here");
          }
        }
  
      }
      // console.log(newJson);
      if (isRunning) {
        setMotionTronicData(newJson);
        if (json.jointDatas != null) {
          setRunningData([...runningData, newJson]);
        }
      }
    }
    // handleMotionTronicData(json);
  }

  // on change spine position, update message
  useEffect(() => {



    setShowMessage(false);

    if (spinePosition.X > 300) {
      setMessage("Please move right")
      setShowMessage(true);
    }
    if (spinePosition.X < -300) {
      setMessage("Please move left")
      setShowMessage(true);
    }
    if (spinePosition.Y > 500) {
      setMessage("Please calibrate camera up")
      setShowMessage(true);
    }
    if (spinePosition.Y < -300) {
      setMessage("Please calibrate camera down")
      setShowMessage(true);
    }
    if (spinePosition.Z > 5000) {
      setMessage("Patient is too far from the camera")
      setShowMessage(true);
    }
    if (spinePosition.Z < 1500) {
      setMessage("Patient is too close to the camera. Please move backwards")
      setShowMessage(true);
    }
  }, [spinePosition])

  useEffect(() => {
    setPatient(handlePatient())
  }, [handlePatient])

  useEffect(() => {
    setModule(handleModuleChange())
  }, [handleModuleChange])

  useEffect(() => {
    if (patient != null)
      setAllowStart(true);
  }, [patient])

  const startTimer = () => {
    if (allowStart) {
      clearData()
       setAllowStart(false)
       setAllowClean(false)
       reset()
       start()
       try {
         handleStartCaptureClick();
       } catch (ee) {
   
       }

    } else {
      toast.error("Please create or select a patient in order to run diagnostics")
    }
  }

  const stopTimer = () => {
    if (isRunning) {
      pause()
      handleDuration(50)
      handleRunning(false)
      setAllowStart(true);
      /* try {
         handleStopCaptureClick();
       } catch (ec) {
   
       }*/
      setAllowClean(true);
      toast.success("Data recorded successfully. To save them click on the Export button in the Control panel")
    }
  }

  const clearData = () => {
    if (allowClean) {
      reset()
      pause();
      setAllowClean(false);
      setRunningData([]);
    }
  }

  const isConfidence = (json) => {
    let joints = ["Head", "Neck", "LeftShoulder", "RightShoulder", "LeftElbow", "RightElbow", "LeftWrist", "RightWrist", "LeftHip", "RightHip", "LeftKnee", "RightKnee", "LeftAnkle", "RightAnkle"];
    if (json.jointDatas != null) {
      for (let i = 1; i < json.jointDatas.length; i++) {
        //if json.jointDatas[i].type is in joints
        if (joints.includes(json.jointDatas[i].type) && json.jointDatas[i].confidence < 0.5) {
          console.log("CONFIDENCE: " + json.jointDatas[i].type)
          return true;
        }
      }
    }
    return false;
  }

  const exportData = async () => {
    setExporting(true);
    const response = await fetch(BACKEND_URL + '/patients/' + patient.id + '/records', {
      method: 'POST',
      headers: new Headers({
        'Authorization': 'Bearer ' + userData.token,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        module: module,
        note: note,
        data: JSON.stringify(runningData)
      })
    });
    if (response.status == 200) {
      toast.success("Data successfully exported!")
      setNote("");
      setExporting(false);
      clearData();
    } else {
      toast.success("Error while exporting data")
      console.log(response.status);
    }
    setExporting(false);
  }

  // stop recording after certain seconds automatically
  useEffect(() => {
    if (seconds == MAX_RECORDING_TIME)
      stopTimer();
  }, [seconds])

  const handleUpdateJointsDistancesClick = async () => {
    let jsonString = JSON.stringify(jointsDistances);
    const response = await fetch(BACKEND_URL + '/patients/' + patient.id, {
      method: 'PUT',
      body: JSON.stringify({
        joints_distances: jsonString
      }),
      headers: new Headers({
        'Authorization': 'Bearer ' + userData.token,
        'Content-Type': 'application/json',
      })
    });
    if (response.status == 204) {
      setJointsDistances(null)
      toast.success("Joints distances successfully updated!")
    } else {
      toast.error("Error while updating joints distances")
    }
  }

  return (
    <div>
      <Row>
        <Col lg="4">
          <Card>
            <CardBody>
              <CardTitle tag="h5">Controls</CardTitle>
              <CardSubtitle className="mb-2 text-muted" tag="h6">
              </CardSubtitle>


              <NewPatientButton handleModal={(value) => { handleNewPatientModal(value) }} />
              <RefreshMotionButton handleRefresh={() => { handleRefresh() }} />
              <div style={{ marginTop: 30, fontSize: 16 }}>
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
                    <span>MotionTronic {motionStatus}</span>
                  </div>
                }

              </div>

              {!allowClean ?
                <>
                  {!isRunning ?
                    <div className={allowStart ? 'control-btns' : 'control-btns-disabled'} style={{ marginTop: 80 }} onClick={() => startTimer()}>
                      <span style={{ color: '#fff' }}><i className="bi bi-play-fill"></i>&nbsp;Run</span>
                    </div>
                    :
                    <div className={isRunning == true ? 'control-btns' : 'control-btns-disabled'} style={{ marginTop: 80 }} onClick={() => stopTimer()}>
                      <span style={{ color: '#fff' }}><i className="bi bi-stop-fill"></i>&nbsp;Stop</span>
                    </div>
                  }
                </>
                :
                <>
                  {!exporting ?
                    <>
                      <p style={{ textAlign: 'center', padding: 10, marginTop: 43, backgroundColor: '#F8F8F8', borderRadius: 15 }}><i className="bi bi-check-lg"></i>
                        &nbsp;Diagnostic successfull. Please choose the next action:</p>
                        <input type="text" placeholder="Note (optional)" className='form-control' style={{ width: '100%', marginTop: 10 }} onChange={e => setNote(e.target.value)}></input>

                      <div className='control-btns' style={{ marginTop: 20 }} onClick={() => exportData()}>
                        <span style={{ color: '#fff' }}><i className="bi bi-cloud-upload-fill"></i>&nbsp;Export data to the Cloud</span>
                      </div>
                      <div className='control-btns' onClick={() => startTimer()}>
                        <span style={{ color: '#fff' }}><i className="bi bi-arrow-clockwise"></i>&nbsp;Start again</span>
                      </div>
                    </>
                    :
                    <>
                      <div style={{ display: 'flex', width: '100%', justifyContent: 'center', height: 150 }}>
                        <Spinner style={{ margin: 20, alignSelf: 'center' }}></Spinner>
                      </div>
                      <p style={{ textAlign: 'center', padding: 10, marginTop: 0, backgroundColor: '#F8F8F8', borderRadius: 15 }}><i className="bi bi-cloud-arrow-up-fill"></i>
                        &nbsp;Exporting data...</p>
                    </>
                  }
                </>
              }

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '40px',
                  display: "inline-block",
                  backgroundColor: "#f7f7f7",
                  marginTop: 30,
                  marginBottom: 38,
                  padding: 10,
                  borderRadius: 15
                }}>
                  <span>{formatTime(minutes)}</span>:<span>{formatTime(seconds)}</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg="8">
          <Card className={isRunning && "red-bg"} style={{ height: 420 }}>
            <span style={{ position: 'absolute', zIndex: 100, color: '#fff', margin: 25 }}>Display</span>
            <span style={{ position: 'absolute', zIndex: 100, color: '#fff', margin: 25, right: 0 }}>Distance: {distance}m</span>
            {patient != null &&
              <Button
                color="primary"
                onClick={() => { setShotJointsDistances(true) }}
                style={{ fontSize: 13, position: 'absolute', zIndex: 100, color: '#fff', margin: 25, right: 0, marginTop: 60 }}>
                Shot {shotJointsDistances && <Spinner size="sm" style={{ marginLeft: 10 }}></Spinner>}
              </Button>
            }
            {jointsDistances &&
              <>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 10, fontSize: 13, position: 'absolute', zIndex: 100, color: '#fff', margin: 25, right: 0, marginTop: 100 }}>
                  <table style={{ borderCollapse: 'separate', borderSpacing: '10px 0px' }}>
                    <tr>
                      <th>Joint</th>
                      <th>Left</th>
                      <th>Right</th>
                    </tr>
                    {
                      Object.keys(jointsDistances.sides).map((key, index) => {
                        return (
                          <tr key={index}>
                            <td>{key}</td>
                            <td>{jointsDistances.sides[key].left}</td>
                            <td>{jointsDistances.sides[key].right}</td>
                          </tr>
                        )
                      })
                    }
                  </table>
                  <table style={{ marginTop: 20, borderCollapse: 'separate', borderSpacing: '10px 0px' }}>
                    <tr>
                      <th>Joint</th>
                      <th>Value</th>
                    </tr>
                    {
                      Object.keys(jointsDistances.single).map((key, index) => {
                        return (
                          <tr key={index}>
                            <td>{key}</td>
                            <td>{jointsDistances.single[key].value}</td>
                          </tr>
                        )
                      })
                    }
                  </table>
                </div>
                <Button
                  color="primary"
                  onClick={() => { handleUpdateJointsDistancesClick() }}
                  style={{ fontSize: 13, position: 'absolute', zIndex: 100, color: '#fff', marginRight: 50, right: 0, marginTop: 250 }}>
                  OK
                </Button>
              </>
            }
            <WebSocketDemo
              handleDataFromMotionTronic={(data) => { handleDataFromMotionTronic(data) }}
              changedStatusMotion={(data) => { changedStatusMotion(data) }}
              handleRefresh2={handleRefresh2}
            />

            <CardBody>
              {image != null ?
                <div style={{ backgroundColor: '#000', width: '100%', textAlign: 'center' }}>
                  <Image src={'data:image/png;base64,' + image} height={390} width={600} alt="Img"></Image>
                </div>
                :
                <Model></Model>
              }

              {/*showMessage &&
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}>
                  <div style={{
                    position: 'absolute',
                    display: 'flex',
                    borderRadius: 20,
                    marginTop: -100,
                    width: '90%',
                    alignSelf: 'center',
                    alignContent: 'center',
                    justifyContent: 'center',
                    height: 80,
                    backgroundColor: 'rgba(255,255,255,0.3)'
                  }}>
                    <span style={{
                      textAlign: 'center',
                      lineHeight: '80px',
                      verticalAlign: 'middle',
                      color: '#fff'
                    }}>{message}</span>
                  </div>
                </div>
              }
            */}

            </CardBody>
          </Card>
        </Col>
      </Row>
      <ToastContainer />
    </div >

  );
};

export default Controls;
