import { useState, useRef } from 'react';
import { Button, Grid2 as Grid, Stack, Container, TextField, MenuItem, Divider} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function MyLists() {

  // マイリストの名前の一覧
  const ls = localStorage.getItem("MyLists")
  let namesMyLists: string[] = [];
  if( ls !== null ){
      namesMyLists = JSON.parse(ls);
  }
  const listOfMyLists: string[] = namesMyLists;
  const [selectList, setSelectList] = useState<string>(namesMyLists.length==0 ? "" : namesMyLists[0]);
  const [wordToAdd, setWordToAdd] = useState<string>("");
  const [wordList, setWordList] = useState<string[]>(initWordList());
  const [nameNewList, setNameNewList] = useState<string>("");
  const AddButtonRef = useRef<HTMLButtonElement>(null);

  function initWordList(){
    if(namesMyLists.length === 0){
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

  // TextfieldでEnter押したら、単語追加処理を行う
  function handleKeyDownAdd(e: React.KeyboardEvent<HTMLDivElement>){
    if(e.key === "Enter"){
      AddButtonRef.current?.click();
    }
  }

  // 単語を追加する
  function handleClickAddWord(str: string, nameList: string){
    const words = str.split(/[" ,]+/).filter((e)=>e!=="");

    if(nameList == ""){
      // 既存のリストに追加
      const newWordList = [...wordList];
      words.forEach((w,i)=>{
        if( newWordList.some((v) => v==w) ){
          words.splice(i,1);
        }
      });
      newWordList.push(...words);
      localStorage.setItem(selectList, JSON.stringify(newWordList));
      setWordList(newWordList);
    } else {
      // 新規作成
      localStorage.setItem(nameList, JSON.stringify(words));

      const lsMyLists = localStorage.getItem("MyLists");
      if(lsMyLists != null){
        const myLists = JSON.parse(lsMyLists);
        myLists.push(nameList);
        localStorage.setItem("MyLists", JSON.stringify(myLists));
      } else {
        localStorage.setItem("MyLists", JSON.stringify(nameList));
      }
      setSelectList(nameList);
      setNameNewList("");
      setWordList(words);
    }
    setWordToAdd("");
  }

  function handleClickDeleteList(listName: string){
    localStorage.removeItem(listName);
    const ls = localStorage.getItem("MyLists")
    if(ls === null ) return;
    const index = namesMyLists.findIndex((v)=>v==listName); 
    if( index === -1 ) return;
    namesMyLists.splice(index, 1);
    localStorage.setItem("MyLists", JSON.stringify(namesMyLists));
    setSelectList("");
    setWordList([]);
  }

  function handleChangeSelectList(name: string){
    setSelectList(name);
    if( name != "create-new-list"){
      setNameNewList("");
      setWordList(getWordsFromLocalStorage(name));
    }
  }

  function handleChangeNameNewList(name: string){
    setNameNewList(name);
  }

  function getWordsFromLocalStorage(key: string){
    const ls = localStorage.getItem(key);
    if(ls == null){
      return [];
    }
    return JSON.parse(ls);
  }

  const activeAddButton = (selectList == "create-new-list" && nameNewList.trim() != "" && wordToAdd.trim() != "") || (selectList != "create-new-list" && wordToAdd.trim() != "");

  return(
    <Container maxWidth="lg" sx={{height: '90%', display: 'flex', textAlign: 'center', justifyContent: 'center', alignItems: 'center'}}>
      <Stack spacing={2} sx={{justifyContent: 'center', alignItems: 'center'}}>
        {/* <Typography variant='h2'>My lists</Typography> */}
        {
          <Container>
            <Stack spacing={2} direction={"row"}  sx={{justifyContent: 'center', alignItems: 'center'}}>
              <TextField
                select
                sx={{ m: 1, width: '15ch' }}
                id="question-source"
                label="List to Edit"
                defaultValue={namesMyLists[0]}
                value={selectList}
                onChange={(e)=>{handleChangeSelectList(e.target.value as string)}}
              >
                <MenuItem value="create-new-list">Create New List</MenuItem>
                {
                  listOfMyLists.map((v,i)=>{
                    return <MenuItem value={v} key={i}>{v}</MenuItem>
                  })
                }
              </TextField>
              {
                selectList=="create-new-list" ? 
                <TextField
                  autoComplete="off"
                  sx={{ m: 1, width: '15ch' }}
                  id="name-new-list"
                  label="Name of a new list"
                  value={nameNewList}
                  onChange={(e)=>{handleChangeNameNewList(e.target.value as string)}}
                  onKeyDown={handleKeyDownAdd}
                />
                : null
              }
              <TextField
                autoComplete="off"
                sx={{ m: 1, width: '15ch' }}
                id="word-to-add"
                label="Add new word"
                value={wordToAdd}
                onChange={(e)=>{setWordToAdd(e.target.value as string)}}
                onKeyDown={handleKeyDownAdd}
              />
              <Button 
                style={{textTransform:"none", width:"10ch"}}
                variant="contained"
                onClick={()=>{handleClickAddWord(wordToAdd, nameNewList)}}
                disabled={activeAddButton?false:true}
                ref={AddButtonRef}
              >
                Add
              </Button>
              <Button 
                color="error"
                style={{textTransform:"none", width:"14ch"}}
                variant="contained"
                onClick={()=>{handleClickDeleteList(selectList)}}
                disabled={selectList=="create-new-list"||selectList==""?true:false}
              >
                Delete List
              </Button>
            </Stack>
            {
              selectList!="create-new-list" && wordList.length != 0 ? 
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
              : null
            }
          </Container>
        }
        
      </Stack>
    </Container>
  );
}

export default MyLists;