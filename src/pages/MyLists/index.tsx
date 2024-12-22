import { useState } from 'react';
import { Button, Grid2 as Grid, Stack, Container, TextField, Typography, MenuItem, Paper} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function MyLists() {

  // マイリストの名前の一覧
  let ls = localStorage.getItem("MyLists")
  let lsArr: string[] = [];
  if( ls !== null ){
      lsArr = JSON.parse(ls);
  }
  const listOfMyLists: string[] = lsArr;

  console.log(lsArr.length);
  
  const [selectList, setSelectList] = useState<string>(lsArr.length==0 ? "" : lsArr[0]);
  const [wordToAdd, setWordToAdd] = useState<string>("");

  const [wordList, setWordList] = useState<string[]>(initWordList());

  function initWordList(){
    if(lsArr.length === 0){
      return[];
    }
    const lsWordList = localStorage.getItem(selectList);
    if(lsWordList != null){
      return JSON.parse(lsWordList);
    }
    return [];
  }

  function handleClickRemoveWord(word: string) {
    const newWordList = [...wordList];
    const index = newWordList.findIndex((v) => v==word);
    newWordList.splice(index,1);
    localStorage.setItem(selectList, JSON.stringify(newWordList));
    setWordList(newWordList);
  }

  function handleClickAddWord(word: string){
    const newWordList = [...wordList];
    if( newWordList.some((v) => v==word) ){
      return;
    }
    newWordList.push(word);
    localStorage.setItem(selectList, JSON.stringify(newWordList));
    setWordList(newWordList);
  }

  function handleClickDeleteList(listName: string){
    console.log(listName);
    localStorage.removeItem(listName);
    let ls = localStorage.getItem("MyLists")
    if(ls === null ) return;
    let lsArr: string[] = JSON.parse(ls);
    const index = lsArr.findIndex((v)=>v==listName); 
    lsArr.splice(index, 1);
    localStorage.setItem("MyLists", JSON.stringify(lsArr));
    setSelectList("");
  }
  

  return(
    <Container maxWidth="lg" sx={{height: '90%', display: 'flex', textAlign: 'center', justifyContent: 'center', alignItems: 'center'}}>
      <Stack spacing={2} sx={{justifyContent: 'center', alignItems: 'center'}}>
        <Typography variant='h2'>My lists</Typography>
        {
          selectList.length !== 0 ? 
          <Container>
            <Stack spacing={2} direction={"row"}  sx={{justifyContent: 'center', alignItems: 'center'}}>
              <TextField
                select
                sx={{ m: 1, width: '15ch' }}
                id="question-source"
                label="List to Edit"
                defaultValue={lsArr[0]}
                value={selectList}
                onChange={(e)=>{setSelectList(e.target.value as string)}}
              >
                {
                  listOfMyLists.map((v,i)=>{
                    return <MenuItem value={v} key={i}>{v}</MenuItem>
                  })
                }
              </TextField>
              <TextField
                sx={{ m: 1, width: '15ch' }}
                id="word-to-add"
                label="Add new word"
                value={wordToAdd}
                onChange={(e)=>{setWordToAdd(e.target.value as string)}}
              />
              <Button 
                style={{textTransform:"none", width:"5ch"}}
                variant="contained"
                onClick={()=>{handleClickAddWord(wordToAdd)}}
              >
                Add
              </Button>
              <Button 
                color="error"
                style={{textTransform:"none", width:"15ch"}}
                variant="contained"
                onClick={()=>{handleClickDeleteList(selectList)}}
              >
                Delete List
              </Button>
            </Stack>
            <Container sx={{marginTop:2, overflow:"scroll", overflowX:"hidden", height:"50vh"}}> 
              <Grid container spacing={2}>
              {
                  wordList.map((v,i)=>{
                    return (
                      <Grid size={4} key={i} sx={{display: 'flex', textAlign: 'center', justifyContent: 'center', alignItems: 'center'}}>
                        {v}
                        <CloseIcon fontSize='small' sx={{display: 'inline'}} onClick={()=>{handleClickRemoveWord(v)}}/>
                      </Grid>
                    )
                  })
                }
              </Grid>
            </Container>
          </Container>
         : null
        }
        
      </Stack>
    </Container>
  );
}

export default MyLists;