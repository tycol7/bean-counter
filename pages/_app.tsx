/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable require-jsdoc */
import type {AppProps, NextWebVitalsMetric} from 'next/app';
import {SessionProvider} from 'next-auth/react';
import '../styles/globals.css';
import Head from 'next/head';

export function reportWebVitals(metric: NextWebVitalsMetric) {
  const url = process.env.NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT;

  if (!url) {
    return;
  }

  const body = JSON.stringify({
    route: window.__NEXT_DATA__.page,
    ...metric,
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body);
  } else {
    fetch(url, {body, method: 'POST', keepalive: true});
  }
}

function MyApp({Component, pageProps: {session, ...pageProps}}: AppProps) {
  return (
    <>
      <Head>
        <title>Bean Counter</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🫘</text></svg>" />
      </Head>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider></>
  );
}

export default MyApp;
