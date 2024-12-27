// 正誤表を初期化
export default function initTfTable(
  num: number,
  setTfTable: React.Dispatch<React.SetStateAction<boolean[]>>
) {
  const newTfTable: boolean[] = Array(num).fill(false);
  setTfTable(newTfTable);
}
