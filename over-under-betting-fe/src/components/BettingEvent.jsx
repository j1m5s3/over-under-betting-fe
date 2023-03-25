import { useDispatch, useSelector } from 'react-redux';
import { ethers } from 'ethers';

import { connectWallet, disconnectWallet } from '@/state/wallet';


const BettingEvent = ({contract_details}) => {

  const dispatch = useDispatch();
  const isConnected = useSelector((state) => state.wallet.isConnected);
  const walletAddress = useSelector((state) => state.wallet.address);


  // Address of deployed contract stored in DB
  //const contract_address = contract_details['contract_address'];
  // JSON interface to contract stored in DB
  //const contract_abi = contract_details['contract_address'];

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
    if(isConnected) {

    }
  }
  return (
    <>
      <div>BettingEvent</div>

      <div>
        <div>
          <button onClick={handleClick}>
            Over <div> + </div>
          </button>
        </div>
        <div>
          <button onClick={handleClick}>
            Under <div> - </div>
          </button>
        </div>

      </div>

    </>
  )
}

export default BettingEvent;