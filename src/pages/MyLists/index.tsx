import { useState, useContext, useEffect } from "react";
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
  Typography,
  List,
  ListItem,
  Dialog,
  DialogTitle,
} from "@mui/material";
import { DictionaryContext } from "../../contexts/DictionaryContext";
import { KEY_NIGATE_LIST } from "../../providers/DictionaryContextProvider";
import { Dictionary } from "../Game";


type DialogCreateNewListProps = {
  open: boolean;
  nameNewList: string;
  handleChangeNameNewList: (name: string) => void;
  handleSubmit: (name: string) => void;
  handleClose: ()=>void;
};

type DialogAddNewWord = {
  open: boolean;
  onClose: ()=>void;
  addWord: (word:Dictionary)=>void;
};

function DialogAddNewWord(props: DialogAddNewWord){
  const [wordTitle, setWordTitle] = useState<string>("");
  const [wordPart, setWordPart] = useState<string>("");
  const [wordDef, setWordDef] = useState<string>("");

  function handleChangeTitle (str:string) {
    setWordTitle(str);
  }
  function handleChangePart (str:string) {
    setWordPart(str);
  }
  function handleChangeDef (str:string) {
    setWordDef(str);
  }

  function submit(){
    props.addWord({title:wordTitle, part:wordPart, definition:wordDef});
    setWordTitle("");
    setWordPart("");
    setWordDef("");
  }

  return (
    <Dialog onClose={props.onClose} open={props.open} >
      <DialogTitle sx={{textAlign:"center"}}>Add new word</DialogTitle>
      <List>
        <ListItem sx={{justifyContent:"center"}}>
          <TextField
            required
            autoComplete="off"
            sx={{ m: 1, width: "20ch" }}
            id="name-new-list"
            label="word"
            placeholder="flower"
            value={wordTitle}
            onChange={(e) => {
              handleChangeTitle(e.target.value as string)
            }}
            onKeyDown={(e) => {
              if(e.key === "Enter"){
                e.preventDefault();
                console.log("add");
                submit();
              }
            }}
          />
        </ListItem>
        <ListItem sx={{justifyContent:"center"}}>
          <TextField
            autoComplete="off"
            sx={{ m: 1, width: "20ch" }}
            id="name-new-list"
            label="part"
            placeholder="Noun"
            value={wordPart}
            onChange={(e) => {
              handleChangePart(e.target.value as string)
            }}
            onKeyDown={(e) => {
              if(e.key === "Enter"){
                e.preventDefault();
                console.log("add");
                submit();
              }
            }}
          />
        </ListItem>
        <ListItem sx={{justifyContent:"center"}}>
          <TextField
            required
            autoComplete="off"
            sx={{ m: 1, width: "20ch" }}
            id="name-new-list"
            label="definition"
            value={wordDef}
            onChange={(e) => {
              handleChangeDef(e.target.value as string)
            }}
            onKeyDown={(e) => {
              if(e.key === "Enter"){
                e.preventDefault();
                console.log("add");
                submit();
              }
            }}
          />
        </ListItem>
        <ListItem sx={{justifyContent:"center"}}>
          <Button
            style={{ textTransform: "none", width:"90%" }}
            variant="contained"
            onClick={() => {submit()}}
          >
            Add
          </Button>
        </ListItem>
      </List>
    </Dialog>
  );
}

function DialogCreateNewList(props: DialogCreateNewListProps) {
  function submit(){
    console.log("submit");
    props.handleSubmit(props.nameNewList);
    props.handleClose();
  }

  return (
    <Dialog onClose={props.handleClose} open={props.open} >
      <DialogTitle sx={{textAlign:"center"}}>Create New List</DialogTitle>
      <List>
        <ListItem sx={{justifyContent:"center"}}>
          <TextField
            autoComplete="off"
            sx={{ m: 1, width: "20ch" }}
            id="name-new-list"
            label="Name of the new list"
            value={props.nameNewList}
            onChange={(e) => {
              props.handleChangeNameNewList(e.target.value as string);
            }}
            onKeyDown={(e) => {
              if(e.key === "Enter"){
                e.preventDefault();
                submit();
              }
            }}
          />
        </ListItem>
        <ListItem sx={{justifyContent:"center"}}>
          <Button
            style={{ textTransform: "none", width:"90%" }}
            variant="contained"
            onClick={() => {submit()}}
            disabled={props.nameNewList.trim() === ""}
          >
            Add
          </Button>
        </ListItem>
      </List>
    </Dialog>
  );
}

export default function MyLists() {
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
  const [checkedArr, setCheckedArr] = useState<boolean[]>(genChecked());
  
  const [nameNewList, setNameNewList] = useState<string>("");
  const [openDialogNewList, setOpenDialogNewList] = useState<boolean>(false);
  const [openDialogAddWord, setOpenDialogAddWord] = useState<boolean>(false);

  function genChecked() {
    if (selectList == "") {
      return [];
    }
    return Array(dictionaries[selectList].length).fill(false);
  }

  // 単語を追加する
  function handleClickAddWord(dic: Dictionary, nameList: string = "FAFAF") {
    // const words = str.split(/[" ,]+/).filter((e) => e !== "");
    if(nameList === "FAFAF"){
      nameList = selectList;
    }
    addDictionary(nameList, [dic]);
    setSelectList(nameList);
  }

  function handleSubmitCreateNewList(listName: string) {
    addDictionary(listName, []);
    setSelectList(listName);
    handleCloseDialogCreateNewList();
  }

  function handleClickDeleteList(listName: string) {
    removeDictionary(listName);
    setSelectList(listOfMyLists[0]);
  }

  function handleClickDeleteWords(listName: string, checked: boolean[]) {
    const copyDic = [...dictionaries[listName]];
    for (let i = 0; i < checked.length; i++) {
      if (checked[i]) {
        removeWord(listName, copyDic[i]);
      }
      console.log(copyDic);
    }
    setCheckedArr(Array(getLength(listName)).fill(false));
  }

  function handleClickCheck(i: number, checked: boolean) {
    const newChecked = [...checkedArr];
    newChecked[i] = !checked;
    setCheckedArr(newChecked);
  }

  function handleChangeSelectList(name: string) {
    setSelectList(name);
    setCheckedArr(Array(dictionaries[name]?.length).fill(false));

  }
  
  function handleChangeNameNewList(name: string) {
    setNameNewList(name);
  }

  function handleCloseDialogCreateNewList(){
    setOpenDialogNewList(false);
  }
  function handleCloseDialogAddNewWord(){
    setOpenDialogAddWord(false);
  }

  const displayTable =
    selectList != "" &&
    dictionaries[selectList]?.length != 0;

  const activeDeleteWordsButton = checkedArr.some((v) => v);

  const activeDeleteListButton = [
    "",
    KEY_NIGATE_LIST,
  ].includes(selectList);

  useEffect(() => {
    console.log("openDialogNewList state:", openDialogNewList);
  }, [openDialogNewList]);

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
      <DialogAddNewWord
        open={openDialogAddWord}
        onClose={handleCloseDialogAddNewWord}
        addWord={handleClickAddWord}
      />
      <DialogCreateNewList
        open={openDialogNewList}
        nameNewList={nameNewList}
        handleChangeNameNewList={handleChangeNameNewList}
        handleSubmit={handleSubmitCreateNewList}
        handleClose={handleCloseDialogCreateNewList}
      />
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
            label="List to Edit"
            defaultValue={namesMyLists[0]}
            value={selectList}
            onChange={(e) => {
              handleChangeSelectList(e.target.value as string);
            }}
          >
            {listOfMyLists.map((v, i) => {
              return (
                <MenuItem value={v} key={i}>
                  {v}
                </MenuItem>
              );
            })}
          </TextField>
          <Button
            style={{ textTransform: "none", width: "20ch" }}
            variant="contained"
            onClick={() => {
              setOpenDialogNewList(true);
            }}
          >
            Create New List
          </Button>
          <Button
            style={{ textTransform: "none", width: "20ch" }}
            variant="contained"
            onClick={() => {
              setOpenDialogAddWord(true);
            }}
          >
            Add new word
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
                      <Checkbox
                        key={i + "checkbox"}
                        checked={checkedArr[i]}
                        onClick={() => handleClickCheck(i, checkedArr[i])}
                      />
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
