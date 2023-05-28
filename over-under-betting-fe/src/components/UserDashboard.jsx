import React, { useEffect, useState } from 'react';

import BettingEvent from './BettingEvent';
import UserEvent from './UserEvent';

import { get_payout_ready_events_for_wallet } from '@/utils/api_calls/over_under_api_calls';
import { get_wallet, get_signer } from '@/utils/eth/wallet_utils';
import { ContractInterface } from '@/utils/eth/ethereum_provider';

import useStore from '@/state/zustand_store'
import dynamic from 'next/dynamic';

//const UserEvent = dynamic(() => import('./UserEvent'), {
//  ssr: false
//});


const UserDashboard = ({ eth_provider }) => {

  const walletAddress = useStore((state) => state.address);
  const isConnected = useStore((state) => state.isConnected);

  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  async function getWalletBettingEvents() {
    if (isConnected) {
      const events = await get_payout_ready_events_for_wallet(walletAddress);
      const withdraw_ready_event = []

      for (let i = 0; i < events.length; i++) {
        let contract_abi = events[i].contract_abi;
        let contract_address = events[i].contract_address;
        let signer = get_signer(window.ethereum);
        // TODO: Pass the contract interface to the component instead
        let contractHandle = eth_provider.getContract(contract_address, contract_abi, signer);
        let contractInterface = new ContractInterface(contractHandle);

        let payoutComplete = await contractInterface.getAddressPayoutComplete(walletAddress);
        if (!payoutComplete) {
          withdraw_ready_event.push(events[i]);
        }
      }
      
      setEvents(withdraw_ready_event);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const updateEvents = setInterval(() => {
      getWalletBettingEvents();
    }, 5000);
    return () => clearInterval(updateEvents);
  }, []);

  return (
    <div className="container">
      {isConnected && walletAddress && !isLoading &&
        events.map(data => {
          return (
            <UserEvent key={data.contract_address} contract_details={data} eth_provider={eth_provider} /> 
          )
        })
      }
      {!isConnected &&
        <div className="home-text-container">CONNECT WALLET TO VIEW YOUR BETTING EVENTS</div>
      }
      {isConnected && walletAddress && isLoading &&
       <div className="home-text-container">Loading...</div>
      }
    </div>
  )
}

export default UserDashboard