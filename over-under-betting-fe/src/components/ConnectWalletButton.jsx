import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AwesomeButton } from 'react-awesome-button'
import AwesomeButtonStyles from 'react-awesome-button/src/styles/styles.scss';

import { connectWallet, disconnectWallet } from '@/state/wallet';

import { get_wallet } from '@/utils/eth/wallet_utils';


const ConnectWalletButton = () => {
  const dispatch = useDispatch();
  const isConnected = useSelector((state) => state.wallet.isConnected);

  const [btnTitle, setBtnTitle] = useState('Connect Wallet');

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

      dispatch(connectWallet({ provider_name, signer, address }));
      setBtnTitle('Disconnect Wallet');
    }
    if (isConnected) {
      dispatch(disconnectWallet());
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