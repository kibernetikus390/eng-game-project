import React, { useCallback, useEffect, useState } from "react";
import {
  DictionaryContext,
  DictionaryContextType,
} from "../contexts/DictionaryContext/index.ts";
import { defaultWordsForToeic600 } from "../contexts/DictionaryContext/defaultWordsForToeic600.ts";

const LOCAL_STORAGE_DICTIONARIES_KEY = "dictionaries";

export function DictionaryContextProvider({
  children,
  ...props
}: React.PropsWithChildren) {
  const [dictionaries, setDictionaries] = useState<
    DictionaryContextType["dictionaries"]
  >({});

  useEffect(() => {
    const localStorageDictionaries = localStorage.getItem(
      LOCAL_STORAGE_DICTIONARIES_KEY,
    );
    if (localStorageDictionaries) {
      setDictionaries(
        JSON.parse(
          localStorageDictionaries,
        ) as DictionaryContextType["dictionaries"],
      );
      return;
    }
    const defaultDictionaries = {
      "TOEIC 600": defaultWordsForToeic600,
    };
    setDictionaries(defaultDictionaries);
    localStorage.setItem(
      LOCAL_STORAGE_DICTIONARIES_KEY,
      JSON.stringify(defaultDictionaries),
    );
  }, []);

  const addWords = useCallback<DictionaryContextType["addWords"]>(
    (key, values) => {
      setDictionaries((prev) => {
        const newDictionaries = {
          ...prev,
          [key]: (prev[key] ?? [])
            .filter((x) => !values.includes(x))
            .concat(values),
        };

        localStorage.setItem(
          LOCAL_STORAGE_DICTIONARIES_KEY,
          JSON.stringify(newDictionaries),
        );

        return newDictionaries;
      });
    },
    [],
  );

  const removeWord = useCallback<DictionaryContextType["removeWord"]>(
    (key, value) => {
      setDictionaries((prev) => {
        const newDictionaries = {
          ...prev,
          [key]: (prev[key] ?? []).filter((x) => x !== value),
        };

        localStorage.setItem(
          LOCAL_STORAGE_DICTIONARIES_KEY,
          JSON.stringify(newDictionaries),
        );

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

        localStorage.setItem(
          LOCAL_STORAGE_DICTIONARIES_KEY,
          JSON.stringify(newDictionaries),
        );

        return newDictionaries;
      });
    },
    [],
  );

  const removeDictionary = useCallback<
    DictionaryContextType["removeDictionary"]
  >((title) => {
    // TODO: implement removeDictionary function
  }, []);

  return (
    <DictionaryContext.Provider
      value={{
        dictionaries,
        addWords,
        removeWord,
        addDictionary,
        removeDictionary,
      }}
      {...props}
    >
      {children}
    </DictionaryContext.Provider>
  );
}
