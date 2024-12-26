import { Dictionary } from "..";

export const partsList = [
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

// WiktionaryからフェッチしたHTMLから定義を取り出す
export default function getDefinition(
  doc: Document,
  title: string,
  part: string = "Random",
): Dictionary {
  // 品詞の指定が無い場合ランダムに取得し、一番にヒットしたものを返す
  let partsToSearch: string[] = [];
  if (part == "Random") {
    
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
    if (
      doc.querySelectorAll(`[data-mw-anchor="${partsToSearch[i]}"]`).length == 0
    ) {
      continue;
    }
    // テキスト部分を取得
    doc
      .querySelector(`[data-mw-anchor="${partsToSearch[i]}"]`)
      ?.nextElementSibling?.nextElementSibling?.childNodes.forEach((v) => {
        if (definition != "") {
          return;
        }
        const txt = v.textContent?.split(/\[/)[0].trim();
        if (txt == "" || txt == undefined || txt == null) {
          return;
        }
        definition = txt;
      });

    definition = String(definition);
    if (
      definition == "" ||
      definition.match(/^[(]\w*[)]$/) || // 不具合で()しかないもの
      definition.match(/^((simple)?(present)?(past)?) ((past)?(participle)?)/,) || // 動詞活用
      definition.match(/^((comparative)?(superlative)? form of)/) // 比較級・最上級
    ) {
      console.log(
        `${partsToSearch[i]}: definition found, but failed to clip certain information.`,
      );
      definition = "";
      continue;
    }
    foundPart = partsToSearch[i];
  }
  return { title: title, part: foundPart, definition: definition };
}
