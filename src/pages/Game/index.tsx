import { useEffect, useState, useContext, useRef } from "react";
import { ThemeContext } from "../../contexts/Theme/index.tsx";
import { Container } from "@mui/material";
import { DictionaryContext } from "../../contexts/DictionaryContext/index.ts";
import { HistoryContext } from "../../contexts/HistoryContext/index.tsx";
import handleClickOption from "./methods/handleClickOption.ts";
import fetchWiktionary from "./methods/fetchWiktionary.ts";
import getDefinition from "./methods/getDefinition.ts";
import initTfTable from "./methods/initTfTable.ts";
import addQuizCache from "./methods/addQuizCache.ts";
import fetchOneRandomWord from "./methods/fetchRandomWord.ts";
import fetchRandomWords from "./methods/fetchRandomWords.ts";
import GameStart from "./GameStart.tsx";
import GameResult from "./GameResult.tsx";
import GameMain from "./GameMain.tsx";
import GameLoading from "./GameLoading.tsx";
import { AbortContext } from "../../contexts/AbortContext/index.ts";
import { useNavigate } from "react-router-dom";

// 問題をWebAPIからフェッチ時、ローカルストレージにキャッシュする
export const VITE_ADD_LS_QUIZ: boolean = false;
// 出題に、ローカルストレージにキャッシュした問題を使う
export const VITE_USE_LS_QUIZ: boolean = false;

export type Dictionary = {
  title: string;
  part: string;
  definition: string;
};

function Game() {
  const { dictionaries, getLength } = useContext(DictionaryContext);
  const { abort, setAbort } = useContext(AbortContext);
  const { addHistory } = useContext(HistoryContext);
  const navigate = useNavigate();
  const abortControllerRef = useRef<AbortController | null>(null);
  // ステート：ロード中
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // ローディング進度
  const [loadingCounter, setLoadingCounter] = useState<number>(0);
  // ステート：ゲーム進行中
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  // ステート：リザルト画面
  const [isResult, setIsResult] = useState<boolean>(false);
  // ゲーム進度
  const [gameIndex, setGameIndex] = useState<number>(-1);
  // 出題数
  const [numWords, setNumWords] = useState<number>(10);
  // 出題ソース
  const [quizSource, setQuizSource] = useState<string>("Random");
  // 出題リスト
  const [quizSet, setQuizSet] = useState<Dictionary[]>([]);
  // 選択肢用の追加の出題リスト
  const [extraSet, setExtraSet] = useState<Dictionary[]>([]);
  // ↑の数。とりあえず定数で
  const numExtraQuizSet = 10;
  // 選択肢
  const [options, setOptions] = useState<Dictionary[]>([]);
  // 選択肢内の、正答のインデックス
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(0);
  // 正誤表
  const [tfTable, setTfTable] = useState<boolean[]>([]);
  // ライトモード・ダークモード
  const { theme } = useContext(ThemeContext);
  // 出題の最大数
  let maxQuiz = 50;

  if (quizSource != "Random") {
    const dictionary = dictionaries[quizSource];
    maxQuiz = Math.min(50, dictionary.length);

    if (numWords > maxQuiz) {
      setNumWords(maxQuiz);
    }
  }

  // TODO: 他のメソッドも外化する？
  // 選択肢のクリックイベント 正誤判定して進行する
  function memHandleClickOption(clickedOptionIndex: number) {
    return handleClickOption(
      clickedOptionIndex,
      correctOptionIndex,
      gameIndex,
      tfTable,
      setTfTable,
      quizSet,
      addHistory,
      setGameIndex,
      setIsPlaying,
      setIsResult,
    );
  }

  // 問題セットを生成
  async function generateQuizSet(
    num: number,
    source: string,
    setCounter: React.Dispatch<React.SetStateAction<number>>
  ) {
    try {
      let fetchedWords: string[] = [];
      const dictionary = dictionaries[source];

      const newQuizSet: Dictionary[] = [];
      // 出題：Random　ランダムな単語を生成
      if (source === "Random") {
        fetchedWords = await fetchRandomWords(num);
      // 出題リスト　リストから問題セットを生成してreturn
      } else {
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
        if(abortControllerRef.current == null || abortControllerRef.current.signal.aborted){
          abortControllerRef.current = new AbortController();
          throw new Error("fetch aborted");
        }
        let doc: Document;
        try{
          doc = await fetchWiktionary(fetchedWords[i], abortControllerRef.current.signal);
          // console.log(doc);
        } catch {
          // ランダムに1つ取得しなおす
          fetchedWords[i] = await memFetchOneRandomWord(fetchedWords);
          i--;
          continue;
        }
        // Wiktionaryのデータから意味の部分を取り出す
        const newQuiz: Dictionary = getDefinition(doc, fetchedWords[i]);
        if (newQuiz.definition == "") {
          // 意味を取得できなかった
          // ランダムに1つ取得しなおす
          fetchedWords[i] = await memFetchOneRandomWord(fetchedWords);
          i--;
          continue;
        }
        // 取得成功
        newQuizSet.push(newQuiz);
        if (VITE_ADD_LS_QUIZ) {
          addQuizCache(newQuiz);
        }
        // ローディング進捗表示用のカウンター
        (setCounter as React.Dispatch<React.SetStateAction<number>>)(
          (prev) => prev + 1,
        );
      }
      return newQuizSet;
    } catch (error) {
      throw error;
    }
  }

  // スタートボタンのクリックイベント
  async function handleClickStart(
    num: number,
    source: string,
  ) {
    abortControllerRef.current = new AbortController();
    setAbort(false);
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
        newQuizSet = await generateQuizSet(num, source, setLoadingCounter);
        setQuizSet(() => [...(newQuizSet as Dictionary[])]);
        // 選択肢用の追加リスト
        newExtraSet = await generateQuizSet(
          numExtraQuizSet,
          "Random",
          setLoadingCounter,
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
    memInitTfTable((newQuizSet as Dictionary[]).length);
  }
  

  // 正誤表を初期化
  function memInitTfTable(num: number) {
    return initTfTable(num, setTfTable);
  }

  // RandoAPIからランダムな単語を1つフェッチ
  async function memFetchOneRandomWord(words: string[]) {
    return fetchOneRandomWord(words, fetchRandomWords);
  }

  // ゲーム進行時イベント 選択肢を生成する
  useEffect(() => {
    if (gameIndex == -1 || isResult || gameIndex >= quizSet.length) {
      return;
    }
    // 選択肢を生成
    const allSet: Dictionary[] = [...quizSet, ...extraSet];
    const newOptions: Dictionary[] = [];
    for (let i = 0; i < 4; i++) {
      newOptions.push(
        allSet.splice(Math.floor(Math.random() * allSet.length), 1)[0],
      );
    }
    // 正答を挿入
    let ansIndex = newOptions.findIndex(
      (e) => e.title == quizSet[gameIndex].title,
    );
    if (ansIndex == -1) {
      ansIndex = Math.floor(Math.random() * 4);
      newOptions[ansIndex] = quizSet[gameIndex];
      setCorrectOptionIndex(ansIndex);
    } else {
      setCorrectOptionIndex(ansIndex);
    }
    console.log(newOptions);
    // console.log("ans: " + ansIndex);
    setOptions(newOptions);
  }, [gameIndex, quizSet, extraSet, isResult]);

  // クリックイベント スタート画面に戻る
  function handleClickBack() {
    setIsResult(false);
  }

  // クリックイベント 間違えた問題をリトライ
  function handleClickRevenge() {
    setGameIndex(0);
    // 問題セット
    const newQuiz: Dictionary[] = [];
    const wrongQuiz: Dictionary[] = quizSet.filter((_, i) => !tfTable[i]);

    while (0 < wrongQuiz.length) {
      newQuiz.push(
        wrongQuiz.splice(Math.floor(Math.random() * wrongQuiz.length), 1)[0],
      );
    }
    //setNumWords(newQuiz.length);
    setQuizSet(newQuiz);
    memInitTfTable(newQuiz.length);
    setIsResult(false);
    setIsPlaying(true);
  }

  // 問題数の入力フォーム更新イベント
  function handleNumChange(e: React.ChangeEvent<HTMLInputElement>) {
    let num = Number(e.target.value);
    if (num < 1) num = 1;
    if (num > maxQuiz) num = maxQuiz;
    setNumWords(num);
  }

  // 出題ソースの選択イベント
  function handleChangeQuizSource(e: React.ChangeEvent<HTMLInputElement>) {
    const source = e.target.value as string;
    setQuizSource(source);
    setNumWords(10);
  }

  // リロード
  function reload() {
    // window.location.reload();
    navigate("/");
    setAbort(true);
  }

  let correctNum: number = 0;
  tfTable.map((v) => {
    if (v) correctNum++;
  });

  const handleAbort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // 中断
    }
  };

  // navBarでHomeをクリック->スタート画面に戻る
  useEffect(()=>{
    if (abort == true) {
      handleAbort();
      setIsLoading(false);
      setIsPlaying(false);
      setIsResult(false);
      setGameIndex(-1);
      setNumWords(10);
      setAbort(false);
    }
  },[abort]);

  if(abort){
    return;
  }
  
  return (
    <Container sx={{ height: "100%" }}>
      {isLoading ? (
        <GameLoading
          loadingCounter={loadingCounter}
          numQuizAndExtra={numWords + numExtraQuizSet}
        />
      ) : isPlaying ? (
        <GameMain
          tfTable={tfTable}
          gameIndex={gameIndex}
          quizSet={quizSet}
          options={options}
          memHandleClickOption={memHandleClickOption}
          theme={theme}
        />
      ) : isResult ? (
        <GameResult
          correctNum={correctNum}
          quizSet={quizSet}
          handleClickBack={handleClickBack}
          handleClickRevenge={handleClickRevenge}
          theme={theme}
          tfTable={tfTable}
        />
      ) : (
        <GameStart
          quizSource={quizSource}
          handleChangeQuizSource={handleChangeQuizSource}
          dictionaries={dictionaries}
          getLength={getLength}
          numWords={numWords}
          handleNumChange={handleNumChange}
          handleClickStart={handleClickStart}
        />
      )}
    </Container>
  );
}

export default Game;
