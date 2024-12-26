// RandoAPIからランダムな単語を1つフェッチ
export default async function fetchOneRandomWord(
  words: string[]=[], // これに含まれない単語をフェッチする
  fetchRandomWords: (n: number) => Promise<string[]>,
) {
  try {
    while (true) {
      const newWord = (await fetchRandomWords(1))[0];
      if (words.some((v) => v == newWord)) {
        continue;
      }
      return newWord;
    }
  } catch (error) {
    throw error;
  }
}
