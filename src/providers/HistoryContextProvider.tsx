import {useEffect, useState} from "react";
import {HistoryContext, HistoryContextType} from "../contexts/HistoryContext";
import formatDate from "../util/formatDate";

const LOCAL_STORAGE_DICTIONARIES_KEY = "EGP-HISTORY";

export function HistoryContextProvider({children, ...props}: React.PropsWithChildren){
  const [history, setHistory] = useState<HistoryContextType["history"]>([]);

  useEffect(()=>{
    const lsHistory:HistoryContextType["history"] = JSON.parse( localStorage.getItem(LOCAL_STORAGE_DICTIONARIES_KEY) ?? "[]" );
    setHistory(lsHistory);
  },[]);

  const addHistory = (title: string, part: string, def: string, correct: boolean) => {
    const newHistory = [...history];
    newHistory.push({title:title, part:part, def:def, date:formatDate(new Date()), correct:correct});
    setHistory(newHistory);
    localStorage.setItem(LOCAL_STORAGE_DICTIONARIES_KEY, JSON.stringify(newHistory));
};
    
  return (
    <HistoryContext.Provider value={{
        history:history,
        addHistory
        }} {...props}>
        {children}
    </HistoryContext.Provider>
  );
}