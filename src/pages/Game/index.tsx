import { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../../ThemeContext.tsx";
import TfTable from "../../components/TfTable/";
import classes from "./index.module.css";
import CircularProgressWithLabel from "../../components/CircularProgressWithLabel";

import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';

// 問題をWebAPIからフェッチ時、ローカルストレージにキャッシュする
const VITE_ADD_LS_QUIZ:boolean = true;
// 出題に、ローカルストレージにキャッシュした問題を使う
const VITE_USE_LS_QUIZ:boolean = true;


type Dictionary = {
  title: string;
  part: string;
  definition: string;
};

function Game() {
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
  // 出題リスト
  const [quizSet, setQuizSet] = useState<Dictionary[]>([]);
  // 選択肢用の追加の出題リスト
  const [extraSet, setExtraSet] = useState<Dictionary[]>([]);
  // ↑の数。とりあえず定数で
  const numExtraQuizSet = 4;
  // 選択肢
  const [options, setOptions] = useState<Dictionary[]>([]);
  // 選択肢内の、正答のインデックス
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(0);
  // 正誤表
  const [tfTable, setTfTable] = useState<boolean[]>([]);
  const {theme, toggleTheme} = useContext(ThemeContext);

  // 選択肢のクリックイベント 正誤判定して進行する
  function handleClickOption(optionIndex: number) {
    if (optionIndex == correctOptionIndex) {
      // console.log("correct");
      const newTfTable = tfTable;
      newTfTable[gameIndex] = true;
      setTfTable(newTfTable);
    } else {
      // console.log("wrong");
    }
    setGameIndex((i) => i + 1);
    if (gameIndex < quizSet.length - 1) {
      return;
    }
    // リザルト画面へ
    setIsPlaying(false);
    setIsResult(true);
  }

  // スタートボタンのクリックイベント
  async function handleClickStart(num: number) {
    setIsLoading(true);
    setLoadingCounter(0);
    let newQuizSet: Dictionary[]|undefined = [];
    let newExtraSet: Dictionary[]|undefined = [];
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
      setQuizSet(() => [...newQuizSet as Dictionary[]]);
      for (let i = 0; i < numExtraQuizSet; i++) {
        newExtraSet.push(
          cache.splice(Math.floor(Math.random() * cache.length), 1)[0],
        );
      }
      setExtraSet(() => [...newExtraSet as Dictionary[]]);
    } else {
      // クイズをWebAPIから生成
      try {
        // 出題リスト
        newQuizSet = await generateQuizSet(num, setLoadingCounter);
        setQuizSet(() => [...newQuizSet as Dictionary[]]);
        // 選択肢用の追加リスト
        newExtraSet = await generateQuizSet(numExtraQuizSet, setLoadingCounter);
        setExtraSet(() => [...newExtraSet as Dictionary[]]);
      } catch (error) {
        alert(error);
        reload();
      }
    }

    setIsLoading(false);
    setIsPlaying(true);
    setGameIndex(0);
    initTfTable((newQuizSet as Dictionary[]).length);
  }

  // 正誤表を初期化
  function initTfTable(num: number) {
    const newTfTable: boolean[] = Array(num).fill(false);
    setTfTable(newTfTable);
  }

  // 問題をローカルストレージに保存
  function addQuizCache(newV: Dictionary) {
    let quizCacheString = localStorage.getItem("quizCache");
    if (quizCacheString == null) {
      quizCacheString = "[]";
    }
    let quizCache: Dictionary[] = JSON.parse(quizCacheString);
    quizCache = quizCache.flat();
    if (!quizCache.some((v) => v.title == newV.title && v.part == newV.part)) {
      quizCache.push(newV);
      localStorage.setItem("quizCache", JSON.stringify(quizCache));
      console.log("quizCahe pushed title:" + newV.title);
    }
  }

  // 問題セットを生成
  async function generateQuizSet(num: number, setCounter: React.Dispatch<React.SetStateAction<number>>) {
    try {
      const fetchedWords: string[] = await fetchRandomWords(num);
      const newQuizSet: Dictionary[] = [];
      for (let i = 0; i < fetchedWords.length; i++) {
        const doc: Document = await fetchWiktionary(fetchedWords[i]);
        const newQuiz: Dictionary = getDefinition(doc, fetchedWords[i]);
        console.log(newQuiz);
        if (newQuiz.definition == "") {
          // definitionをフェッチできなかった 別の単語で再取得処理を入れる必要あり
          throw new Error(`Failed to fetch definition. ${fetchedWords[i]}`);
        }
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
      console.log(error);
    }
  }

  // RandoAPIからランダムな単語をフェッチ
  async function fetchRandomWords(num: number) {
    try {
      const resRaw = await fetch("https://random-word-api.vercel.app/api?words=" + num);
      const res:string[] = JSON.parse( await resRaw.text() );
      // console.log("Success: fetch from Rando : " + res);
      return res;
    } catch (error) {
      alert("Failed to fetch from Rando: " + error);
      throw error;
    }
  }

  // WiktionaryAPIからHTML文書をフェッチ、余分な箇所を削除する
  async function fetchWiktionary(title: string) {
    try {
      const resRaw = await fetch(`https://en.wiktionary.org/w/api.php?action=query&format=json&origin=*&prop=extracts&titles=${title}&callback=&formatversion=2`);
      const res = await resRaw.text();
      const resJSON = await JSON.parse(res.slice(5, -1));
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        resJSON.query.pages[0].extract,
        "text/html",
      );

      // English以降のH2と以降の要素を削除する。（他言語の定義をヒットさせないため）
      const docNative = doc;
      let deleteNextH2Native: boolean = false;
      let deletedH2Native: boolean = false;
      let foundEnglishH2Native: boolean = false;
      docNative.querySelectorAll("h2").forEach((e)=>{
        if (deletedH2Native) return;
        if (deleteNextH2Native) {
          let elmToDelete:Element|null = e;
          while(elmToDelete) {
            const nextElm:Element|null= elmToDelete.nextElementSibling;
            elmToDelete.remove();
            elmToDelete = nextElm;
          }
          deletedH2Native = true;
          return;
        }
        if (e.dataset.mwAnchor == "English") {
          deleteNextH2Native = true;
          foundEnglishH2Native = true;
        }
      });

      // この要素が存在しなければ、辞書に載っていない
      if (!foundEnglishH2Native) {
        throw new Error(`No english definition found. (title:${title})`);
      }

      // 説明文の中にdd,dl要素(類義語等)があると後々邪魔なので削除しておく
      docNative.querySelectorAll("dd").forEach((e)=>{e.remove()});
      // リスト内にまたリストが登場することがある(用途の限定など)
      docNative.querySelectorAll("li ol, li ul").forEach((e)=>{e.remove()});

      return docNative;
    } catch (error) {
      alert(`Failed to fetch from Wiktionary (title:${title}) : + ${error}`);
      throw error;
    }
  }

  // WiktionaryからフェッチしたHTMLから定義を取り出す
  function getDefinition(
    doc: Document,
    title: string,
    part: string = "Random",
  ): Dictionary {
    // 品詞の指定が無い場合ランダムに取得し、一番にヒットしたものを返す
    let partsToSearch: string[] = [];
    if (part == "Random") {
      const partsList = [
        "Adjective",
        "Adverb",
        "Determiner",
        "Interjection",
        "Noun",
        "Numeral",
        "Particle",
        "Preposition",
        "Pronoun",
        "Verb",
      ];
      while (partsList.length > 0) {
        partsToSearch.push(
          partsList.splice(Math.floor(Math.random() * partsList.length), 1)[0],
        );
      }
    } else {
      partsToSearch = [part];
    }

    let definition: string = "";
    let foundPart: string = "";
    for (let i = 0; definition == "" && i < partsToSearch.length; i++) {
      if(doc.querySelectorAll(`[data-mw-anchor="${partsToSearch[i]}"]`).length == 0){
        continue;
      }
      // テキスト部分を取得
      doc.querySelector(`[data-mw-anchor="${partsToSearch[i]}"]`)?.nextElementSibling?.nextElementSibling?.childNodes.forEach((v)=>{
        if (definition != "") {
          return;
        }
        const txt = v.textContent?.split(/\[/)[0].trim();
        if (txt == "" || txt == undefined) {
          return;
        }
        definition = txt;
      });

      if (definition == "") {
        console.log(
          `${partsToSearch[i]}: definition found, but failed to clip certain information.`,
        );
        continue;
      }
      foundPart = partsToSearch[i];
    }
    return { title: title, part: foundPart, definition: definition };
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
    console.log("ans: " + ansIndex);
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
    initTfTable(newQuiz.length);
    setIsResult(false);
    setIsPlaying(true);
  }

  // 問題数の入力フォーム更新イベント
  function handleNumChange(e:any){
    let num = Number(e.target.value);
    if(num < 1) num = 1;
    if(num > 50) num = 50;
    setNumWords(num);
  }

  // リロード エラー時に使う
  function reload() {
    window.location.reload();
  }

  return (
    <Container sx={{height: '100%'}}>
      {isLoading ? (
        <Container maxWidth="sm" sx={{height: '100%', display: 'flex', textAlign: 'center', justifyContent: 'center', alignItems: 'center'}}>
          <Box>
            <Typography variant="h3">
              loading...
            </Typography>
            <CircularProgressWithLabel sx={{m:"1em"}} size={"4rem"} value={ loadingCounter / (numWords + numExtraQuizSet) * 100 }/>
          </Box>
        </Container>
      ) : isPlaying ? (
        <Container maxWidth="sm" sx={{height: '90%', display: 'flex', textAlign: 'center', justifyContent: 'center', alignItems: 'center'}}>
          <Stack spacing={2}>
            <TfTable arr={tfTable} gameIndex={gameIndex} />
            <Typography variant="h3">{quizSet[gameIndex].title}</Typography>
            <Stack spacing={2}>
            {options.map((v, i) => {
              return (
                <Typography 
                  variant="subtitle1" 
                  key={i} 
                  align={"left"}
                  onClick={() => {handleClickOption(i)}}
                  sx={{
                    borderRadius: 2,
                    boxShadow: 2,
                    background: theme==="dark"?"#333":"#FFF",
                    p: 1,
                  }}
                >
                    {`(${v.part}) ${v.definition}`}
                </Typography>
              );
            })}
            </Stack>
          </Stack>
        </Container>
      ) : isResult ? (
        <Container maxWidth="md" sx={{height: '90%', display: 'flex', textAlign: 'center', justifyContent: 'center', alignItems: 'center'}}>
          <Stack spacing={2}>
            <Typography variant="h5" >
                Result
            </Typography>
            <TfTable arr={tfTable} gameIndex={gameIndex} />
            <Stack spacing={1} direction="row" sx={{textAlign: 'center', justifyContent: 'center', alignItems: 'center'}}>
              <Button 
                  style={{textTransform:"none"}}
                  variant="outlined"
                  onClick={handleClickBack}
              >
                Back
              </Button>
              {tfTable.some((v) => !v) ? (
                <Button 
                style={{textTransform:"none"}}
                variant="outlined"
                onClick={handleClickRevenge}
                >
                  Retry Mistakes
                </Button>
              ) : null}
            </Stack>
            <Divider/>
            <Container className={classes.resultBox} 
              sx={{
                borderRadius: 1,
                boxShadow: 1,
                background: theme==="dark"?"#252525":"#FEFEFE",
                p: 1,
            }}>
              <Stack spacing={2}>
                {quizSet.map((v, i) => {
                  const c: string = tfTable[i] ? "success" : "error";
                  return (
                    <Grid 
                      key={i+"p"}
                      container 
                      spacing={1}
                      sx={{
                        borderRadius: 1,
                        boxShadow: 1,
                        background: theme==="dark"?"#333":"#FFF",
                        p: 1,
                        textAlign: 'left', 
                        alignItems: 'center'
                      }}>
                      <Grid size={11} key={i+"t"}>
                        <Typography color={c} variant="h5">{`${v.title}`}</Typography>
                        <Typography color={c} variant="subtitle1">{`(${v.part}) ${v.definition}`}</Typography>
                      </Grid>
                      <Grid size={1} key={i+"d"}></Grid>
                    </Grid>
                  );
                })}
              </Stack>
            </Container>
          </Stack>
        </Container>
      ) : (
        <Container maxWidth="sm" sx={{height: '90%', display: 'flex', textAlign: 'center', justifyContent: 'center', alignItems: 'center'}}>
          <Stack spacing={2}>
            <Typography variant="h2" sx={{textAlign: 'center', justifyContent: 'center', alignItems: 'center'}}>
              Wiktionary Game
            </Typography>
            <Divider/>
            <Stack spacing={2} direction="row" sx={{justifyContent: 'center', alignItems: 'center'}}>
              <TextField 
                sx={{ m: 1, width: '20ch' }}
                id="outlined-basic" 
                label="Number of Questions" 
                type="number" 
                variant="outlined" 
                value={numWords} onChange={handleNumChange}/>
              <Button 
                style={{textTransform:"none"}}
                variant="contained"
                onClick={()=>{handleClickStart(numWords);}}
              >
                Start
              </Button>
            </Stack>
          </Stack>
        </Container >
      )}
    </Container>
  );
}

export default Game;
