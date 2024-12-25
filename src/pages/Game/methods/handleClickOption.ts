import { Dictionary } from "..";
import { HistoryContextType } from "../../../contexts/HistoryContext";

export default function handleClickOption(
    optionIndex: number,
    correctOptionIndex: number,
    gameIndex: number,
    tfTable: boolean[],
    setTfTable: React.Dispatch<boolean[]>,
    quizSet: Dictionary[],
    addHistory: HistoryContextType["addHistory"],
    setGameIndex: React.Dispatch<number>,
    setIsPlaying: React.Dispatch<boolean>,
    setIsResult: React.Dispatch<boolean>,
) {
    const correct = optionIndex == correctOptionIndex;
    if (correct) {
      const newTfTable = tfTable;
      newTfTable[gameIndex] = true;
      setTfTable(newTfTable);
    } else {
      // console.log("wrong");
    }
    addHistory(quizSet[gameIndex].title, quizSet[gameIndex].part, quizSet[gameIndex].definition, correct);
    setGameIndex(gameIndex+1);
    if (gameIndex < quizSet.length - 1) {
      return;
    }
    // リザルト画面へ
    setIsPlaying(false);
    setIsResult(true);
};