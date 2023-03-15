import Head from 'next/head'
import Image from 'next/image'
import React, {useState} from "react"
import { Inter } from 'next/font/google'

import Chart from '@/components/Chart'
import ConnectWalletButton from '@/components/ConnectWalletButton'

const inter = Inter({ subsets: ['latin'] })


const Home = ({server_data}) => {
  const btc_data = server_data['btc'];
  const eth_data = server_data['eth'];

  return (
    <>
      <Head>
        <title>Over-Under-Betting</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="home-container">
        <div className="navbar">
          <div className="home-logo">LOGO</div>
          <div className="nav-link">BROWSE MARKETS</div>
          <div className="nav-link">DOCS</div>
          <div className="nav-link">ADDITIONAL INFO</div>
          <div className="connect-wallet-btn">
              <ConnectWalletButton />
          </div>
        </div>
        <div className="markets-text">MARKETS</div>
        <div className="markets-group">
          <div className="market-graph">
            <Chart data={btc_data} />
          </div>
          <div className="market-graph-1">
            <Chart data={eth_data} />
          </div>

        </div>
        <div className="events-text">EVENTS</div>
        <div className="events-group">
          <div className="event-card"></div>
          <div className="event-card-1"></div>
        </div>
        <div className="social-navbar"></div>
      </div>
    </>
  )
}

// For now just get data for charts
export const getServerSideProps = async () => {
  const base_url = process.env.NEXT_PUBLIC_BE_URL;

  const btc_24h_route = "/data/btc/price/24/hour";
  const btc_url = base_url + btc_24h_route;

  const eth_24h_route = "/data/eth/price/24/hour";
  const eth_url = base_url + eth_24h_route;


  const btc_res = await fetch(btc_url).then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    return response.json();
  });
  const btc_data = btc_res.data;

  const eth_res = await fetch(eth_url).then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    return response.json();
  });
  const eth_data = eth_res.data;

  const server_data = {
    btc: btc_data,
    eth: eth_data,
  }

  return {
    props: {server_data}
  };
};

export default Home;
