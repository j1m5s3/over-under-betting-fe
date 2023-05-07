import { useState, useEffect, use } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ethers } from 'ethers';

import { get_wallet, get_signer } from '@/utils/eth/wallet_utils';
import { ContractInterface } from '@/utils/eth/ethereum_provider';

import { connectWallet, disconnectWallet } from '@/state/wallet';
import useStore from '@/state/zustand_store'
import { useGetFromStore } from '@/hooks/wallet';

import { convert_timestamp, create_counter_elements } from '@/utils/time_utils/time_utils';


const BettingEvent = ({ contract_details, eth_provider }) => {

  const price_mark = contract_details.price_mark.toFixed(2);
  const contract_asset_symbol = contract_details.asset_symbol;
  const event_close = contract_details.event_close;
  const betting_close = contract_details.betting_close;
  const contract_address = contract_details.contract_address;
  const contract_abi = contract_details.contract_abi;
  const min_bet_value = 0.0011;

  //const dispatch = useDispatch();

  const [betValue, setBetValue] = useState(min_bet_value);
  const [bettingTimeRemaining, setBettingTimeRemaining] = useState(null);
  const [eventTimeRemaining, setEventTimeRemaining] = useState(null);

  //const isConnected = useSelector((state) => state.wallet.isConnected);
  //const walletAddress = useSelector((state) => state.wallet.address);
  //const signer = useSelector((state) => state.signer);
  const isConnected = useGetFromStore(useStore, (state) => state.isConnected);
  const walletAddress = useGetFromStore(useStore, (state) => state.address);
  const connectWallet = useStore((state) => state.connectWallet);

  const [contractHandle, setContractHandle] = useState(null);
  const [contractInterface, setContractInterface] = useState(null);

  //const [isWinner, setIsWinner] = useState(false);

  useEffect(() => {
    // Update contractHandle and contractInterface when isConnected and signer change
    console.log("isConnected uf: " + isConnected);
    console.log("walletAddress uf: " + walletAddress);

    if (isConnected) {
      console.log("isConnected: " + isConnected);
      const signer = get_signer(window.ethereum);
      console.log("signer uf: " + signer);

      setContractHandle(eth_provider.getContract(contract_address, contract_abi, signer));
      setContractInterface(new ContractInterface(contractHandle));
      console.log("contractHandle uf: " + contractHandle);
      console.log("contractInterface uf: " + contractInterface);
      //const withdrawAddresses = contractInterface.getWithdrawableFundAddresses();
      //if (withdrawAddresses.includes(walletAddress)) {
      //  setIsWinner(true);
      //}
    }

  }, [isConnected]);

  useEffect(() => {
    const timer = setInterval(() => {
      const timeLeft = convert_timestamp(betting_close);
      if (timeLeft > 0) {
        const counter_elements = create_counter_elements(timeLeft);
        setBettingTimeRemaining(`${counter_elements.days}d:${counter_elements.hours}hrs:${counter_elements.minutes}mins:${counter_elements.seconds}s`);
      } else {
        clearInterval(timer);
        setBettingTimeRemaining("BETTING COMPLETE");
      }
    }, 1000);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const timeLeft = convert_timestamp(event_close);
      if (timeLeft > 0) {
        const counter_elements = create_counter_elements(timeLeft);
        setEventTimeRemaining(`${counter_elements.days}d:${counter_elements.hours}hrs:${counter_elements.minutes}mins:${counter_elements.seconds}s`);
      } else {
        clearInterval(timer);
        setEventTimeRemaining("EVENT COMPLETE");
      }
    }, 1000);
  }, []);

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

      connectWallet(provider_name, address);
      
      setContractHandle(eth_provider.getContract(contract_address, contract_abi, signer));
      setContractInterface(new ContractInterface(contractHandle));

      const value_to_send = ethers.utils.parseEther(betValue)
      const txn_response = await contractInterface.makeOverBet(value_to_send, gas_price);

      //dispatch(connectWallet({ provider_name, signer, address }));
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

      connectWallet( provider_name, address );

      setContractHandle(eth_provider.getContract(contract_address, contract_abi, signer));
      setContractInterface(new ContractInterface(contractHandle));

      const value_to_send = ethers.utils.parseEther(betValue)
      const txn_response = await contractInterface.makeUnderBet(value_to_send, gas_price);

      //dispatch(connectWallet({ provider_name, signer, address }));
    }
    if (isConnected) {
      const value_to_send = ethers.utils.parseEther(betValue)
      const txn_response = await contractInterface.makeUnderBet(value_to_send, gas_price);
    }
  }

  async function handleWithdraw() {
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

      //dispatch(connectWallet({ provider_name, signer, address }));
      connectWallet( provider_name, signer, address );

      const txn_response = await contractInterface.winnerWithdrawFunds(gas_price);
    }
    if (isConnected) {
      const txn_response = await contractInterface.winnerWithdrawFunds(gas_price);
    }
  }

  return (
    <>
      <div className='event-card-text-container mt-2'>
        <div> {contract_asset_symbol} betting event </div>
        <div> Address: {contract_address} </div>
        <div className='row m-auto'>
          <div className='col m-auto d-flex justify-content-center align-items-center'> --------------------------- </div>
        </div>
        <div> Event Close: {eventTimeRemaining} </div>
        <div> Betting Close: {bettingTimeRemaining} </div>
        <div> Price Mark: ${price_mark} USD </div>
      </div>

      <div>
        <label className="form-label mb-0 mt-3 me-3"><h6> PLACE YOUR BET </h6></label>
        <input className='event-bet-input-field' type="text" value={betValue} onChange={(e) => setBetValue(e.target.value)} placeholder={min_bet_value + 'min ETH Bet' }/>
        <label className="form-label mb-0 mt-3 ms-2">ETH </label>
      </div>


      <div className="row m-auto mt-2 mb-2">
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