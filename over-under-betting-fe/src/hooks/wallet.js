import { useState, useEffect } from "react";
import useStore from "@/state/zustand_store"

export function useGetFromStore(store, callback) {
    const [state, setState] = useState();
    const storedState = store(callback);

    useEffect(() =>  {
        setState(storedState)
    }, [storedState]);
    
    return state;
}