import {createContext} from "react";

export type DictionaryContextType = {
  dictionaries: { [key: string]: string[] };
  addWords: (key: string, words: string[]) => void;
  removeWord: (key: string, word: string) => void;
  addDictionary: (title: string, defaultWords?: string[]) => void;
  removeDictionary: (title: string) => void;
  getLength: (key: string) => number;
  isWordInNigateList: (title: string) => boolean;
};

export const DictionaryContext = createContext<DictionaryContextType>({
  dictionaries: {},
  addWords: () => undefined,
  removeWord: () => undefined,
  addDictionary: () => undefined,
  removeDictionary: () => undefined,
  getLength: () => 0,
  isWordInNigateList: () => false,
});