import { useState } from "react";
import $ from "jquery";

type Quiz = {
	title: string;
	part: string;
	definition: string;
};

function TestWiktionaryAPI() {
	const [title, setTitle] = useState("hello");
	const [part, setPart] = useState("Interjection");
	const [quiz, setQuiz] = useState<Quiz[]>([]);
	
	function getDefinitionPart( $doc:JQuery<Document>, part:string, title:string, getAllPart:boolean ){
		let definition:string = "";
		if($doc.find(`[data-mw-anchor="${part}"]`).length == 0){
			if(!getAllPart) alert(`no definition exist {title:${title}, part:${part}}`);
			return "";
		}
		$doc.find(`[data-mw-anchor="${part}"]`).next().next().find(`li`).each(function(index,val){
			if( definition != "" ){
				return;
			}
			let txt = $(val).text().trim();
			if(/*txt.match(/^\(.*\)$/g) ||*/ txt == "" ){
				// console.log("skip");
				return;
			}
			definition = txt;
		});
		if(definition == ""){
			console.log(part + ": definition found, but failed to clip certain information.");
			return "";
		}
		return definition;
	}

	const fetchTest = async (title: string, part: string) => {
		await new Promise(resolve => setTimeout(resolve, 100));
		const response = await fetch(
			"https://en.wiktionary.org/w/api.php?action=query&format=json&origin=*&prop=extracts&titles=" +
			title +
			"&callback=&formatversion=2"
		);
		let resultJSONP:string = await response.text();
		let resultJSON:any = await JSON.parse(resultJSONP.slice(5, -1)); 
		const parser = new DOMParser();
		const doc = parser.parseFromString(
			resultJSON.query.pages[0].extract,
			"text/html"
		);
		console.log(doc);
		const $doc = $(doc);

		// English以降のH2と以降の要素を削除する。（他言語の定義をヒットさせないため）
		let deleteNextH2:boolean = false;
		let deletedH2:boolean = false;
		let foundEnglishH2:boolean = false;
		$doc.find('h2').each((i,e)=>{
			if(deletedH2) return;
			console.log(i,e)
			if( deleteNextH2 ){
				// console.log("deleted h2")
				$(e).nextAll().addBack().remove();
				deletedH2 = true;
				return;
			}
			if( $(e).data("mw-anchor") == "English" ){
				// console.log("eng")
				deleteNextH2 = true;
				foundEnglishH2 = true;
			}
		});
		
		// この要素が存在しなければ、辞書に載っていない
		if ( !foundEnglishH2 ) {
			alert(`Any english definition not found. (${title})`);
			return;
		}
		
		// 説明文の中にdd,dl要素(類義語等)があると後々邪魔なので削除しておく
		$doc.find("dd").remove();
		
		// 捜索する品詞
		let partsToSearch:string[] = [];
		let getAllPart:boolean = false;
		if(part == "Random" || part == "All") {
			if (part == "All") {
				getAllPart = true;
			}
			let partsList = [
				"Noun",
				"Adjective",
				"Adverb",
				"Preposition",
				"Interjection",
				"Verb",
			];
			while (partsList.length > 0) {
				partsToSearch.push(
					partsList.splice(Math.floor(Math.random() * partsList.length), 1)[0]
				);
			}
		} else if (part != undefined) {
			partsToSearch = [part];
		} 
		
		let definition:string = "";
		let newQuiz:Quiz[] = [];
		let i = 0;
		while (definition == "" && i < partsToSearch.length) {
			console.log("searchin: " + partsToSearch[i]);
			switch (partsToSearch[i]) {
				case "Noun":
					part = "Noun";
					definition = getDefinitionPart($doc, "Noun", title, getAllPart);
					console.log(`Noun: ${definition}`);
					break;
				case "Adjective":
					part = "Adjective";
					definition = getDefinitionPart($doc, "Adjective", title, getAllPart);
					console.log(`Adjective: ${definition}`);
					break;
				case "Adverb":
					part = "Adverb";
					definition = getDefinitionPart($doc, "Adverb", title, getAllPart);
					console.log(`Adverb: ${definition}`);
					break;
				case "Preposition":
					part = "Preposition";
					definition = getDefinitionPart($doc, "Preposition", title, getAllPart);
					console.log(`Preposition: ${definition}`);
					break;
				case "Interjection":
					part = "Interjection";
					definition = getDefinitionPart($doc, "Interjection", title, getAllPart);
					console.log(`Intr: ${definition}`);
					break;
				case "Verb":
					part = "Verb";
					definition = getDefinitionPart($doc, "Verb", title, getAllPart);
					console.log(`Verb: ${definition}`);
					break;
				default:
				definition = "Error: undefined part";
			}
			if(definition != "") {
				newQuiz.push({title:title, part:part, definition:definition});
				if(getAllPart) {
					definition = "";
				}
			}
			i++;
		}
		
		setQuiz(newQuiz);
	};
	
	function handleClick(e: React.MouseEvent<HTMLInputElement>) {
		// console.log("clicked on : " + e.target);
		// console.log(`title:${title} part:${part}`);
		fetchTest(title, part);
	}
	
	return (
		<>
			{quiz.map((o, i) => {
				return (
					<div key={`quiz[${i}]`}>
						<h1 key={`${i}.title`}>{o.title}</h1>
						<p key={`${i}.definition`}>{`${o.part}: ${o.definition}`}</p>
					</div>
				);
			})}
			{quiz.length === 0 ? null : <hr/>}
			<p>
				単語と品詞を指定して、wiktionaryから定義を取得します。
			</p>
			<input
				type="text"
				placeholder="単語"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>
			<select value={part} onChange={(e) => setPart(e.target.value)}>
				<option value="All">*ALL</option>
				<option value="Random">*Random</option>
				<option value="Adjective">Adjective</option>
				<option value="Adverb">Adverb</option>
				<option value="Interjection">Interjection</option>
				<option value="Noun">Noun</option>
				<option value="Preposition">Preposition</option>
				<option value="Verb">Verb</option>
			</select>
			<input type="submit" value="送信" onClick={handleClick} />
		</>
	);
}

export default TestWiktionaryAPI;
