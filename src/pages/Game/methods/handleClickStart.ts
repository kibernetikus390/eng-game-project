import { Dictionary, VITE_USE_LS_QUIZ } from "..";
import { DictionariesType } from "../../../contexts/DictionaryContext";
import generateQuizSetType from "./generateQuizSet";
import getDefinitionType from "./getDefinition";
import fetchRandomWordsType from "../../../util/fetchRandomWords";
import addQuizCacheType from "./addQuizCache";
import fetchWiktionaryType from "../../../util/fetchWiktionary";
import initTfTableType from "./initTfTable";
import fetchOneRandomWordType from "../../../util/fetchOneRandomWord";

  // スタートボタンのクリックイベント
export default  async function handleClickStart(
    num: number,
    source: string,
    abortControllerRef: React.MutableRefObject<AbortController | null>,
    numExtraQuizSet: number,
    generateQuizSet: typeof generateQuizSetType,
    dictionaries: DictionariesType,
    fetchRandomWords: typeof fetchRandomWordsType,
    addQuizCache: typeof addQuizCacheType,
    fetchWiktionary: typeof fetchWiktionaryType,
    fetchOneRandomWord: typeof fetchOneRandomWordType,
    getDefinition: typeof getDefinitionType,
    reload: ()=>void,
    setAbort: (b:boolean)=>void,
    setIsJudge: React.Dispatch<React.SetStateAction<boolean>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setLoadingCounter: React.Dispatch<React.SetStateAction<number>>,
    setQuizSet: React.Dispatch<React.SetStateAction<Dictionary[]>>,
    setExtraSet: React.Dispatch<React.SetStateAction<Dictionary[]>>,
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>,
    setGameIndex: React.Dispatch<React.SetStateAction<number>>,
    setTfTable: React.Dispatch<React.SetStateAction<boolean[]>>,
    initTfTable: typeof initTfTableType,
  ) {
    abortControllerRef.current = new AbortController();
    setAbort(false);
    setIsJudge(false);
    setIsLoading(true);
    setLoadingCounter(0);
    let newQuizSet: Dictionary[] | undefined = [];
    let newExtraSet: Dictionary[] | undefined = [];
    if (VITE_USE_LS_QUIZ) {
      // クイズをローカルストレージから生成する
      // フェッチに時間がかかるので今のところテスト用
      const cacheString = localStorage.getItem("quizCache");
      // 異常：ローカルストレージが空
      if (cacheString == null) {
        alert(`localStorage(quizCache) is null`);
        reload();
        return;
      }
      const cache = JSON.parse(cacheString).flat();
      // 異常：キャッシュされた問題数が足りない
      if (cache.length < num + numExtraQuizSet) {
        alert(`localStorage(quizCache) is null`);
        reload();
        return;
      }
      for (let i = 0; i < num; i++) {
        newQuizSet.push(
          cache.splice(Math.floor(Math.random() * cache.length), 1)[0],
        );
      }
      setQuizSet(() => [...(newQuizSet as Dictionary[])]);
      for (let i = 0; i < numExtraQuizSet; i++) {
        newExtraSet.push(
          cache.splice(Math.floor(Math.random() * cache.length), 1)[0],
        );
      }
      setExtraSet(() => [...(newExtraSet as Dictionary[])]);
    } else {
      // クイズをWebAPIから生成
      try {
        // 出題リスト
        newQuizSet = await generateQuizSet(num, source, setLoadingCounter,dictionaries,fetchRandomWords,addQuizCache,abortControllerRef,fetchWiktionary,fetchOneRandomWord,getDefinition);
        setQuizSet(() => [...(newQuizSet as Dictionary[])]);
        if(source !== "Random"){
          setLoadingCounter(num);
        }
        // 選択肢用の追加リスト
        newExtraSet = await generateQuizSet(
          numExtraQuizSet,
          "Random",
          setLoadingCounter,dictionaries,fetchRandomWords,addQuizCache,abortControllerRef,fetchWiktionary,fetchOneRandomWord,getDefinition
        );
        setExtraSet(() => [...(newExtraSet as Dictionary[])]);
      } catch (error) {
        console.log(error);
        reload();
      }
    }
  
    setIsLoading(false);
    setIsPlaying(true);
    setGameIndex(0);
    initTfTable((newQuizSet as Dictionary[]).length, setTfTable);
  }