import { create } from 'zustand'
import { walletStoreSlice } from './zustand_wallet'
import { persist, createJSONStorage } from 'zustand/middleware'

const useStore = create(
    persist(
        (...a) => ({
            ...walletStoreSlice(...a),
          }), 
        { 
            name: 'wallet-storage',
            serialize: (state) => ({ ...state }),
            storage: createJSONStorage(() => sessionStorage), 
        }
    )
)

export default useStore;