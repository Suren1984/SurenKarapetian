import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Form, FormGroup, Label, Modal, Row, Spinner, Input, ModalHeader } from 'reactstrap'
import { BACKEND_URL, customStyles } from '../../../constants/Config'
import { UserContext } from '../../../pages/_app';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditPatientModal({ patient, displayModal, changedPatient }) {
    const userData = useContext(UserContext);

    const [showModal, setShowModal] = useState(false)
    const [name, setName] = useState(null)
    const [surname, setSurname] = useState(null)
    const [since, setSince] = useState(null)
    const [height, setHeight] = useState(null)
    const [weight, setWeight] = useState(null)
    const [loadingNewPatient, setLoadingNewPatient] = useState(false)

    useEffect(() => {
        setShowModal(displayModal)
    }, [displayModal])

    useEffect(() => {
        setName(patient.first_name)
        setSurname(patient.surname)
        setSince(patient.since)
        setHeight(patient.height)
        setWeight(patient.weight)
    }, [patient])

    const handleSubmitUpdate = async (e) => {
        e.preventDefault();
        setLoadingNewPatient(true);
        if (name.length > 1 && surname.length > 1 && since > 1900) {
            const response = await fetch(BACKEND_URL + '/patients/' + patient.id, {
                method: 'PUT',
                headers: new Headers({
                    'Authorization': 'Bearer ' + userData.token,
                    'Content-Type': 'application/json',
                }),
                body: JSON.stringify({
                    first_name: name,
                    surname: surname,
                    since: since,
                    weight: weight,
                    height: height,
                    phoneotype: "phoneotype"
                })
            });
            if (response.status == 204) {
                toast.success("Patient successfully updated")
                setShowModal(false);
                changedPatient();
            } else {
                console.log(response.status)
                toast.error("Error while creating updating the patient. Try it again")
            }
        } else {
            toast.error("Please check your inputs")
        }
        setLoadingNewPatient(false);
    }

    return (
        <Modal
            isOpen={showModal}
            onRequestClose={() => setShowModal(false)}
            style={{
                overlay: {
                    zIndex: 500
                },
                content: {
                    padding: '20 !important',
                }
            }}
            contentLabel="Example Modal"
        >
            <div style={{ padding: 20 }}>
                <Row>
                    <div style={{
                        display: 'flex', justifyContent: 'space-between', flexDirection: 'row', marginBottom: 20,
                        borderBottom: '1px solid #f0f0f0', paddingBottom: 10
                    }}>
                        <h2><i className="bi bi-pencil"></i>&nbsp;Edit patient</h2>
                        <span style={{ cursor: 'pointer' }} onClick={() => setShowModal(false)}><i className="bi bi-x-lg"></i> </span>
                    </div>
                </Row>

                {name &&
                    <Row>
                        <h4 style={{ textAlign: 'center' }}>New Patient</h4>
                        <Form onSubmit={handleSubmitUpdate}>
                            <FormGroup>
                                <Label for="exampleEmail">
                                    Firstname
                                </Label>
                                <Input
                                    id="exampleEmail"
                                    name="firstname"
                                    placeholder="Firstname"
                                    type="text"
                                    value={name}
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
                                    value={surname}
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
                                            value={since}
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
                                            value={height}
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
                                            value={weight}
                                            placeholder="kg"
                                            type="number"
                                            onChange={e => { setWeight(e.target.value) }}
                                        />
                                    </div>
                                </div>
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
                    </Row>
                }
            </div>

        </Modal>
    )
}
