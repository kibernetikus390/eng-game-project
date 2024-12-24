import {createContext} from "react";

export type HistoryContextType = {
    history: {
        title: string;
        part: string;
        def: string;
        date: string;
        correct: boolean;
    }[];
    addHistory: (title: string, part: string, def: string, correct: boolean) => void;
};

export const HistoryContext = createContext<HistoryContextType>({
    history:[],
    addHistory: ()=>undefined
});