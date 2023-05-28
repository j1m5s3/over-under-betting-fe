import { ethers } from 'ethers';

export class ETHProvider {

    constructor(providerUrl) {
        this.provider = new ethers.providers.StaticJsonRpcProvider(providerUrl);
    }

    getContract(contractAddress, contractABI, signer = null) {

        if (signer == null) {
            const contract = new ethers.Contract(contractAddress, contractABI, this.provider);
            return contract;
        }

        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        return contract;
    }

    async getGasPrice() {
        const gas_price = this.provider.getGasPrice();
        return gas_price;
    }

    async getChainId() {
        const chainId = (await this.provider.getNetwork()).chainId;
        return chainId;
    }

    async getMinedTransaction(txn_hash) {
        const mined_txn = await this.provider.waitForTransaction(txn_hash);
        return mined_txn;
    }
}


export class ContractInterface {
    constructor(contract_handle) {
        this.contract_handle = contract_handle;
    }

    async getContractName() {
        const contractName = await this.contract_handle.getContractName();
        return contractName;
    }

    async getPriceMark() {
        const priceMark = await this.contract_handle.getPriceMark();
        const etherFormattedPriceMark = ethers.utils.formatEther(priceMark);
        return etherFormattedPriceMark;
    }

    async getPriceAtClose() {
        const priceAtClose = await this.contract_handle.getPriceAtClose();
        const etherFormattedPriceAtClose = ethers.utils.formatEther(priceAtClose);
        return etherFormattedPriceAtClose;
    }

    async getOverBettingPayoutModifier() {  
        const overBettingPayoutModifier = await this.contract_handle.getOverBettingPayoutModifier();
        const etherFormattedOverBettingPayoutModifier = ethers.utils.formatEther(overBettingPayoutModifier);
        return etherFormattedOverBettingPayoutModifier;
    }

    async getUnderBettingPayoutModifier() {
        const underBettingPayoutModifier = await this.contract_handle.getUnderBettingPayoutModifier();
        const etherFormattedUnderBettingPayoutModifier = ethers.utils.formatEther(underBettingPayoutModifier);
        return etherFormattedUnderBettingPayoutModifier;
    }
    
    async getAssetSymbol() {
        const assetSymbol = await this.contract_handle.getAssetSymbol();
        return assetSymbol;
    }

    async getBettingClose() {
        const bettingClose = await this.contract_handle.getBettingClose();
        return bettingClose;
    }

    async getEventClose() {
        const eventClose = await this.contract_handle.getEventClose();
        return eventClose;
    }

    async getContractBalance() {
        const contractBalance = await this.contract_handle.getContractBalance();
        return contractBalance;
    }

    async getWinningBettersAddresses() {
        const winningBettersAddresse = await this.contract_handle.getWinningBettersAddresses();
        return winningBettersAddresse;
    }

    async getAddressPayoutComplete(address) {
        const addressPayoutComplete = await this.contract_handle.getAddressPayoutComplete(address);
        return addressPayoutComplete;
    }

    async getWinningOutcome() {
        const winningOutcome = await this.contract_handle.getWinningOutcome();
        return winningOutcome;
    }

    async getWithdrawBalance(address) {
        const withdrawBalance = await this.contract_handle.getWithdrawBalance(address);
        const etherFormattedWithdrawBalance = ethers.utils.formatEther(withdrawBalance);
        return etherFormattedWithdrawBalance;
    }

    async makeUnderBet(value, gas_price) {
        // TODO: Programatically get gas_limit. Optimize gas price estimation
        try {
            const txn_response = await this.contract_handle.betUnder({ value: value, gasPrice: gas_price, gasLimit: 6000000});
            return txn_response;
        }
        catch (error) {
            console.log(error);
            return null;
        }
        //const txn_response = await this.contract_handle.betUnder({ value: value, gasPrice: gas_price, gasLimit: 6000000});
        //return txn_response;
    }

    async makeOverBet(value, gas_price) {
        // TODO: Programatically get gas_limit. Optimize gas price estimation
        try {
            const txn_response = await this.contract_handle.betOver({ value: value, gasPrice: gas_price, gasLimit: 6000000});
            return txn_response;
        }
        catch (error) {
            console.log(error);
            return null;
        }
       //const txn_response = await this.contract_handle.betOver({ value: value, gasPrice: gas_price, gasLimit: 6000000});
        //return txn_response;
    }

    async winnerWithdrawFunds(gas_price) {
        try {
            const txn_response = await this.contract_handle.winnerWithdrawFunds({ gasPrice: gas_price, gasLimit: 6000000});
            return txn_response;
        }
        catch (error) {
            console.log(error);
            return null;
        }
        //const txn_response = await this.contract_handle.winnerWithdrawFunds({ gasPrice: gas_price, gasLimit: 6000000});
        
        //return txn_response;
    }
}