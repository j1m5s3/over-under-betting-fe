import { StateCreator } from "zustand";

export const walletStoreSlice = (set) => ({
    isConnected: false,
    provider: null,
    address: null,
    balance: null,
    connectButtonMsg: "Connect Wallet",
    
    connectWallet: (the_provider, the_address, the_balance) => set(
        { 
            isConnected: true,   
            provider: the_provider,
            address: the_address,
            balance: the_balance,
            connectButtonMsg: "Disconnect Wallet"
        }),
    disconnectWallet: () => set(
        { 
            isConnected: false,  
            provider: null,
            address: null,
            balance: null,
            connectButtonMsg: "Connect Wallet"
        }),
    updateBalance: (the_balance) => set(
        {
            balance: the_balance
        })
});