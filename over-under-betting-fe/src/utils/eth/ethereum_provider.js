import { ethers } from 'ethers';

class ETHProvider {

    constructor(providerUrl) {
        this.provider = new ethers.providers.JsonRpcProvider(providerUrl);
    }

    async getChainId() {
       const chainId = (await this.provider.getNetwork()).chainId;
        return chainId;
    }

    async getContract(contractAddress, contractABI) {
        const contract = new ethers.Contract(contractAddress, contractABI);
        return contract;
    }
}


class ContractInterface {
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
}