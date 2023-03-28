import { ethers } from "ethers";

export const get_wallet = async (windowEthereum) => {
    const provider = new ethers.providers.Web3Provider(windowEthereum);
    const provider_name = provider.connection.url;
    
    try {
      await provider.send("eth_requestAccounts", [])
    } catch (error) {
      console.error("Failed to connect to ETH account: ", error);
      return;
    }
    const signer = provider.getSigner();
    console.log("signer gw: " + signer);

    const address = await signer.getAddress();

    const wallet_info = { 
        provider_name: provider_name, 
        signer: signer, 
        address: address
    };

    return wallet_info;
}

export const get_signer = (windowEthereum) => {
  const provider = new ethers.providers.Web3Provider(windowEthereum);
  const signer = provider.getSigner();

  return signer;
}