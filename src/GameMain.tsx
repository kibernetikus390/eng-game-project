import { useState } from "react";
import $ from "jquery";

type Dictionary = {
	title: string;
	part: string;
	definition: string;
};

function GameMain() {
    // ロード中
    const [loading, setLoading] = useState<boolean>(false);
    // ローディング進度
    const [loadingCounter, setLoadingCounter] = useState<number>(0);
    // ゲーム進行中
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    // 出題数
    const [numWords, setNumWords] = useState<number>(10);
    // 出題リスト
    const [quizSet, setQuizSet] = useState<Dictionary[]>([]);
    // 選択肢用の追加のquizSet
    const [extraSet, setExtraSet] = useState<Dictionary[]>([]);
    // ↑の数。とりあえず定数で
    const numExtraQuizSet = 4;

    async function handleClickStart() {
        console.log(`clicked start button: numWords=${numWords}`);
        setLoading(true);
        setLoadingCounter(0);
        try{
            // 出題リスト
            let newQuizSet = await generateDictionary(numWords, setLoadingCounter);
            setQuizSet(()=>[...newQuizSet]);
            // 選択肢用の追加リスト
            let newExtraSet = await generateDictionary(numExtraQuizSet, setLoadingCounter);
            setExtraSet(()=>[...newExtraSet]);
        } catch(error) {
            alert(error);
            window.location.reload();
        }
        setLoading(false);
        setIsPlaying(true);
    }

    async function generateDictionary( num:number, setCounter:any=undefined ){
        try{
            let fetchedWords:string[] = await fetchRandomWords(num);
            let newQuizSet:Dictionary[] = [];
            for(let i = 0; i < fetchedWords.length; i++){
                let $doc:JQuery<Document> = await fetchWiktionary(fetchedWords[i]);
                let newQuiz:Dictionary = getDefinition( $doc, fetchedWords[i] );
                console.log(newQuiz);
                if(newQuiz.definition == ""){
                    // definitionをフェッチできなかった 別の単語で再取得処理を入れる
                    throw new Error(`Failed to fetch definition. ${fetchedWords[i]}`);
                }
                newQuizSet.push(newQuiz);
                if(setCounter != undefined){
                    (setCounter as React.Dispatch<React.SetStateAction<number>>)((prev)=>prev+1);
                }
            }
            return newQuizSet;
        }catch(error){
            throw error;
        }
    }

    async function fetchRandomWords( num:number ){
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

    // WiktionaryAPIからHTML文書を取得、余分な箇所を削除する
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

    // jQueryDocumentから定義を取り出す
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
                let txt = $(val).text().trim();
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

    return (
        <>
            {
                loading ?
                <>
                    <p>loading...</p>
                    <p>{`quizSet: ${Math.min(numWords,loadingCounter)} / ${numWords}`}</p>
                    <p>{`extraSet: ${Math.max(0,loadingCounter-numWords)} / ${numExtraQuizSet}`}</p>
                </>
                :
                isPlaying ?
                <>
                    <h2>Quiz Set</h2>
                    {quizSet.map((v,i)=>{
                        return (
                            <div key={i}>
                                <h2>{v.title}</h2>
                                <p>{`${v.part} : ${v.definition}`}</p>
                            </div>
                        )
                    })}
                    <hr/>
                    <h3>Extra Set for generating options</h3>
                    {extraSet.map((v,i)=>{
                        return (
                            <div key={i}>
                                <h4>{v.title}</h4>
                                <h5>{`${v.part} : ${v.definition}`}</h5>
                            </div>
                        )
                    })}
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