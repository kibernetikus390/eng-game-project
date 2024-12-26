import { Dictionary } from "..";

// 選択肢を生成
export default function generateOptions(
  quizSet: Dictionary[],
  extraSet: Dictionary[],
  gameIndex: number,
  setCorrectOptionIndex: React.Dispatch<React.SetStateAction<number>>,
  setOptions: React.Dispatch<React.SetStateAction<Dictionary[]>>,
) {
  const allSet: Dictionary[] = [...quizSet, ...extraSet];
  const newOptions: Dictionary[] = [];
  for (let i = 0; i < 4; i++) {
    const op = allSet.splice(Math.floor(Math.random() * allSet.length), 1)[0];
    if(newOptions.some((v)=>v.title===op.title)){
      // 取り出した単語が既に選択肢リストにあるならやり直す
      i--;
      continue;
    }
    newOptions.push(op);
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
  // console.log(newOptions);
  // console.log("ans: " + ansIndex);
  setOptions(newOptions);
}
