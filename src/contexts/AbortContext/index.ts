import {createContext} from "react";

export type AbortType = {
    abort: boolean;
    setAbort: (b:boolean)=>void;
    isAbort: ()=>boolean;
};

export const AbortContext = createContext<AbortType>({
    abort:false,
    setAbort: () => undefined,
    isAbort: ()=>false,
});
