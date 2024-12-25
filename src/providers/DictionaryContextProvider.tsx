import React, { useCallback, useEffect, useState } from "react";
import {
  DictionaryContext,
  DictionaryContextType,
} from "../contexts/DictionaryContext/index.ts";
import { TOEIC600 } from "../contexts/DictionaryContext/TOEIC600.ts";
import { Dictionary } from "../pages/Game/index.tsx";

const LOCAL_STORAGE_DICTIONARIES_KEY = "dictionaries";
export const KEY_NIGATE_LIST = "Weak";

export function DictionaryContextProvider({children, ...props}: React.PropsWithChildren) {
  const [dictionaries, setDictionaries] = useState<DictionaryContextType["dictionaries"]>({});

  useEffect(() => {
    const localStorageDictionaries = localStorage.getItem(LOCAL_STORAGE_DICTIONARIES_KEY);
    if (localStorageDictionaries) {
      setDictionaries(
        JSON.parse(
          localStorageDictionaries,
        ) as DictionaryContextType["dictionaries"],
      );
      return;
    }
    const defaultDictionaries = {
      [KEY_NIGATE_LIST]: [],
      "TOEIC 600": TOEIC600,
    };
    setDictionaries(defaultDictionaries);
    localStorage.setItem(
      LOCAL_STORAGE_DICTIONARIES_KEY,
      JSON.stringify(defaultDictionaries),
    );
  }, []);

  function setLocalStorage(val:DictionaryContextType["dictionaries"]){
    localStorage.setItem(
      LOCAL_STORAGE_DICTIONARIES_KEY,
      JSON.stringify(val),
    );
  }

  const addWords = useCallback<DictionaryContextType["addWords"]>(
    (key, values) => {
      setDictionaries((prev) => {
        const newDictionaries = {
          ...prev,
          [key]: (prev[key] ?? [])
            .filter((x) => !values.includes(x))
            .concat(values),
        };

        setLocalStorage(newDictionaries);
        return newDictionaries;
      });
    },
    [],
  );

  const removeWord = useCallback<DictionaryContextType["removeWord"]>(
    (key, dic) => {
      setDictionaries((prev) => {
        const newDictionaries = {
          ...prev,
          [key]: (prev[key] ?? []).filter((d) => d.title !== dic.title || d.part !== dic.part || d.definition !== dic.definition),
        };

        setLocalStorage(newDictionaries);
        return newDictionaries;
      });
    },
    [],
  );

  const addDictionary = useCallback<DictionaryContextType["addDictionary"]>(
    (title, defaultWords = []) => {
      setDictionaries((prev) => {
        const newDictionaries = {
          ...prev,
          [title]: defaultWords,
        };

        setLocalStorage(newDictionaries);
        return newDictionaries;
      });
    },
    [],
  );

  const removeDictionary = useCallback<
    DictionaryContextType["removeDictionary"]
  >((title) => {
    setDictionaries((prev)=>{
      const newDictionaries = {...prev};
      delete newDictionaries[title];
      setLocalStorage(newDictionaries);
      return newDictionaries;
    });
  }, []);

  const getLength = (key:string) => {
    return dictionaries[key].length;
  }

  const isWordInNigateList = (dic:Dictionary) => {
    return dictionaries[KEY_NIGATE_LIST].some((d)=> d.title == dic.title && d.part == dic.part && d.definition == dic.definition) ? true : false;
  }

  return (
    <DictionaryContext.Provider
      value={{
        dictionaries,
        addWords,
        removeWord,
        addDictionary,
        removeDictionary,
        getLength,
        isWordInNigateList,
      }}
      {...props}
    >
      {children}
    </DictionaryContext.Provider>
  );
}
