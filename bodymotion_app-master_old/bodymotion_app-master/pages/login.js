import { Card, CardBody, CardSubtitle, CardTitle, Form, FormGroup, Label, Input, Button, FormText, Spinner } from "reactstrap";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import * as jose from 'jose'
import LogoBodyMotion from "../src/assets/images/logos/bodymotion.png";
import SensoHealthLogo from "../src/assets/images/logos/sensohealthlogo.png";
import { useState, useEffect } from "react";
import { BACKEND_URL, MAIN_TOKEN } from "../constants/Config";
import cookies from 'next-cookies'
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import { VERSION } from '../constants/Config'

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // na serveri nejde autofill, preto to riesim cez cookies, po prihlaseni sa email a heslo ulozia do cookies
        const cookie_email = getCookie("email");
        const cookie_password = getCookie("password");
        if (cookie_email != null && cookie_password != null) {
            setEmail(cookie_email);
            setPassword(cookie_password);
        }
    }, [])


    const handleSubmit = async (event) => {
        //ip param
        const urlParams = new URLSearchParams(window.location.search);
        const ip = urlParams.get('ip');
        console.log("LOGIN IP: " + ip);
        if (ip != null && ip.length > 5)
            document.cookie = `ip=` + ip + `; path=/`;
        document.cookie = `email=` + email + `; path=/`;
        document.cookie = `password=` + password + `; path=/`;

        const jwtt = cookies.OursiteJWT;

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


           

/*const jwt = await new jose.SignJWT({ 'token': token  })
  .setIssuedAt()
  .setProtectedHeader({alg: 'HS256', typ: 'JWT'})
  .setIssuer('urn:example:issuer')
  .setAudience('urn:example:audience')
  .setExpirationTime('200000h')
  .sign(new TextEncoder().encode(MAIN_TOKEN));

           // var jwt = require('jsonwebtoken');
            //let prepareCookie = jwt.sign({ token: token }, MAIN_TOKEN);


            document.cookie = `OursiteJWT=` + jwt + `; path=/`;*/
            document.cookie = `token=` + token + `; path=/`;


            window.location.href = "/dashboard"
        }

        setLoading(false);
    }

    return (
        <div style={{ justifyContent: "center", display: 'flex', flexDirection: 'column', alignItems: 'center', maxHeight: '100vh', paddingTop: 0 }}>
            <Image src={LogoBodyMotion} width="200" height="30" alt="logo" style={{marginTop: 100}}/>
            <Card style={{ width: '90%', alignSelf: "center", marginTop: 20 }}>
                <CardBody>
                    <CardTitle tag="h5" style={{ textAlign: 'center' }}><i className="bi bi-lock-fill"></i>&nbsp;Log in</CardTitle>
                    <CardSubtitle className="text-muted" style={{ textAlign: 'center' }} tag="h6">
                        Log in to continue to the dashboard
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
                                type="text"
                                onChange={e => { setEmail(e.target.value) }}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="examplePassword">
                                Password
                            </Label>
                            <Input
                                id="examplePassword"
                                name="password"
                                placeholder="Password"
                                type="password"
                                onChange={e => { setPassword(e.target.value) }}
                            />
                        </FormGroup>
                        <FormText>
                            <p>
                                <Link href="/forgotten-password" className="alert-link">
                                    Forgotten password
                                </Link>
                            </p>
                        </FormText>
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
            <div>
                
            </div>
            <Image src={SensoHealthLogo} width="200" height="40" alt="logo" />
            <p style={{opacity: 0.7}}>Version: {VERSION}</p>
        </div>
    );
}
