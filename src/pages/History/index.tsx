import { useContext, useState } from "react";
import {
  Container,
  Divider,
  Typography,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Stack,
} from "@mui/material";
import { HistoryContext } from "../../contexts/HistoryContext";
import { DictionaryContext } from "../../contexts/DictionaryContext";
import { KEY_NIGATE_LIST } from "../../providers/DictionaryContextProvider";
import getCorrectWrongColor from "../../util/getCorrectWrongColor";

export default function History() {
  const { isWordInNigateList, addWords, removeWord } =
    useContext(DictionaryContext);
  const { history } = useContext(HistoryContext);
  const [checkedArr, setCheckedArr] = useState<boolean[]>(genCheckedArr());

  function genCheckedArr() {
    const newArr = Array(history.length).fill(false);
    for (let i = 0; i < history.length; i++) {
      newArr[i] = isWordInNigateList({
        title: history[i].title,
        part: history[i].part,
        definition: history[i].def,
      });
    }
    return newArr;
  }

  function handleClickCheckBox(checked: boolean, i: number) {
    if (checked) {
      removeWord(KEY_NIGATE_LIST, {
        title: history[i].title,
        part: history[i].part,
        definition: history[i].def,
      });
    } else {
      addWords(KEY_NIGATE_LIST, [
        {
          title: history[i].title,
          part: history[i].part,
          definition: history[i].def,
        },
      ]);
    }
    const newChecked = [...checkedArr];
    for(let j = 0; j < newChecked.length; j++){
      if(history[i].title == history[j].title && history[i].part == history[j].part && history[i].def == history[j].def) {
        newChecked[j] = !checked;
      }
    }
    setCheckedArr(newChecked);
  }

  return (
    <Container
      sx={{
        height: "90vh",
        display: "flex",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {history.length === 0 ? (
        <Container>
          <Typography variant="h5">There is no history.</Typography>
          <Typography variant="body1">Play some game!</Typography>
        </Container>
      ) : (
        <Container maxWidth="lg">
          <Stack spacing={2}>
            <Typography variant="h5">History</Typography>
            <Divider />
            <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ fontSize: "small" }}>
                      Add Weak list
                    </TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Part</TableCell>
                    <TableCell>Definition</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((v, i) => (
                    <TableRow key={i}>
                      <TableCell key={i + "weak"} align="center">
                        <Checkbox
                          checked={checkedArr[i]}
                          onChange={() => {
                            handleClickCheckBox(checkedArr[i], i);
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{ color: getCorrectWrongColor(v.correct) }}
                        key={i + "title"}
                      >
                        {v.title}
                      </TableCell>
                      <TableCell
                        sx={{ color: getCorrectWrongColor(v.correct) }}
                        key={i + "part"}
                      >
                        {v.part}
                      </TableCell>
                      <TableCell
                        sx={{ color: getCorrectWrongColor(v.correct) }}
                        key={i + "def"}
                      >
                        {v.def}
                      </TableCell>
                      <TableCell
                        sx={{ color: getCorrectWrongColor(v.correct) }}
                        key={i + "date"}
                      >
                        {v.date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </Container>
      )}
    </Container>
  );
}
