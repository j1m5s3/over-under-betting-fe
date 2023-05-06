import React, { useState } from 'react';
import { useContext } from 'react'

import useStore from '@/state/zustand_store'
import { useGetFromStore } from '@/hooks/wallet';

import { get_wallet } from '@/utils/eth/wallet_utils';



const ConnectWalletButton = () => {
  const store = useContext(useStore);
  
  const buttonTitle = useGetFromStore(useStore, (state) => state.connectButtonMsg);
  console.log("buttonTitle: " + buttonTitle);
  const [btnTitle, setBtnTitle] = useState(buttonTitle);

  const isConnected = useGetFromStore(useStore, (state) => state.isConnected);

  //const connectWallet = useGetFromStore(useStore, (state) => state.connectWallet);
  const connectWallet = useStore((state) => state.connectWallet);
  const disconnectWallet = useStore((state) => state.disconnectWallet);

  async function handleClick() {
    
    if (!window.ethereum) {
      alert('Please install MetaMask to connect your wallet.');
      return;
    }
    console.log("isConnected cwb: " + isConnected);
    if (!isConnected) {
      const wallet = await get_wallet(window.ethereum);

      let provider_name = wallet.provider_name;
      let signer = wallet.signer;
      let address = wallet.address;
      console.log("signer cwb: " + signer);

      //dispatch(connectWallet({ provider_name, signer, address }));
      connectWallet(provider_name, signer, address);
      setBtnTitle('Disconnect Wallet');
    }
    if (isConnected) {
      //dispatch(disconnectWallet());
      disconnectWallet();
      setBtnTitle('Connect Wallet');
    }
  }

  return (
    <button onClick={handleClick} variant="primary" title={btnTitle} className="nav-link-button btn btn-dark btn-lg">
      {isConnected ? <i className="bi bi-coin"></i> : <i className="bi bi-wallet2"></i>}
    </button>
  );
}

export default ConnectWalletButton;