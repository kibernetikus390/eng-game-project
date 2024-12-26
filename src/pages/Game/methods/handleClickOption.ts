import { Dictionary } from "..";
import { HistoryContextType } from "../../../contexts/HistoryContext";

export default function handleClickOption(
    optionIndex: number,
    correctOptionIndex: number,
    gameIndex: number,
    tfTable: boolean[],
    setTfTable: React.Dispatch<React.SetStateAction<boolean[]>>,
    quizSet: Dictionary[],
    addHistory: HistoryContextType["addHistory"],
    setGameIndex: React.Dispatch<React.SetStateAction<number>>,
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>,
    setIsResult: React.Dispatch<React.SetStateAction<boolean>>,
    isJudge: boolean,
    setIsJudge: React.Dispatch<React.SetStateAction<boolean>>,
) {
    if(isJudge){
      setIsJudge(false);
      setGameIndex(gameIndex+1);
      if (gameIndex < quizSet.length - 1) {
        return;
      }
      // リザルト画面へ
      setIsPlaying(false);
      setIsResult(true);
    } else {
      setIsJudge(true);
      const correct = optionIndex == correctOptionIndex;
      if (correct) {
        const newTfTable = tfTable;
        newTfTable[gameIndex] = true;
        setTfTable(newTfTable);
      } else {
        // console.log("wrong");
      }
      addHistory(quizSet[gameIndex].title, quizSet[gameIndex].part, quizSet[gameIndex].definition, correct);
    }
};