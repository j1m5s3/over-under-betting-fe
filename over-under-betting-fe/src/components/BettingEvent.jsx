import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import { get_wallet, get_signer } from '@/utils/eth/wallet_utils';
import { ContractInterface } from '@/utils/eth/ethereum_provider';

import useStore from '@/state/zustand_store'
import { useGetFromStore } from '@/hooks/wallet';

import { convert_timestamp, create_counter_elements } from '@/utils/time_utils/time_utils';


const BettingEvent = ({ contract_details, eth_provider, show_withdraw }) => {
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const min_bet_value = '0.0011';
  const [betValue, setBetValue] = useState(min_bet_value);
  const [bettingTimeRemaining, setBettingTimeRemaining] = useState(null);
  const [eventTimeRemaining, setEventTimeRemaining] = useState(null);
  const [betDisabled, setBetDisabled] = useState(false);

  const isConnected = useStore((state) => state.isConnected);
  const walletAddress = useStore((state) => state.address);
  const connectWallet = useStore((state) => state.connectWallet);

  const [overBetterPayoutModifier, setOverBetterPayoutModifier] = useState();
  const [underBetterPayoutModifier, setUnderBetterPayoutModifier] = useState();
  const [modifiersLoaded, setModifiersLoaded] = useState(false);

  var price_mark = contract_details.price_mark.toFixed(2);
  var contract_asset_symbol = contract_details.asset_symbol;
  var event_close = contract_details.event_close;
  var betting_close = contract_details.betting_close;
  var contract_address = contract_details.contract_address;
  var contract_abi = contract_details.contract_abi;



  //const [isWinner, setIsWinner] = useState(false);
  useEffect(() => {
    if (!modifiersLoaded) {
      overBetterPayoutModifierUpdate();
      underBetterPayoutModifierUpdate();
      setModifiersLoaded(true);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const timeLeft = convert_timestamp(betting_close);
      if (timeLeft > 0) {
        const counter_elements = create_counter_elements(timeLeft);
        setBettingTimeRemaining(`${counter_elements.days}d:${counter_elements.hours}hrs:${counter_elements.minutes}mins:${counter_elements.seconds}s`);
      } else {
        clearInterval(timer);
        setBettingTimeRemaining("BETTING COMPLETE");
        setBetDisabled(true);
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

  async function overBetterPayoutModifierUpdate() {
    const contractHandle = eth_provider.getContract(contract_address, contract_abi, null)
    const contractInterface = new ContractInterface(contractHandle)
    const new_modifier = await contractInterface.getOverBettingPayoutModifier();
    setOverBetterPayoutModifier(Number(new_modifier).toFixed(2));
  }

  async function underBetterPayoutModifierUpdate() {
    const contractHandle = eth_provider.getContract(contract_address, contract_abi, null)
    const contractInterface = new ContractInterface(contractHandle)
    const new_modifier = await contractInterface.getUnderBettingPayoutModifier();
    setUnderBetterPayoutModifier(Number(new_modifier).toFixed(2));
  }

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
      let wallet_balance = wallet.balance;

      connectWallet(provider_name, address, wallet_balance);

      const contractHandle = eth_provider.getContract(contract_address, contract_abi, signer);
      const contractInterface = new ContractInterface(contractHandle);

      const value_to_send = ethers.utils.parseEther(betValue)
      const txn_response = await contractInterface.makeOverBet(value_to_send, gas_price);
      if (txn_response != null) {
        const mined_txn = await eth_provider.getMinedTransaction(txn_response.hash);
        console.log("txn_response: ", txn_response);
        console.log("mined_txn: ", mined_txn);
        overBetterPayoutModifierUpdate();
        underBetterPayoutModifierUpdate();
      };
    }
    if (isConnected) {
      const signer = get_signer(window.ethereum);
      const contractHandle = eth_provider.getContract(contract_address, contract_abi, signer);
      const contractInterface = new ContractInterface(contractHandle);

      const value_to_send = ethers.utils.parseEther(betValue)
      const txn_response = await contractInterface.makeOverBet(value_to_send, gas_price);
      if (txn_response != null) {
        const mined_txn = await eth_provider.getMinedTransaction(txn_response.hash);
        console.log("txn_response: ", txn_response);
        console.log("mined_txn: ", mined_txn);
        overBetterPayoutModifierUpdate();
        underBetterPayoutModifierUpdate();
      }
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
      let wallet_balance = wallet.balance;

      connectWallet(provider_name, address, wallet_balance);

      const contractHandle = eth_provider.getContract(contract_address, contract_abi, signer);
      const contractInterface = new ContractInterface(contractHandle);

      const value_to_send = ethers.utils.parseEther(betValue)
      const txn_response = await contractInterface.makeUnderBet(value_to_send, gas_price);
      if (txn_response != null) {
        const mined_txn = await eth_provider.getMinedTransaction(txn_response.hash);
        console.log("txn_response: ", txn_response);
        console.log("mined_txn: ", mined_txn);
        overBetterPayoutModifierUpdate();
        underBetterPayoutModifierUpdate();
      }
    }
    if (isConnected) {
      const signer = get_signer(window.ethereum);
      const contractHandle = eth_provider.getContract(contract_address, contract_abi, signer);
      const contractInterface = new ContractInterface(contractHandle);

      const value_to_send = ethers.utils.parseEther(betValue)
      const txn_response = await contractInterface.makeUnderBet(value_to_send, gas_price);
      if (txn_response != null) {
        const mined_txn = await eth_provider.getMinedTransaction(txn_response.hash);
        console.log("txn_response: ", txn_response);
        console.log("mined_txn: ", mined_txn);
        overBetterPayoutModifierUpdate();
        underBetterPayoutModifierUpdate();
      }
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
      connectWallet(provider_name, address);

      const contractHandle = eth_provider.getContract(contract_address, contract_abi, signer);
      const contractInterface = new ContractInterface(contractHandle);

      const txn_response = await contractInterface.winnerWithdrawFunds(gas_price);
      const mined_txn = await eth_provider.getMinedTransaction(txn_response.hash);
    }
    if (isConnected) {
      const signer = get_signer(window.ethereum);
      const contractHandle = eth_provider.getContract(contract_address, contract_abi, signer);
      const contractInterface = new ContractInterface(contractHandle);

      const txn_response = await contractInterface.winnerWithdrawFunds(gas_price);
      const mined_txn = await eth_provider.getMinedTransaction(txn_response.hash);
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
        {!show_withdraw &&
          <div>
            <label className="form-label mb-0 mt-3 me-3"><h6> PLACE YOUR BET </h6></label>
            <input className='event-bet-input-field' type="text" value={betValue} onChange={(e) => setBetValue(e.target.value)} placeholder={min_bet_value + ' min ETH Bet'} />
            <label className="form-label mb-0 mt-3 ms-2">ETH </label>
          </div>
        }

      </div>

      {!show_withdraw &&
        <div className="row m-auto mt-2 mb-2">
          <div className='col m-auto'>
            <button disabled={betDisabled} onClick={handleOverBet} className="event-bet-btn text-nowrap text-center btn btn-dark">
              <p className='m-auto'>Over + </p>
              <p className='m-auto'>Payout: {overBetterPayoutModifier}x </p>
            </button>
          </div>
          <div className='col m-auto'>
            <button disabled={betDisabled} onClick={handleUnderBet} className="event-bet-btn text-nowrap text-center btn btn-dark">
              <p className='m-auto'>Under - </p>
              <p className='m-auto'>Payout: {underBetterPayoutModifier}x </p>
            </button>
          </div>
        </div>
      }
      {show_withdraw &&
        <div className="row m-auto mt-2 mb-2">
          <div className='col m-auto'>
            <button onClick={handleWithdraw} className="event-bet-btn text-nowrap text-center btn btn-dark">
              <p className='m-auto'>Withdraw </p>
            </button>
          </div>
        </div>
      }
    </>
  )
}

export default BettingEvent;