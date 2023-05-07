import { StateCreator } from "zustand";

export const walletStoreSlice = (set) => ({
    isConnected: false,
    provider: null,
    address: null,
    connectButtonMsg: "Connect Wallet",
    
    connectWallet: (the_provider, the_address) => set(
        { 
            isConnected: true,   
            provider: the_provider,
            address: the_address,
            connectButtonMsg: "Disconnect Wallet"
        }),
    disconnectWallet: () => set(
        { 
            isConnected: false,  
            provider: null,
            address: null,
            connectButtonMsg: "Connect Wallet"
        })
});