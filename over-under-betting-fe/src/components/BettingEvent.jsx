import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ethers } from 'ethers';
import { AwesomeButton } from 'react-awesome-button'

import { get_wallet, get_signer } from '@/utils/eth/wallet_utils';
import { ETHProvider, ContractInterface } from '@/utils/eth/ethereum_provider';

import { connectWallet, disconnectWallet } from '@/state/wallet';


const BettingEvent = ({ contract_details, provider_url }) => {

  const price_mark = contract_details.price_mark.toFixed(2);
  const contract_asset_symbol = contract_details.asset_symbol;
  const event_close = contract_details.event_close;
  const betting_close = contract_details.betting_close;
  const contract_address = contract_details.contract_address;
  const contract_abi = contract_details.contract_abi;
  const provider_connection_string = provider_url;
  const eth_provider = new ETHProvider(provider_connection_string);

  const dispatch = useDispatch();
  const [betValue, setBetValue] = useState('0.0011');

  const isConnected = useSelector((state) => state.wallet.isConnected);
  const walletAddress = useSelector((state) => state.wallet.address);
  const signer = useSelector((state) => state.signer);

  const [contractHandle, setContractHandle] = useState(eth_provider.getContract(contract_address, contract_abi, signer));
  const [contractInterface, setContractInterface] = useState(new ContractInterface(contractHandle));

  useEffect(() => {
    // Update contractHandle and contractInterface when isConnected and signer change
    console.log("isConnected uf: " + isConnected);
    console.log("walletAddress uf: " + walletAddress);

    if (isConnected) {
      const signer = get_signer(window.ethereum);
      console.log("signer uf: " + signer);
      setContractHandle(eth_provider.getContract(contract_address, contract_abi, signer));
      setContractInterface(new ContractInterface(contractHandle));
    }

  }, [isConnected]);

  /*
   async function getContractInfo() {
     const price_mark = await contractInterface.getPriceMark();
     const name = await contractInterface.getContractName();
     console.log("contract_info: " + name);
     console.log("price_mark: " + price_mark);
 
     
   }
   */

  async function handleOverBet() {
    if (!window.ethereum) {
      console.log("window: ", window)
      alert('Please install MetaMask to connect your wallet.');
      return;
    }
    const gas_price = await eth_provider.getGasPrice();

    if (!isConnected) {
      const wallet = await get_wallet(window.ethereum);

      let provider_name = wallet.provider_name;
      let signer = wallet.signer;
      let address = wallet.address;

      dispatch(connectWallet({ provider_name, signer, address }));

      const value_to_send = ethers.utils.parseEther(betValue)
      const txn_response = await contractInterface.makeOverBet(value_to_send, gas_price);
    }
    if (isConnected) {
      const value_to_send = ethers.utils.parseEther(betValue)
      const txn_response = await contractInterface.makeOverBet(value_to_send, gas_price);
    }
  }

  async function handleUnderBet() {
    if (!window.ethereum) {
      console.log("window: ", window)
      alert('Please install MetaMask to connect your wallet.');
      return;
    }
    const gas_price = await eth_provider.getGasPrice();

    if (!isConnected) {
      const wallet = await get_wallet(window.ethereum);

      let provider_name = wallet.provider_name;
      let signer = wallet.signer;
      let address = wallet.address;

      dispatch(connectWallet({ provider_name, signer, address }));

      const value_to_send = ethers.utils.parseEther(betValue)
      const txn_response = await contractInterface.makeUnderBet(value_to_send, gas_price);
    }
    if (isConnected) {
      const value_to_send = ethers.utils.parseEther(betValue)
      const txn_response = await contractInterface.makeUnderBet(value_to_send, gas_price);
    }
  }

  // Address of deployed contract stored in DB
  //const contract_address = contract_details['contract_address'];
  // JSON interface to contract stored in DB
  //const contract_abi = contract_details['contract_address'];

  return (
    <>
      <div>Betting Event</div>
      <div>Address: {contract_address}</div>
      <div> Event Close: {event_close}</div>
      <div> Betting Close: {betting_close}</div>
      <div>Price Mark: ${price_mark} USD</div>
      <div>ASSET SYMBOL: {contract_asset_symbol}</div>

      <input type="text" value={betValue} onChange={(e) => setBetValue(e.target.value)} />
      <div className="row m-auto mt-2 mb-1">
        <div className='col m-auto'>
          <button onClick={handleOverBet} className="event-bet-btn text-nowrap text-center btn btn-dark">
            <p className='m-auto'>Over + </p>
          </button>
        </div>
        <div className='col m-auto'>
          <button onClick={handleUnderBet} className="event-bet-btn text-nowrap text-center btn btn-dark">
            <p className='m-auto'>Under - </p>
          </button>
        </div>
      </div>
    </>
  )
}

export default BettingEvent;