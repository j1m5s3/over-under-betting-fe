import { ethers } from 'ethers';

export class ETHProvider {

    constructor(providerUrl) {
        this.provider = new ethers.providers.JsonRpcProvider(providerUrl);
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

    async makeUnderBet(value, gas_price) {
        const txn_response = await this.contract_handle.betUnder({ value: value, gasPrice: gas_price, gasLimit: 100000});

        return txn_response;
    }

    async makeOverBet(value, gas_price) {
        // TODO: Programatically get gas_limit. Optimize gas price estimation
        const txn_response = await this.contract_handle.betOver({ value: value, gasPrice: gas_price, gasLimit: 100000});

        return txn_response;
    }
}