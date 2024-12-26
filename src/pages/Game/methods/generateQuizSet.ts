import { Dictionary } from "..";
import { VITE_ADD_LS_QUIZ } from "..";
import { DictionariesType } from "../../../contexts/DictionaryContext";
import getDefinitionType from "./getDefinition";
import fetchRandomWordsType from "./fetchRandomWords";
import addQuizCacheType from "./addQuizCache";
import fetchWiktionaryType from "./fetchWiktionary";
import fetchOneRandomWordType from "./fetchOneRandomWord";

// 問題セットを生成
export default async function generateQuizSet(
  num: number,
  source: string,
  setCounter: React.Dispatch<React.SetStateAction<number>>,
  dictionaries: DictionariesType,
  fetchRandomWords: typeof fetchRandomWordsType,
  addQuizCache: typeof addQuizCacheType,
  abortControllerRef: React.MutableRefObject<AbortController | null>,
  fetchWiktionary: typeof fetchWiktionaryType,
  fetchOneRandomWord: typeof fetchOneRandomWordType,
  getDefinition: typeof getDefinitionType,
): Promise<Dictionary[]> {
  try {
    let fetchedWords: string[] = [];
    const dictionary = dictionaries[source];

    const newQuizSet: Dictionary[] = [];
    // 出題：Random　ランダムな単語を生成
    if (source === "Random") {
      fetchedWords = await fetchRandomWords(num);
    } else {
      // 出題リストから問題セットを生成してreturn
      const copyDic = [...dictionary];
      for (let i = 0; i < num; i++) {
        const newQuiz: Dictionary = copyDic.splice(
          Math.floor(Math.random() * copyDic.length),
          1,
        )[0];
        newQuizSet.push(newQuiz);
        if (VITE_ADD_LS_QUIZ) {
          addQuizCache(newQuiz);
        }
      }
      return newQuizSet;
    }
    // 出題：Random wiktionaryから意味を取得する
    for (let i = 0; i < fetchedWords.length; i++) {
      // 既存の非同期処理を中断
      if (
        abortControllerRef.current == null ||
        abortControllerRef.current.signal.aborted
      ) {
        abortControllerRef.current = new AbortController();
        throw new Error("fetch aborted");
      }
      let doc: Document;
      try {
        doc = await fetchWiktionary(
          fetchedWords[i],
          abortControllerRef.current.signal,
        );
      } catch {
        // ランダムに1つ取得しなおす
        fetchedWords[i] = await fetchOneRandomWord(fetchedWords, fetchRandomWords);
        i--;
        continue;
      }
      // Wiktionaryのデータから意味の部分を取り出す
      const newQuiz: Dictionary = getDefinition(doc, fetchedWords[i]);
      if (newQuiz.definition == "") {
        // 意味を取得できなかった
        // ランダムに1つ取得しなおす
        fetchedWords[i] = await fetchOneRandomWord(fetchedWords,  fetchRandomWords);
        i--;
        continue;
      }
      // 取得成功
      newQuizSet.push(newQuiz);
      if (VITE_ADD_LS_QUIZ) {
        addQuizCache(newQuiz);
      }
      // ローディング進捗表示用のカウンター
      setCounter(
        (prev) => prev + 1,
      );
    }
    return newQuizSet;
  } catch (error) {
    throw error;
  }
}
