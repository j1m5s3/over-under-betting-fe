import { create } from 'zustand'
import { walletStoreSlice } from './zustand_wallet'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'

const useStore = create(
    devtools(
        persist(walletStoreSlice,
            {
                name: 'wallet',
                storage: createJSONStorage(() => localStorage),
            }
        )
    )
)

export default useStore;