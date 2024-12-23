export default function formatDate(date:Date){
    const year = date.getFullYear(); // 年
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 月（0始まりなので+1）、2桁でゼロ埋め
    const day = String(date.getDate()).padStart(2, "0"); // 日、2桁でゼロ埋め
    const hours = String(date.getHours()).padStart(2, "0"); // 時間、2桁でゼロ埋め
    const minutes = String(date.getMinutes()).padStart(2, "0"); // 分、2桁でゼロ埋め
    const seconds = String(date.getSeconds()).padStart(2, "0"); // 秒、2桁でゼロ埋め
  
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}