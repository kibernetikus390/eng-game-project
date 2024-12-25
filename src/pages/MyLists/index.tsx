import { useState, useRef, useContext, useEffect } from "react";
import {
  Button,
  Stack,
  Container,
  TextField,
  MenuItem,
  Checkbox,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DictionaryContext } from "../../contexts/DictionaryContext";
import { KEY_NIGATE_LIST } from "../../providers/DictionaryContextProvider";
import { Dictionary } from "../Game";

const KEY_CREATE_NEW_LIST = "egp-create-new-list";

function MyLists() {
  const {
    dictionaries,
    addWords,
    removeWord,
    addDictionary,
    removeDictionary,
    getLength,
  } = useContext(DictionaryContext);
  // マイリストの名前の一覧
  const namesMyLists = Object.keys(dictionaries);
  const listOfMyLists: string[] = namesMyLists;
  const [selectList, setSelectList] = useState<string>(
    namesMyLists.length == 0 ? "" : namesMyLists[0],
  );
  const [wordToAdd, setWordToAdd] = useState<string>("");
  const [partToAdd, setPartToAdd] = useState<string>("");
  const [defToAdd, setDefToAdd] = useState<string>("");
  const [nameNewList, setNameNewList] = useState<string>("");
  const AddButtonRef = useRef<HTMLButtonElement>(null);
  const [checkedArr, setCheckedArr] = useState<boolean[]>(genChecked());

  function genChecked(){
    if(selectList == KEY_CREATE_NEW_LIST || selectList == ""){
      return [];  
    }
    return Array(dictionaries[selectList].length).fill(false);
  };

  function handleClickRemoveWord(dic: Dictionary) {
    removeWord(selectList, dic);
  }

  // TextfieldでEnter押したら、単語追加処理を行う
  function handleKeyDownAdd(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter") {
      AddButtonRef.current?.click();
    }
  }

  // 単語を追加する
  function handleClickAddWord(dic: Dictionary, nameList: string) {
    // const words = str.split(/[" ,]+/).filter((e) => e !== "");

    if (nameList == "") {
      addWords(selectList, [dic]);
    } else {
      addDictionary(nameList, [dic]);
      setSelectList(nameList);
      setNameNewList("");
    }
    setWordToAdd("");
  }

  function handleClickDeleteList(listName: string) {
    removeDictionary(listName);
    setSelectList(KEY_CREATE_NEW_LIST);
  }
  
  function handleClickDeleteWords(listName: string, checked: boolean[]) {
    const copyDic =  [...dictionaries[listName]];
    for(let i = 0; i < checked.length; i++){
      if(checked[i]){
        removeWord(listName, copyDic[i]);
      }
      console.log(copyDic);
    }
    setCheckedArr(Array(getLength(listName)).fill(false));
  }

  function handleClickCheck(i:number, checked:boolean){
    const newChecked = [...checkedArr];
    newChecked[i] = !checked;
    setCheckedArr(newChecked);
  }
    

  function handleChangeSelectList(name: string) {
    setSelectList(name);
    if (name != KEY_CREATE_NEW_LIST) {
      setNameNewList("");
      setCheckedArr(Array(dictionaries[name]?.length).fill(false));
    }
  }

  function handleChangeNameNewList(name: string) {
    setNameNewList(name);
  }

  const activeAddButton =
    (selectList == KEY_CREATE_NEW_LIST &&
      nameNewList.trim() != "" &&
      wordToAdd.trim() != "") ||
    (selectList != KEY_CREATE_NEW_LIST && wordToAdd.trim() != "" && partToAdd.trim() != "" && defToAdd.trim() != "");

  const displayTable = selectList != KEY_CREATE_NEW_LIST && selectList != "" && dictionaries[selectList]?.length != 0;

  const activeDeleteWordsButton = checkedArr.some((v)=>v);

  const activeDeleteListButton = [KEY_CREATE_NEW_LIST, "", KEY_NIGATE_LIST].includes(selectList);

  return (
    <Container
      maxWidth="lg"
      sx={{
        height: "90%",
        display: "flex",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack
        spacing={2}
        sx={{ justifyContent: "center", alignItems: "center" }}
      >
          <Typography variant="h5">My lists</Typography>
          <Stack
            spacing={2}
            direction={"row"}
            sx={{ justifyContent: "center", alignItems: "center" }}
          >
            <TextField
              select
              sx={{ m: 1, width: "15ch" }}
              id="question-source"
              label="List to Edit"
              defaultValue={namesMyLists[0]}
              value={selectList}
              onChange={(e) => {
                handleChangeSelectList(e.target.value as string);
              }}
            >
              <MenuItem value={KEY_CREATE_NEW_LIST}>Create New List</MenuItem>
              {listOfMyLists.map((v, i) => {
                return (
                  <MenuItem value={v} key={i}>
                    {v}
                  </MenuItem>
                );
              })}
            </TextField>
            {selectList == KEY_CREATE_NEW_LIST ? (
              <TextField
                autoComplete="off"
                sx={{ m: 1, width: "15ch" }}
                id="name-new-list"
                label="Name of a new list"
                value={nameNewList}
                onChange={(e) => {
                  handleChangeNameNewList(e.target.value as string);
                }}
                onKeyDown={handleKeyDownAdd}
              />
            ) : null}
            <TextField
              autoComplete="off"
              sx={{ m: 1, width: "15ch" }}
              label="word"
              value={wordToAdd}
              onChange={(e) => {
                setWordToAdd(e.target.value as string);
              }}
              onKeyDown={handleKeyDownAdd}
            />
            <TextField
              autoComplete="off"
              sx={{ m: 1, width: "15ch" }}
              label="part"
              value={partToAdd}
              onChange={(e) => {
                setPartToAdd(e.target.value as string);
              }}
              onKeyDown={handleKeyDownAdd}
            />
            <TextField
              autoComplete="off"
              sx={{ m: 1, width: "15ch" }}
              label="definition"
              value={defToAdd}
              onChange={(e) => {
                setDefToAdd(e.target.value as string);
              }}
              onKeyDown={handleKeyDownAdd}
            />
            <Button
              style={{ textTransform: "none", width: "10ch" }}
              variant="contained"
              onClick={() => {
                handleClickAddWord(
                  { title: wordToAdd, part: partToAdd, definition: defToAdd },
                  nameNewList,
                );
              }}
              disabled={activeAddButton ? false : true}
              ref={AddButtonRef}
            >
              Add
            </Button>
            <Button
              color="warning"
              sx={{ textTransform: "none", width: "16ch", fontSize: "small" }}
              variant="contained"
              onClick={() => {
                handleClickDeleteWords(selectList, checkedArr);
              }}
              disabled={!activeDeleteWordsButton}
            >
              Delete Words
            </Button>
            <Button
              color="error"
              sx={{ textTransform: "none", width: "14ch" }}
              variant="contained"
              onClick={() => {
                handleClickDeleteList(selectList);
              }}
              disabled={activeDeleteListButton}
            >
              Delete List
            </Button>
          </Stack>
          {displayTable ? (
            <TableContainer component={Paper} sx={{ maxHeight: "60vh" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center"></TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Part</TableCell>
                    <TableCell>Definition</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dictionaries[selectList].map((v, i) => (
                    <TableRow key={i}>
                      <TableCell key={i + "check"} align="center">
                        <Checkbox key={i+"checkbox"} checked={checkedArr[i]} onClick={()=>handleClickCheck(i, checkedArr[i])}/>
                      </TableCell>
                      <TableCell key={i + "title"}>{v.title}</TableCell>
                      <TableCell key={i + "part"}>{v.part}</TableCell>
                      <TableCell key={i + "def"}>{v.definition}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : null}
      </Stack>
    </Container>
  );
}

export default MyLists;
