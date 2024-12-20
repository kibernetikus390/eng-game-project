// import { useEffect, useState } from "react";

type tfTableProps = {
  arr: boolean[];
  gameIndex: number;
};

function TfTable(props: tfTableProps) {
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
