import { StateCreator } from "zustand";

export const walletStoreSlice = (set, get) => ({
    isConnected: false,
    provider: null,
    signer: null,
    address: null,
    connectButtonMsg: "Connect Wallet",
    
    connectWallet: (the_provider, the_signer, the_address) => set(
        { 
            isConnected: true, 
            provider: the_provider, 
            signer: the_signer, 
            address: the_address,
            connectButtonMsg: "Disconnect Wallet"
        }),
    disconnectWallet: () => set(
        { 
            isConnected: false, 
            provider: null, 
            signer: null, 
            address: null,
            connectButtonMsg: "Connect Wallet"
        })
});