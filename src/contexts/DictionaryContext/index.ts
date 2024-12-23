import {createContext} from "react";
import { defaultWordsForToeic600 } from "./defaultWordsForToeic600";

export type DictionaryContextType = {
  dictionaries: { [key: string]: string[] };
  addWords: (key: string, words: string[]) => void;
  removeWord: (key: string, word: string) => void;
  addDictionary: (title: string, defaultWords?: string[]) => void;
  removeDictionary: (title: string) => void;
};

export const DictionaryContext = createContext<DictionaryContextType>({
  dictionaries: {
    "TOEIC 600": defaultWordsForToeic600,
  },
  addWords: () => undefined,
  removeWord: () => undefined,
  addDictionary: () => undefined,
  removeDictionary: () => undefined,
});
