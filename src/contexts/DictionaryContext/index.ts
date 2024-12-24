import {createContext} from "react";
import { Dictionary } from "../../pages/Game";

export type DictionaryContextType = {
  dictionaries: { [key: string]: Dictionary[] };
  addWords: (key: string, words: Dictionary[]) => void;
  removeWord: (key: string, dic: Dictionary) => void;
  addDictionary: (title: string, defaultWords?: Dictionary[]) => void;
  removeDictionary: (title: string) => void;
  getLength: (key: string) => number;
  isWordInNigateList: (word: Dictionary) => boolean;
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