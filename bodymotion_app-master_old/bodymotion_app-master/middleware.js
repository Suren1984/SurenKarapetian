import { NextRequest, NextResponse } from 'next/server'
import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { MAIN_TOKEN } from "./constants/Config";

const secret = MAIN_TOKEN;

export default async function middleware(req) {
  const cookies = req.cookies;
  //const jwt = req.cookies.get('OursiteJWT')?.value;
  const token = req.cookies.get('token')?.value
  const url = req.url;


  if (url.includes('/login')) {
    try {
      // verify(jwt, secret);

      // const {payload} = await jwtVerify(jwt, new TextEncoder().encode(secret));
      if (token.length > 5) {
        const url = req.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url);
      } else {
        return NextResponse.next();
      }
    } catch (e) {
      console.log(e);
      return NextResponse.next();
    }

  }

  if (url.includes('/dashboard') || url == '/') {
    if (token === undefined) {
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url);
    }
    try {
      //const { payload } = await jwtVerify(jwt, new TextEncoder().encode(secret));
    //  console.log(payload);

      if (token.length > 5)
        return NextResponse.next();
    } catch (e) {
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}