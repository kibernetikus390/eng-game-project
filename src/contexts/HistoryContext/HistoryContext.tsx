import {createContext} from "react";

export type HistoryContextType = {
    history: {
        title: string;
        part: string;
        def: string;
        date: string;
    }[];
    addHistory: (/*title: string, part: string, def: string, date: string*/) => void;
};

export const HistoryContext = createContext<HistoryContextType>({
    history:[],
    addHistory: ()=>undefined
});