import { createSlice } from '@reduxjs/toolkit';

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    isConnected: false,
    provider: null,
    signer: null,
    address: null,
  },
  reducers: {
    connectWallet: (state, action) => {
      state.isConnected = true;
      state.provider = action.payload.provider;
      state.signer = action.payload.signer;
      state.address = action.payload.address;
    },
    disconnectWallet: (state) => {
      state.isConnected = false;
      state.provider = null;
      state.signer = null;
      state.address = null;
    },
  },
});

export const { connectWallet, disconnectWallet } = walletSlice.actions;

export default walletSlice.reducer;
