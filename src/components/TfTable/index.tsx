// import { useEffect, useState } from "react";
import { Container } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RemoveIcon from "@mui/icons-material/Remove";

const IconCircle = () => {
  return (
    <RadioButtonUncheckedIcon fontSize="small" sx={{ display: "inline" }} />
  );
};
const IconCross = () => {
  return <CloseIcon fontSize="small" sx={{ display: "inline" }} />;
};
const IconDash = () => {
  return <RemoveIcon fontSize="small" sx={{ display: "inline" }} />;
};

function TfTable(props: { arr: boolean[]; gameIndex: number; isJudge: boolean }) {
  return (
    <Container>
      {props.arr.map((v, i) => {
        return v === true ? (
          <IconCircle key={i} />
        ) : props.gameIndex <= (props.isJudge ? i-1 : i) ? (
          <IconDash key={i} />
        ) : (
          <IconCross key={i} />
        );
      })}
    </Container>
  );
}

export default TfTable;
