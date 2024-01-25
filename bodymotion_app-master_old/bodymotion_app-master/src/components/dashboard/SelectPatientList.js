import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
    Card,
    CardBody,
    CardTitle,
    ListGroup,
    CardSubtitle,
    FormGroup,
    Input,
    Label,
    ListGroupItem,
    Button,
    Row,
    Col,
    Spinner
} from 'reactstrap';
import Image from "next/image";
import user from "../../assets/images/users/user.png";
import { UserContext } from '../../../pages/_app';
import { BACKEND_URL } from '../../../constants/Config';
import Moment from 'moment'
import { isNull } from 'tls';

const SelectPatientList = ({ changePatient, showTitle }) => {
    const userData = useContext(UserContext);
    const [patient, setPatient] = useState(null)
    const [patients, setPatients] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [selectedDoctor, setSelectedDoctor] = useState(null)
    const [allDoctors, setAllDoctors] = useState([])

    const getAllPatients = useCallback(async () => {
        let doctorId = isNull(selectedDoctor) ? userData.id : selectedDoctor.id
        const response = await fetch(BACKEND_URL + '/patients?name=' + search + "&doctor_id=" + doctorId, {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + userData.token,
                'Content-Type': 'application/json',
            }),
        });
        if (response.status == 200) {
            console.log(userData?.id)
            setPatients(await response.json())
        } else {
            console.log(response.status);
        }
        setLoading(false);
    }, [search, selectedDoctor, userData])

    useEffect(() => {
        getAllPatients()
    }, [getAllPatients, selectedDoctor])


    const getAllDoctors = async () => {
        const response = await fetch(BACKEND_URL + '/doctors', {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + userData.token,
                'Content-Type': 'application/json',
            }),
        });
        if (response.status == 200) {
            setAllDoctors(await response.json())
        } else {
            console.log(response.status);
        }
    }


    const handlePatientClick = (patient) => {
        setPatient(patient);
        changePatient(patient);
    }

    const handleChangeSearch = (value) => {
        setSearch(value);
        console.log(patients)
        patients.filter((patient) => patient.first_name.toLowerCase().includes(value.toLowerCase() || patient.surname.toLowerCase().includes(value.toLowerCase())))
    }

    const handleDeletePatient = async (id) => {
        setLoading(true);
        const response = await fetch(BACKEND_URL + '/patients/' + id, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': 'Bearer ' + userData.token,
                'Content-Type': 'application/json',
            }),
        });
        if (response.status == 204) {
            setLoading(false);
            getAllPatients();
        } else {
            console.log(response.status);
        }
        setLoading(false);
    }

    const changeSelectedDoctor = (id) => {
        setSelectedDoctor(allDoctors.find((doctor) => doctor.id == id))
    }

    useEffect(() => {
        if (userData?.is_admin) {
            setSelectedDoctor(userData)
            getAllDoctors()
        }
    }, [])

    return (
        <>
            <CardTitle tag="h5" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                {!!showTitle && <span>Select a patient</span>}
                {!!(userData.is_admin && selectedDoctor != null) &&
                    <>
                        < Input
                            id="exampleSelect"
                            name="select"
                            style={{ maxWidth: 170 }}
                            type="select"
                            onChange={(e) => changeSelectedDoctor(e.target.value)}
                            size="sm"
                        >
                            {allDoctors.map((doctor) => (
                                <option selected={doctor.id === selectedDoctor.id} key={doctor.id} value={doctor.id}>{doctor.email}</option>
                            ))

                            }

                        </Input>
                    </>
                }
            </CardTitle>
            <CardSubtitle className="mb-2 text-muted" tag="h6">
            </CardSubtitle>
            <div style={{ display: 'flex', marginTop: 20, flexDirection: 'column', justifyContent: 'flex-start' }}>
                <Input
                    id="exampleDatetime"
                    name="search"
                    placeholder="Search"
                    type="text"
                    onChange={(e) => handleChangeSearch(e.target.value)}
                />

                <div style={{ marginTop: 10, backgroundColor: '#F8F8F8', borderRadius: 5, maxHeight: 500, overflow: 'auto', overflowX: 'hidden' }}>
                    {loading ?
                        <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                            <Spinner style={{ margin: 50, alignSelf: 'center' }}></Spinner>
                        </div> :
                        <div>
                            {
                                patients.map((patient) => (
                                    <div key={patient.id} className='patient-row' onClick={() => handlePatientClick(patient)}>
                                        <Row>
                                            <Col sm="2" style={{ alignSelf: 'center' }}>
                                                <Image src={user} width="40" height="40" alt="logo" />
                                            </Col>
                                            <Col sm="8">
                                                <div className='patient-row-info'>
                                                    <span style={{ fontWeight: 'bold' }}>{patient.first_name} {patient.surname}</span>
                                                    <span>{Moment(patient.last_record_date).format("DD. MM. YYYY HH:mm")}</span>
                                                </div>
                                            </Col>
                                            <Col sm="2" style={{ alignSelf: 'center' }}>
                                                <i onClick={() => handleDeletePatient(patient.id)} className="bi bi-trash-fill"></i>
                                            </Col>
                                        </Row>
                                    </div>
                                ))
                            }
                        </div>
                    }
                </div>
            </div>
        </>
    );
};

export default SelectPatientList