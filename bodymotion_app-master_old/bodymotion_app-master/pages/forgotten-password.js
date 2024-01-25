import { Card, CardBody, CardSubtitle, CardTitle, Form, FormGroup, Label, Input, Button, FormText, Spinner } from "reactstrap";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import LogoBodyMotion from "../src/assets/images/logos/bodymotion.png";
import { useState } from "react";
import { BACKEND_URL, MAIN_TOKEN } from "../constants/Config";
import cookies from 'next-cookies'
import { useRouter } from 'next/router';
import { SignJWT, jwtVerify, JWTPayload } from 'jose';

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const response = await fetch(BACKEND_URL + '/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        });
        if (response.status == 200) {
            let json = await response.json();
            let token = json.token.split('|')[1];
            // var jwt = require('jsonwebtoken');
            // let prepareCookie = jwt.sign({ foo: token }, "test");

            /*    const jwt = await new jose.SignJWT({ 'token': token  })
                .setIssuedAt()
                .setProtectedHeader({alg: 'HS256', typ: 'JWT'})
                .setIssuer('urn:example:issuer')
                .setAudience('urn:example:audience')
                .setExpirationTime('200000h')
                .sign(new TextEncoder().encode(MAIN_TOKEN));
     
                 document.cookie = `OursiteJWT=` + jwt + `; path=/`;*/

                 document.cookie = `token=` + token + `; path=/`;


            router.push("dashboard")
        }

        setLoading(false);
    }

    return (
        <div style={{ justifyContent: "center", display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
            <Image src={LogoBodyMotion} width="180" height="36" alt="logo" />
            <Card style={{ width: 600, alignSelf: "center", marginTop: 20 }}>
                <CardBody>
                    <CardTitle tag="h5" style={{ textAlign: 'center' }}><i className="bi bi-lock-fill"></i>&nbsp;Forgotten password</CardTitle>
                    <CardSubtitle className="text-muted" style={{ textAlign: 'center' }} tag="h6">
                        You will receive an email with your new password
                    </CardSubtitle>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="exampleEmail">
                                Email
                            </Label>
                            <Input
                                id="exampleEmail"
                                name="email"
                                placeholder="E-Mail"
                                type="email"
                                onChange={e => { setEmail(e.target.value) }}
                            />
                        </FormGroup>
                        {loading ?
                            <Spinner>
                                Loading...
                            </Spinner>
                            :
                            <Button>
                                Submit
                            </Button>
                        }
                    </Form>
                </CardBody>
            </Card>
        </div>
    );
}
