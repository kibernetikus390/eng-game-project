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
import fetchOneRandomWord from "./methods/fetchOneRandomWord.ts";
import fetchRandomWords from "./methods/fetchRandomWords.ts";
import generateQuizSet from "./methods/generateQuizSet.ts";
import handleClickStart from "./methods/handleClickStart.ts";
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
  // ステート：正誤表示中
  const [isJudge, setIsJudge] = useState<boolean>(false);
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

  // 出題元の選択が有効かチェック
  (function checkQuizSourceValue(){
    let invalid = false;
    Object.keys(dictionaries).map((v,_)=>{
      if(invalid) return;
      if(v==quizSource && getLength(v) == 0){
        invalid = true;
      }
    });
    if(invalid){
      console.log("INVALID QUIZSOURCE");
      setQuizSource("Random");
    } 
  })();

  // 出題数が有効かチェック
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
      isJudge,
      setIsJudge,
    );
  }
  
  // スタートボタンのクリックイベント
  async function memHandleClickStart(num:number, source:string){
    return handleClickStart(num,source,abortControllerRef,numExtraQuizSet,generateQuizSet,dictionaries,fetchRandomWords,addQuizCache,fetchWiktionary,fetchOneRandomWord,getDefinition,reload,setAbort,setIsJudge,setIsLoading,setLoadingCounter,setQuizSet,setExtraSet,setIsPlaying,setGameIndex,setTfTable,initTfTable);
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
    //setAbort(true);
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
    initTfTable(newQuiz.length, setTfTable);
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
          isJudge={isJudge}
          correctIndex={correctOptionIndex}
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
          handleClickStart={memHandleClickStart}
        />
      )}
    </Container>
  );
}

export default Game;
