import { Dictionary } from "..";

// 問題をローカルストレージに保存
export default function addQuizCache(newV: Dictionary) {
  let quizCacheString = localStorage.getItem("quizCache");
  if (quizCacheString == null) {
    quizCacheString = "[]";
  }
  let quizCache: Dictionary[] = JSON.parse(quizCacheString);
  quizCache = quizCache.flat();
  if (!quizCache.some((v) => v.title == newV.title && v.part == newV.part)) {
    quizCache.push(newV);
    localStorage.setItem("quizCache", JSON.stringify(quizCache));
    console.log("quizCahe pushed title:" + newV.title);
  }
}
