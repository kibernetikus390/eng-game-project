import { useState } from "react";

function TestRando() {
  const [words, setWords] = useState<string[]>([]);
  const [numWords, setNumWords] = useState<number>(10);

  async function handleSubmit() {
    console.log("clicked. num:" + numWords);
    try {
      const resRaw = await fetch(
        "https://random-word-api.vercel.app/api?words=" + numWords,
      );
      const res: string[] = JSON.parse(await resRaw.text());
      setWords(res);
    } catch (error) {
      alert("Failed to fetch from Rando: " + error);
      throw error;
    }
  }

  return (
    <>
      <h1>Rando API Test</h1>
      <input
        type="number"
        value={numWords}
        onChange={(e) => setNumWords(Number(e.target.value))}
      />
      <input type="submit" value="Fetch" onClick={handleSubmit} />
      {words.map((v, i) => {
        return <p key={i}>{v}</p>;
      })}
    </>
  );
}

export default TestRando;
