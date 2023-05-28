import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import { get_wallet, get_signer } from '@/utils/eth/wallet_utils';
import { ContractInterface } from '@/utils/eth/ethereum_provider';

import useStore from '@/state/zustand_store'

const UserEvent = ({ contract_details, eth_provider }) => {

    const isConnected = useStore((state) => state.isConnected);
    const walletAddress = useStore((state) => state.address);
    const connectWallet = useStore((state) => state.connectWallet);

    const contract_address = contract_details.contract_address;
    const contract_abi = contract_details.contract_abi;
    const asset_symbol = contract_details.asset_symbol;
    const price_mark = contract_details.price_mark.toFixed(2);

    const [contractName, setContractName] = useState('');
    const [winningOutcome, setWinningOutcome] = useState('');
    //const [priceMark, setPriceMark] = useState('');
    const [priceAtClose, setPriceAtClose] = useState('');
    const [withdrawBalance, setWithdrawBalance] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if(!isLoaded) {
            getEventInfo();
            setIsLoaded(true);
        }
    }, []);

    async function getEventInfo() {
        if (isConnected) {
            let signer = get_signer(window.ethereum);
            let contractHandle = eth_provider.getContract(contract_address, contract_abi, signer);
            let contractInterface = new ContractInterface(contractHandle);

            let contractName = await contractInterface.getContractName();
            setContractName(contractName);

            let winningOutcome = await contractInterface.getWinningOutcome();
            setWinningOutcome(winningOutcome);

            let priceAtClose = await contractInterface.getPriceAtClose();
            setPriceAtClose(priceAtClose);

            let withdrawBalance = await contractInterface.getWithdrawBalance(walletAddress);
            setWithdrawBalance(withdrawBalance);
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
            if (txn_response != null) {
                const mined_txn = await eth_provider.getMinedTransaction(txn_response.hash);
            }
        }
        if (isConnected) {
            const signer = get_signer(window.ethereum);
            const contractHandle = eth_provider.getContract(contract_address, contract_abi, signer);
            const contractInterface = new ContractInterface(contractHandle);

            const txn_response = await contractInterface.winnerWithdrawFunds(gas_price);
            if (txn_response != null) {
                const mined_txn = await eth_provider.getMinedTransaction(txn_response.hash);
            }
            
        }
    }

    return (
        <>
            <div className='event-card-text-container mt-2'>
                <div> {contractName} </div>
                <div> {asset_symbol} betting event </div>
                <div> Address: {contract_address} </div>
                <div className='row m-auto'>
                    <div className='col m-auto d-flex justify-content-center align-items-center'> --------------------------- </div>
                </div>
                <div> Price Mark: ${price_mark} USD </div>
                <div>Price at close: ${priceAtClose} USD </div>
                <div>Winning outcome: {winningOutcome}</div>
                <div>Withdraw balance: {withdrawBalance} ETH</div>
            </div>

            <div className="row m-auto mt-2 mb-2">
                <div className='col m-auto'>
                    <button onClick={handleWithdraw} className="event-bet-btn text-nowrap text-center btn btn-dark">
                        <p className='m-auto'>Withdraw </p>
                    </button>
                </div>
            </div>


        </>
    )
}

export default UserEvent;