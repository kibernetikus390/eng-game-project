import {
  Stack,
  Typography,
  Container,
  Button,
  Divider,
  Checkbox,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { Dictionary } from ".";
import getCorrectWrongColor from "../../util/getCorrectWrongColor";
import { useContext } from "react";
import { DictionaryContext } from "../../contexts/DictionaryContext";
import { KEY_NIGATE_LIST } from "../../providers/DictionaryContextProvider";

type GameResultProps = {
  correctNum: number;
  quizSet: Dictionary[];
  tfTable: boolean[];
  theme: string;
  handleClickBack: () => void;
  handleClickRevenge: () => void;
};

export default function GameResult(props: GameResultProps) {
  const { isWordInNigateList, addWords, removeWord } =
    useContext(DictionaryContext);
  const checkedArr = genCheckedArr();
  function genCheckedArr() {
    const newArr = Array(props.quizSet.length);
    for (let i = 0; i < props.quizSet.length; i++) {
      // TODO: 苦手リストにある場合trueにする
      newArr[i] = isWordInNigateList(props.quizSet[i]);
    }
    return newArr;
  }

  function handleCheck(checked: boolean, index: number) {
    if (checked) {
      removeWord(KEY_NIGATE_LIST, props.quizSet[index]);
    } else {
      addWords(KEY_NIGATE_LIST, [props.quizSet[index]]);
    }
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        height: "90%",
        display: "flex",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h3">
          {`${props.correctNum} / ${props.quizSet.length}`}
        </Typography>
        <Stack
          spacing={1}
          direction="row"
          sx={{
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            style={{ textTransform: "none" }}
            variant="outlined"
            onClick={props.handleClickBack}
          >
            Back
          </Button>
          {props.tfTable.some((v) => !v) ? (
            <Button
              style={{ textTransform: "none" }}
              variant="outlined"
              onClick={props.handleClickRevenge}
            >
              Retry Mistakes
            </Button>
          ) : null}
        </Stack>
        <Divider />
        <TableContainer component={Paper} sx={{ maxHeight: "60vh" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontSize: "small" }}>
                  Add Weak list
                </TableCell>
                <TableCell>Word</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.quizSet.map((v, i) => (
                <TableRow key={i}>
                  <TableCell key={i + "weak"} align="center">
                    <Checkbox
                      checked={checkedArr[i]}
                      onClick={() => {
                        handleCheck(checkedArr[i], i);
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{ color: getCorrectWrongColor(props.tfTable[i]) }}
                    key={i + "word"}
                  >
                    <Typography
                      color={getCorrectWrongColor(props.tfTable[i])}
                      variant="h5"
                    >{`${v.title}`}</Typography>
                    <Typography
                      color={getCorrectWrongColor(props.tfTable[i])}
                      variant="subtitle1"
                    >{`(${v.part}) ${v.definition}`}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Container>
  );
}
