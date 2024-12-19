import { useEffect, useState } from "react";
import $ from "jquery";
import TfTable from "./components/TfTable.tsx";

type Dictionary = {
	title: string;
	part: string;
	definition: string;
};

// 問題をWebAPIからフェッチ時、ローカルストレージにキャッシュする
const ADD_LS_QUIZ:boolean = true;
// 出題に、ローカルストレージにキャッシュした問題を使う
const USE_LS_QUIZ:boolean = true;

function GameMain() {
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

    // ローカルストレージ(quizCache)の表示テスト
    // useEffect(()=>{
    //     // localStorage.removeItem("quizCache")
    //     if( localStorage.getItem("quizCache") == null ){
    //         localStorage.setItem("quizCache", JSON.stringify([]));
    //     }
    //     let quizCahe = localStorage.getItem("quizCache");
    //     console.log("quizCache: " + quizCahe);
    // },[]);

    // 選択肢のクリックイベント　正誤判定して進行する
    function handleClickOption( optionIndex:number ) {
        if( optionIndex == correctOptionIndex ){
            // console.log("correct");
            let newTfTable = tfTable;
            newTfTable[gameIndex] = true;
            setTfTable( newTfTable );
        }else{
            // console.log("wrong");
        }
        setGameIndex((i)=>i+1);
        if(gameIndex < quizSet.length - 1){
            return;
        }
        // リザルト画面へ
        setIsPlaying(false);
        setIsResult(true);
    }

    // スタートボタンのクリックイベント
    async function handleClickStart() {
        console.log(`clicked start button: numWords=${numWords}`);
        setIsLoading(true);
        setLoadingCounter(0);
        
        if(USE_LS_QUIZ){
            // クイズをローカルストレージから生成する
            // フェッチに時間がかかるので今のところテスト用
            let newQuizSet:Dictionary[] = [];
            let newExtraSet:Dictionary[] = [];
            let cacheString = localStorage.getItem("quizCache");
            // 異常：ローカルストレージが空
            if( cacheString == null ){
                alert( `localStorage(quizCache) is null` );
                
                return;
            }
            let cache = JSON.parse(cacheString).flat();
            // 異常：キャッシュされた問題数が足りない
            if( cache.length < numWords + numExtraQuizSet){
                alert( `localStorage(quizCache) is null` );
                reload();
                return;
            }
            for(let i = 0; i < numWords; i++){
                newQuizSet.push(
                    cache.splice(Math.floor(Math.random() * cache.length), 1)[0]
                );
            }
            setQuizSet(()=>[...newQuizSet]);
            for(let i = 0; i < numExtraQuizSet; i++){
                newExtraSet.push(
                    cache.splice(Math.floor(Math.random() * cache.length), 1)[0]
                );
            }
            setExtraSet(()=>[...newExtraSet]);
        } else {
            // クイズをWebAPIから生成
            try{
                // 出題リスト
                let newQuizSet:Dictionary[] = await generateQuizSet(numWords, setLoadingCounter);
                setQuizSet(()=>[...newQuizSet]);
                // 選択肢用の追加リスト
                let newExtraSet:Dictionary[] = await generateQuizSet(numExtraQuizSet, setLoadingCounter);
                setExtraSet(()=>[...newExtraSet]);
            } catch(error) {
                alert(error);
                reload();
            }
        }
        
        setIsLoading(false);
        setIsPlaying(true);
        setGameIndex(0);
        initTfTable();
    }

    // 正誤表を初期化
    function initTfTable( ) {
        let newTfTable:boolean[] = Array(numWords).fill(false);
        setTfTable(newTfTable);
    }

    //　問題をローカルストレージに保存
    function addQuizCache( newV:Dictionary ) {
        let quizCacheString = localStorage.getItem("quizCache");
        if( quizCacheString == null){
            quizCacheString = "[]";
        }
        let quizCache:Dictionary[] = JSON.parse(quizCacheString);
        quizCache = quizCache.flat();
        if( !quizCache.some((v)=> v.title == newV.title && v.part == newV.part) ){
            quizCache.push(newV);
            localStorage.setItem("quizCache", JSON.stringify(quizCache));
            console.log("quizCahe pushed title:"+newV.title);
        }

    }

    // 問題セットを生成
    async function generateQuizSet( num:number, setCounter:any=undefined ) {
        try{
            let fetchedWords:string[] = await fetchRandomWords(num);
            let newQuizSet:Dictionary[] = [];
            for(let i = 0; i < fetchedWords.length; i++){
                let $doc:JQuery<Document> = await fetchWiktionary(fetchedWords[i]);
                let newQuiz:Dictionary = getDefinition( $doc, fetchedWords[i] );
                console.log(newQuiz);
                if(newQuiz.definition == ""){
                    // definitionをフェッチできなかった 別の単語で再取得処理を入れる必要あり
                    throw new Error(`Failed to fetch definition. ${fetchedWords[i]}`);
                }
                newQuizSet.push(newQuiz);
                if(ADD_LS_QUIZ){
                    addQuizCache(newQuiz);
                }
                // ローディング進捗表示用のカウンター
                if(setCounter != undefined){
                    (setCounter as React.Dispatch<React.SetStateAction<number>>)((prev)=>prev+1);
                }
            }
            return newQuizSet;
        }catch(error){
            throw error;
        }
    }

    // RandoAPIからランダムな単語をフェッチ
    async function fetchRandomWords( num:number ) {
        try {
            const res = await $.ajax({
                url: "https://random-word-api.vercel.app/api?words=" + num,
                method: "GET",
                dataType: "json"
            });
            console.log("Success: fetch from Rando")
            console.log(res)
            return res;
        } catch (error) {
            alert("Failed to fetch from Rando: " + error);
            throw error;
        }
    }

    // WiktionaryAPIからHTML文書をフェッチ、余分な箇所を削除する
    async function fetchWiktionary( title:string ){
        try {
            await new Promise(resolve => setTimeout(resolve, 10));
            const res = await $.ajax({
                url: `https://en.wiktionary.org/w/api.php?action=query&format=json&origin=*&prop=extracts&titles=${title}&callback=&formatversion=2`});
            console.log("Success: fetch from Wiktionary")
            // console.log(res)
            //let resJSONP:any = await res.text();
            let resJSON:any = await JSON.parse( res.slice(5, -1) ); 
            const parser = new DOMParser();
            const doc = parser.parseFromString(
                resJSON.query.pages[0].extract,
                "text/html"
            );
            const $doc = $(doc);

            // English以降のH2と以降の要素を削除する。（他言語の定義をヒットさせないため）
            let deleteNextH2:boolean = false;
            let deletedH2:boolean = false;
            let foundEnglishH2:boolean = false;
            $doc.find('h2').each((i,e)=>{
                if(deletedH2) return;
                if( deleteNextH2 ){
                    // console.log("deleted h2")
                    $(e).nextAll().addBack().remove();
                    deletedH2 = true;
                    return;
                }
                if( $(e).data("mw-anchor") == "English" ){
                    deleteNextH2 = true;
                    foundEnglishH2 = true;
                }
            });
            
            // この要素が存在しなければ、辞書に載っていない
            if ( !foundEnglishH2 ) {
                throw new Error(`No english definition found. (title:${title})`);
            }
            
            // 説明文の中にdd,dl要素(類義語等)があると後々邪魔なので削除しておく
            $doc.find("dd").remove();
            // リスト内にまたリストが登場することがある(用途の限定など)
            $doc.find("li ol, li ul").remove();
            
            return $doc;
        } catch(error) {
            alert(`Failed to fetch from Wiktionary (title:${title}) : + ${error}`);
            throw error;
        }
    }

    // WiktionaryからフェッチしたHTMLから定義を取り出す
    function getDefinition( $doc:JQuery<Document>, title:string, part:string = "Random" ):Dictionary{
        
        // 品詞の指定が無い場合ランダムに取得し、一番にヒットしたものを返す
        let partsToSearch:string[] = [];
        if(part == "Random") {
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
					partsList.splice(Math.floor(Math.random() * partsList.length), 1)[0]
				);
			}
		} else {
			partsToSearch = [part];
		}

        let definition:string = "";
        let foundPart:string = "";
		for (let i = 0; definition == "" && i < partsToSearch.length; i++) {
            if($doc.find(`[data-mw-anchor="${partsToSearch[i]}"]`).length == 0){
                // console.log(`no definition exist {part:${partsToSearch[i]}}`);
                continue;
            }
            // テキスト部分を取得
            //definition = $doc.find(`[data-mw-anchor="${partsToSearch[i]}"]`).next().next().children().first().text().trim();
            $doc.find(`[data-mw-anchor="${partsToSearch[i]}"]`).next().next().children().each(function(index,val){
                if( definition != "" ){
                    return;
                }
                let txt = $(val).text().split(/\[/)[0].trim();
                if(txt == ""){
                    return;
                }
                definition = txt;
            });

            if(definition == ""){
                console.log(`${partsToSearch[i]}: definition found, but failed to clip certain information.`);
                continue;
            }
            foundPart = partsToSearch[i];
		}
        return {title:title, part:foundPart, definition:definition};
    }

    // ゲーム進行時イベント　選択肢を生成する
    useEffect(()=>{
        if(gameIndex == -1 || isResult){
            return;
        }
        // 選択肢を生成
        let allSet:Dictionary[] = [...quizSet, ...extraSet];
        let newOptions:Dictionary[] = [];
        for(let i = 0; i < 4; i++){
            newOptions.push(
                allSet.splice(Math.floor(Math.random() * allSet.length), 1)[0]
            );
        }
        // 正答を挿入
        let ansIndex = newOptions.findIndex((e)=> e.title == quizSet[gameIndex].title);
        if( ansIndex == -1 ){
            let newIndex:number = Math.floor( Math.random() * 4 );
            newOptions[ newIndex ] = quizSet[gameIndex];
            setCorrectOptionIndex(newIndex);
        } else {
            setCorrectOptionIndex(ansIndex);
        }
        console.log(newOptions);
        setOptions(newOptions);
    },[gameIndex]);

    function handleClickBack() {
        setIsResult(false);
    }

    function reload() {
        window.location.reload();
    }

    return (
        <>
            {
                isLoading ?
                    <>
                        <p>loading...</p>
                        <p>{`quizSet: ${Math.min(numWords,loadingCounter)} / ${numWords}`}</p>
                        <p>{`extraSet: ${Math.max(0,loadingCounter-numWords)} / ${numExtraQuizSet}`}</p>
                    </>
                :
                isPlaying ?
                    <>
                        <TfTable arr={tfTable} gameIndex={gameIndex}/>
                        <h2>{quizSet[gameIndex].title}</h2>
                        {
                            options.map((v,i)=>{
                                return (
                                    <div key={i}>
                                        <p key={i} onClick={()=>{handleClickOption(i)}}>{`${v.part} : ${v.definition}`}</p>
                                    </div>
                                )
                            })
                        }
                    </>
                :
                isResult ?
                    <>
                        <h2>Result</h2>
                        <TfTable arr={tfTable} gameIndex={gameIndex}/>
                        <input type="submit" value="Back" onClick={handleClickBack}/>
                        <hr/>
                        <div style={{height:"200px", overflow:"scroll"}}>
                        {
                            quizSet.map((v,i)=>{
                                let c:string = tfTable[i] ? "green" : "red";
                                return <p key={i} style={{color:c}}>{`${v.title}: (${v.part}) ${v.definition}`}</p>
                            })
                        }
                        </div>
                    </>
                :
                    <>
                        <h1>Wiktionary Game</h1>
                        <input type="number" value={numWords} onChange={(e)=>{setNumWords(Number(e.target.value))}}/>
                        <input type="submit" value="Start" onClick={handleClickStart}/>
                    </>
            }
        </>
    );
}

export default GameMain;