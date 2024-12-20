import { useState } from "react";

type Quiz = {
  title: string;
  part: string;
  definition: string;
};

function TestWiktionary() {
  const [title, setTitle] = useState("hello");
  const [part, setPart] = useState("Interjection");
  const [quiz, setQuiz] = useState<Quiz[]>([]);

  function getDefinitionPart(
    doc: Document,
    part: string,
    title: string,
    getAllPart: boolean,
  ) {
    let definition: string = "";
    if (doc.querySelectorAll(`[data-mw-anchor="${part}"]`).length == 0) {
      if (!getAllPart)
        alert(`no definition exist {title:${title}, part:${part}}`);
      return "";
    }
    // テキスト部分を取得
    //definition = $doc.find(`[data-mw-anchor="${part}"]`).next().next().children().first().text().trim();
    doc.querySelector(`[data-mw-anchor="${part}"]`)?.nextElementSibling?.nextElementSibling?.childNodes.forEach((v)=>{
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
        part + ": definition found, but failed to clip certain information.",
      );
      return "";
    }
    return definition;
  }

  const fetchTest = async (title: string, part: string) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
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

    // 捜索する品詞
    let partsToSearch: string[] = [];
    let getAllPart: boolean = false;
    if (part == "Random" || part == "All") {
      if (part == "All") {
        getAllPart = true;
      }
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
    } else if (part != undefined) {
      partsToSearch = [part];
    }

    let definition: string = "";
    const newQuiz: Quiz[] = [];
    let i = 0;
    while (definition == "" && i < partsToSearch.length) {
      console.log("searchin: " + partsToSearch[i]);

      definition = getDefinitionPart(doc, partsToSearch[i], title, getAllPart);
      console.log(`${partsToSearch[i]}: ${definition}`);

      if (definition != "") {
        newQuiz.push({
          title: title,
          part: partsToSearch[i],
          definition: definition,
        });
        if (getAllPart) {
          definition = "";
        }
      }
      i++;
    }

    setQuiz(newQuiz);
  };

  function handleClick(e: React.MouseEvent<HTMLInputElement>) {
    console.log("clicked on : " + e.target);
    // console.log(`title:${title} part:${part}`);
    fetchTest(title, part);
  }

  return (
    <>
      {quiz.map((o, i) => {
        return (
          <div key={`quiz[${i}]`}>
            {i == 0 ? <h1 key={`${i}.title`}>{o.title}</h1> : null}
            <p key={`${i}.definition`}>{`${o.part}: ${o.definition}`}</p>
          </div>
        );
      })}
      {quiz.length === 0 ? null : <hr />}
      <p>単語と品詞を指定して、wiktionaryから定義を取得します。</p>
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
        <option value="Determiner">Determiner</option>
        <option value="Interjection">Interjection</option>
        <option value="Noun">Noun</option>
        <option value="Numeral">Numeral</option>
        <option value="Particle">Particle</option>
        <option value="Preposition">Preposition</option>
        <option value="Pronoun">Pronoun</option>
        <option value="Verb">Verb</option>
      </select>
      <input type="submit" value="送信" onClick={handleClick} />
    </>
  );
}

export default TestWiktionary;
