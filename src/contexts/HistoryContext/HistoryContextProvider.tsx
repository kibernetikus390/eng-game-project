import {useState} from "react";
import {HistoryContext, HistoryContextType} from "../HistoryContext/HistoryContext";

export function HistoryContextProvider({children, ...props}: React.PropsWithChildren){
  const [history, setHistory] = useState<HistoryContextType["history"]>({});

  const addHistory = () => {
        console.log("hoge");
};
    
  return (
    <HistoryContext.Provider value={{
        history:[{title:"hoge",part:"hey",def:"foo",date:"2024"}],
        addHistory
        }} {...props}>
        {children}
    </HistoryContext.Provider>
  );
}