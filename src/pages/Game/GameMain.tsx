import {
    Stack,
    Typography,
    Container,
  } from "@mui/material";
import { Dictionary } from ".";
import TfTable from "../../components/TfTable/";

type GameMainProps = {
    tfTable: boolean[];
    gameIndex: number;
    quizSet: Dictionary[];
    options: Dictionary[];
    memHandleClickOption: (clickedOptionIndex:number)=>void;
    theme:string;
    isJudge:boolean;
    correctIndex:number;
}

export default function GameMain(props:GameMainProps){


    return (
        <Container
          maxWidth="sm"
          sx={{
            height: "90%",
            display: "flex",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Stack spacing={2}>
            <TfTable arr={props.tfTable} gameIndex={props.gameIndex} isJudge={props.isJudge} />
            <Typography variant="h3">{props.quizSet[props.gameIndex].title}</Typography>
            <Stack spacing={2}>
              {props.options.map((v, i) => {
                const optionColor:string = (i === props.correctIndex ? "success" : "");
                return (
                  <Typography
                    color={props.isJudge?optionColor:""}
                    variant="subtitle1"
                    key={i}
                    align={"left"}
                    onClick={() => {
                        props.memHandleClickOption(i);
                    }}
                    sx={{
                      // fontWeight: props.isJudge && (i === props.correctIndex) ? "bold" : "medium",
                      borderRadius: 2,
                      boxShadow: props.isJudge && i === props.correctIndex ? 8 : 2,
                      background: props.theme === "dark" ? "#333" : "#FFF",
                      p: 1,
                    }}
                  >
                    {v.part.trim()==="" ? `${v.definition}` : `(${v.part}) ${v.definition}`}
                  </Typography>
                );
              })}
            </Stack>
          </Stack>
        </Container>
      )
}