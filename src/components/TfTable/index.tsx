// import { useEffect, useState } from "react";

function TfTable(props: {arr: boolean[], gameIndex: number}) {
  return (
    <div>
      {props.arr.map((v, i) => {
        return (
          <span key={i}>
            {v === true ? "〇" : props.gameIndex <= i ? "-" : "×"}
          </span>
        );
      })}
    </div>
  );
}

export default TfTable;
