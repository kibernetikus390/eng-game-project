  // RandoAPIからランダムな単語をフェッチ
  export default async function fetchRandomWords(num: number) {
    try {
      const resRaw = await fetch(
        "https://random-word-api.vercel.app/api?words=" + num,
      );
      const res: string[] = JSON.parse(await resRaw.text());
      return res;
    } catch (error) {
      console.log("Failed to fetch from Rando: " + error);
      throw error;
    }
  }