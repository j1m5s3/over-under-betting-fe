import { useDispatch, useSelector } from 'react-redux';
import { ethers } from 'ethers';

import { connectWallet, disconnectWallet } from '@/state/wallet';


const ConnectWalletButton = () => {
  const dispatch = useDispatch();
  const isConnected = useSelector((state) => state.wallet.isConnected);

  async function handleClick() {
    
    if (!window.ethereum) {
      console.log("window: ", window)
      alert('Please install MetaMask to connect your wallet.');
      return;
    }

    if (!isConnected) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const provider_name = provider.connection.url;
      
      try {
        await provider.send("eth_requestAccounts", [])
      } catch (error) {
        console.error("Failed to connect to ETH account: ", error);
        return;
      }
      const signer = provider.getSigner();
      console.log(signer);

      const address = await signer.getAddress();

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