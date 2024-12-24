import { useContext } from "react";
import { Container, Typography, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Checkbox } from "@mui/material";
import { HistoryContext } from "../../contexts/HistoryContext";
import { DictionaryContext } from "../../contexts/DictionaryContext";
import { KEY_NIGATE_LIST } from "../../providers/DictionaryContextProvider";

export default function History() {
  const { isWordInNigateList, addWords, removeWord } = useContext(DictionaryContext);
  const { history } = useContext(HistoryContext);
  const checkedArr = genCheckedArr();

  function genCheckedArr() {
    const newArr = Array(history.length);
    for(let i = 0; i < history.length; i++) {
      // TODO: 苦手リストにある場合trueにする
      newArr[i] = isWordInNigateList(history[i].title);
    }
    return newArr;
  }

  function getColor(correct: boolean) {
    return correct ? "green" : "red";
  }

  function handleClickCheckBox(checked:boolean, index:number){
    if(checked){
      removeWord(KEY_NIGATE_LIST, history[index].title);
    } else {
      addWords(KEY_NIGATE_LIST, [history[index].title]);
    }
  }

  return (
    <Container sx={{ height:"90vh", display:"flex", textAlign:"center", justifyContent:"center", alignItems:"center"}}>
        {
          (history.length === 0) ?
              <Container>
                <Typography variant="h5">There is no history.</Typography>
                <Typography variant="body1">Play some game!</Typography>
              </Container>
            : 
            <Container>
              <Typography variant="h5">History</Typography>
              <TableContainer component={Paper} sx={{maxHeight: "70vh"}}>
                <Table sx={{minWidth:650}} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" sx={{fontSize:"small"}}>Add Weak list</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Part</TableCell>
                      <TableCell>Definition</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      history.map((v,i)=>(
                        <TableRow key={i}>
                          <TableCell key={i+"weak"}><Checkbox checked={checkedArr[i]} onChange={()=>{handleClickCheckBox(checkedArr[i], i)}}/></TableCell>
                          <TableCell sx={{color:getColor(v.correct)}} key={i+"title"}>{v.title}</TableCell>
                          <TableCell sx={{color:getColor(v.correct)}} key={i+"part"}>{v.part}</TableCell>
                          <TableCell sx={{color:getColor(v.correct)}} key={i+"def"}>{v.def}</TableCell>
                          <TableCell sx={{color:getColor(v.correct)}} key={i+"date"}>{v.date}</TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </TableContainer>
              
            </Container>
        }
    </Container>
  );
}
