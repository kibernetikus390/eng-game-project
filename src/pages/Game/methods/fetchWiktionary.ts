// WiktionaryAPIからHTML文書をフェッチ、余分な箇所を削除する
export default async function fetchWiktionary(title: string, signal:AbortSignal) {
  try {
    const resRaw = await fetch(
      `https://en.wiktionary.org/w/api.php?action=query&format=json&origin=*&prop=extracts&titles=${title}&callback=&formatversion=2`,
      {signal: signal}
    );
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
    docNative.querySelectorAll("h2").forEach((e) => {
      if (deletedH2Native) return;
      if (deleteNextH2Native) {
        let elmToDelete: Element | null = e;
        while (elmToDelete) {
          const nextElm: Element | null = elmToDelete.nextElementSibling;
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
    docNative.querySelectorAll("dd").forEach((e) => {
      e.remove();
    });
    // リスト内にまたリストが登場することがある(用途の限定など)
    docNative.querySelectorAll("li ol, li ul").forEach((e) => {
      e.remove();
    });

    return docNative;
  } catch (error) {
    console.log(
      `Failed to fetch from Wiktionary (title:${title}) : + ${error}`,
    );
    throw error;
  }
}
