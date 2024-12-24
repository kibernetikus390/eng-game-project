import {
  Stack,
  Typography,
  Container,
  TextField,
  Button,
  Divider,
  MenuItem,
} from "@mui/material";
import { DictionaryContextType } from "../../contexts/DictionaryContext";

export type GameStartProps = {
  quizSource: string;
  handleChangeQuizSource: (e:React.ChangeEvent<HTMLInputElement>) => void;
  dictionaries: DictionaryContextType["dictionaries"];
  getLength: DictionaryContextType["getLength"];
  numWords: number;
  handleNumChange: (e: React.ChangeEvent<HTMLInputElement>)=>void;
  handleClickStart: (num: number, source: string)=>void;
}

export default function GameStart(props:GameStartProps) {
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
        <Typography
          variant="h2"
          sx={{
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Wiktionary Game
        </Typography>
        <Divider />
        <Stack
          spacing={2}
          direction="row"
          sx={{ justifyContent: "center", alignItems: "center" }}
        >
          <TextField
            select
            sx={{ m: 1, width: "15ch" }}
            id="question-source"
            label="Question Source"
            defaultValue={"Random"}
            value={props.quizSource}
            onChange={props.handleChangeQuizSource}
          >
            <MenuItem value={"Random"}>Random</MenuItem>
            {Object.keys(props.dictionaries).map((v, i) => {
              return props.getLength(v) === 0 ? null : (
                <MenuItem value={v} key={i}>
                  {v}
                </MenuItem>
              );
            })}
          </TextField>
          <TextField
            sx={{ m: 1, width: "20ch" }}
            id="outlined-basic"
            label="Number of Questions"
            type="number"
            variant="outlined"
            value={props.numWords}
            onChange={props.handleNumChange}
          />
          <Button
            style={{ textTransform: "none" }}
            variant="contained"
            onClick={() => {
              props.handleClickStart(props.numWords, props.quizSource);
            }}
            disabled={props.numWords === 0 ? true : false}
          >
            Start
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
