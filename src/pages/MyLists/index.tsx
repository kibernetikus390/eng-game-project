import { useState, useContext, useEffect, useRef } from "react";
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
import fetchWiktionary from "../Game/methods/fetchWiktionary";
import getDefinition from "../Game/methods/getDefinition";
import { partsList } from "../Game/methods/getDefinition";

type DialogCreateNewListProps = {
  open: boolean;
  nameNewList: string;
  handleChangeNameNewList: (name: string) => void;
  handleSubmit: (name: string) => void;
  handleClose: () => void;
};

type DialogAddNewWord = {
  open: boolean;
  onClose: () => void;
  addWord: (word: Dictionary) => void;
  setOpenDialogFetch: React.Dispatch<React.SetStateAction<boolean>>;
  addWordTitle: string;
  setAddWordTitle: React.Dispatch<React.SetStateAction<string>>;
  addWordPart: string;
  setAddWordPart: React.Dispatch<React.SetStateAction<string>>;
  addWordDef: string;
  setAddWordDef: React.Dispatch<React.SetStateAction<string>>;
};

type DialogFetchProps = {
  open: boolean;
  onClose: () => void;
  wordTitle: string;
  wordPart: string;
};

function DialogFetchFromWiktionary(props: DialogFetchProps) {
  const abortControllerRef = useRef<AbortController | null>(null);
  const [dicList, setDicList] = useState<Dictionary[]>([]);

  async function fetch() {
    abortControllerRef.current = new AbortController();
    try {
      const doc: Document = await fetchWiktionary(
        props.wordTitle,
        abortControllerRef.current.signal,
      );
      for (let part of partsList) {
        const dict: Dictionary = getDefinition(doc, props.wordTitle, part);
        if (dict.definition.trim() != "") {
          console.log(dict);
          dicList.push(dict);
          setDicList((prev) => [...prev, dict]);
        }
      }
    } catch {
      console.log("fetch failed: DialogFetchFromWiktionary");
    }
  }

  useEffect(() => {
    if (props.open) {
      setDicList([]);
      fetch();
    }
  }, [props.open]);

  return (
    <Dialog onClose={props.onClose} open={props.open}>
      <DialogTitle sx={{ textAlign: "center" }}>【 {props.wordTitle} 】</DialogTitle>
      <List>
        {dicList.map((v, i) => {
          return (
            <ListItem key={i + "listitem"} sx={{ justifyContent: "center" }}>
              <Button
                style={{ textTransform: "none" }}
                variant="outlined"
                onClick={() => {}}
              >
                {v.part}: {v.definition}
              </Button>
            </ListItem>
          );
        })}
          <ListItem sx={{ justifyContent: "center" }}>
          {dicList.length != 0 ? (
            <Button
              style={{ textTransform: "none" }}
              variant="contained"
              onClick={() => {}}
            >
              Add all
            </Button>
        ) : "fetching..."}
          </ListItem>
      </List>
    </Dialog>
  );
}

function DialogAddNewWord(props: DialogAddNewWord) {
  function handleChangeTitle(str: string) {
    props.setAddWordTitle(str);
  }
  function handleChangePart(str: string) {
    props.setAddWordPart(str);
  }
  function handleChangeDef(str: string) {
    props.setAddWordDef(str);
  }

  const activeAddButton =
    props.addWordTitle.trim() !== "" && props.addWordDef.trim() !== "";

  function submit() {
    if (!activeAddButton) {
      return;
    }
    props.addWord({
      title: props.addWordTitle,
      part: props.addWordPart,
      definition: props.addWordDef,
    });
    props.setAddWordTitle("");
    props.setAddWordPart("");
    props.setAddWordDef("");
  }

  return (
    <Dialog
      onClose={props.onClose}
      open={props.open}
      closeAfterTransition={false}
    >
      <DialogTitle sx={{ textAlign: "center" }}>Add new word</DialogTitle>
      <List>
        <ListItem sx={{ justifyContent: "center" }}>
          <TextField
            required
            autoComplete="off"
            sx={{ m: 1, width: "20ch" }}
            id="name-new-list"
            label="word"
            placeholder="flower"
            value={props.addWordTitle}
            onChange={(e) => {
              handleChangeTitle(e.target.value as string);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit();
              }
            }}
          />
        </ListItem>
        <ListItem sx={{ justifyContent: "center" }}>
          <TextField
            autoComplete="off"
            sx={{ m: 1, width: "20ch" }}
            id="name-new-list"
            label="part"
            placeholder="Noun"
            value={props.addWordPart}
            onChange={(e) => {
              handleChangePart(e.target.value as string);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit();
              }
            }}
          />
        </ListItem>
        <ListItem sx={{ justifyContent: "center" }}>
          <TextField
            required
            autoComplete="off"
            sx={{ m: 1, width: "20ch" }}
            id="name-new-list"
            label="definition"
            value={props.addWordDef}
            onChange={(e) => {
              handleChangeDef(e.target.value as string);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit();
              }
            }}
          />
        </ListItem>
        <ListItem sx={{ justifyContent: "center" }}>
          <Button
            disabled={!activeAddButton}
            style={{ textTransform: "none", width: "90%" }}
            variant="contained"
            onClick={() => {
              submit();
            }}
          >
            Add
          </Button>
        </ListItem>
        <ListItem sx={{ justifyContent: "center" }}>
          <Button
            disabled={!(props.addWordTitle.trim() !== "")}
            style={{ textTransform: "none", width: "90%" }}
            variant="contained"
            onClick={() => {
              props.setOpenDialogFetch(true);
            }}
          >
            Fetch
          </Button>
        </ListItem>
      </List>
    </Dialog>
  );
}

function DialogCreateNewList(props: DialogCreateNewListProps) {
  function submit() {
    props.handleSubmit(props.nameNewList);
    props.handleClose();
  }

  return (
    <Dialog
      onClose={props.handleClose}
      open={props.open}
      closeAfterTransition={false}
    >
      <DialogTitle sx={{ textAlign: "center" }}>Create New List</DialogTitle>
      <List>
        <ListItem sx={{ justifyContent: "center" }}>
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
              if (e.key === "Enter") {
                e.preventDefault();
                submit();
              }
            }}
          />
        </ListItem>
        <ListItem sx={{ justifyContent: "center" }}>
          <Button
            style={{ textTransform: "none", width: "90%" }}
            variant="contained"
            onClick={() => {
              submit();
            }}
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
    // addWords,
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
  const [openDialogFetch, setOpenDialogFetch] = useState<boolean>(false);

  const [addWordTitle, setAddWordTitle] = useState<string>("");
  const [addWordPart, setAddWordPart] = useState<string>("");
  const [addWordDef, setAddWordDef] = useState<string>("");

  function genChecked() {
    if (selectList == "") {
      return [];
    }
    return Array(dictionaries[selectList].length).fill(false);
  }

  // 単語を追加する
  function handleClickAddWord(dic: Dictionary) {
    // const words = str.split(/[" ,]+/).filter((e) => e !== "");
    addDictionary(selectList, [dic]);
    setSelectList(selectList);
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

  function handleCloseDialogCreateNewList() {
    setOpenDialogNewList(false);
  }
  function handleCloseDialogAddNewWord() {
    setOpenDialogAddWord(false);
  }
  function handleCloseDialogFetch() {
    setOpenDialogFetch(false);
  }

  const displayTable =
    selectList != "" && dictionaries[selectList]?.length != 0;

  const activeDeleteWordsButton = checkedArr.some((v) => v);

  const activeDeleteListButton = ["", KEY_NIGATE_LIST].includes(selectList);

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
        setOpenDialogFetch={setOpenDialogFetch}
        addWordTitle={addWordTitle}
        setAddWordTitle={setAddWordTitle}
        addWordPart={addWordPart}
        setAddWordPart={setAddWordPart}
        addWordDef={addWordDef}
        setAddWordDef={setAddWordDef}
      />
      <DialogCreateNewList
        open={openDialogNewList}
        nameNewList={nameNewList}
        handleChangeNameNewList={handleChangeNameNewList}
        handleSubmit={handleSubmitCreateNewList}
        handleClose={handleCloseDialogCreateNewList}
      />
      <DialogFetchFromWiktionary
        open={openDialogFetch}
        onClose={handleCloseDialogFetch}
        wordTitle={addWordTitle}
        wordPart={addWordPart}
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
                  <TableCell align="center">
                    <Checkbox
                      checked={!checkedArr.some((e) => !e)}
                      onClick={() => {
                        if (!checkedArr.some((e) => !e))
                          setCheckedArr(Array(checkedArr.length).fill(false));
                        else setCheckedArr(Array(checkedArr.length).fill(true));
                      }}
                    />
                  </TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Part</TableCell>
                  <TableCell>Definition</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dictionaries[selectList].map((v, i) => {
                  return (
                    <TableRow key={i + "tr"}>
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
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : null}
      </Stack>
    </Container>
  );
}
