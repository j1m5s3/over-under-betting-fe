import { useDispatch, useSelector } from 'react-redux';
import { AwesomeButton } from 'react-awesome-button'
import AwesomeButtonStyles from 'react-awesome-button/src/styles/styles.scss';

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
    <button onClick={handleClick} variant="primary" title='Crypto Wallet' className="nav-link-button text-nowrap text-center btn btn-dark">
      {isConnected ? 'Disconnect Wallet' : <i class="bi bi-wallet2"></i>}
    </button>
  );
}

export default ConnectWalletButton;