import { useDispatch, useSelector } from 'react-redux';
import { ethers } from 'ethers';

import { connectWallet, disconnectWallet } from '@/state/wallet';

import { get_wallet } from '@/utils/eth/wallet_utils';


const ConnectWalletButton = () => {
  const dispatch = useDispatch();
  const isConnected = useSelector((state) => state.wallet.isConnected);

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
    }
    if (isConnected) {
      dispatch(disconnectWallet());
    }
  }

  return (
    <button onClick={handleClick}>
      {isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
    </button>
  );
}

export default ConnectWalletButton;