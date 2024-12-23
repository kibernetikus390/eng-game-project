import { useState, useRef, useContext } from "react";
import {
  Button,
  Grid2 as Grid,
  Stack,
  Container,
  TextField,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DictionaryContext } from "../../contexts/DictionaryContext";

function MyLists() {
  const {
    dictionaries,
    addWords,
    removeWord,
    addDictionary,
    removeDictionary,
  } = useContext(DictionaryContext);
  // マイリストの名前の一覧
  const namesMyLists = Object.keys(dictionaries);
  const listOfMyLists: string[] = namesMyLists;
  const [selectList, setSelectList] = useState<string>(
    namesMyLists.length == 0 ? "" : namesMyLists[0],
  );
  const [wordToAdd, setWordToAdd] = useState<string>("");
  const [nameNewList, setNameNewList] = useState<string>("");
  const AddButtonRef = useRef<HTMLButtonElement>(null);

  function handleClickRemoveWord(word: string) {
    removeWord(selectList, word);
  }

  // TextfieldでEnter押したら、単語追加処理を行う
  function handleKeyDownAdd(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter") {
      AddButtonRef.current?.click();
    }
  }

  // 単語を追加する
  function handleClickAddWord(str: string, nameList: string) {
    const words = str.split(/[" ,]+/).filter((e) => e !== "");

    if (nameList == "") {
      addWords(selectList, words);
    } else {
      addDictionary(nameList, words);
      setSelectList(nameList);
      setNameNewList("");
    }
    setWordToAdd("");
  }

  function handleClickDeleteList(listName: string) {
    removeDictionary(listName);
    setSelectList("create-new-list");
  }

  function handleChangeSelectList(name: string) {
    setSelectList(name);
    if (name != "create-new-list") {
      setNameNewList("");
    }
  }

  function handleChangeNameNewList(name: string) {
    setNameNewList(name);
  }

  const activeAddButton =
    (selectList == "create-new-list" &&
      nameNewList.trim() != "" &&
      wordToAdd.trim() != "") ||
    (selectList != "create-new-list" && wordToAdd.trim() != "");

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
        {/* <Typography variant='h2'>My lists</Typography> */}
        {
          <Container>
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
                <MenuItem value="create-new-list">Create New List</MenuItem>
                {listOfMyLists.map((v, i) => {
                  return (
                    <MenuItem value={v} key={i}>
                      {v}
                    </MenuItem>
                  );
                })}
              </TextField>
              {selectList == "create-new-list" ? (
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
                id="word-to-add"
                label="Add new word"
                value={wordToAdd}
                onChange={(e) => {
                  setWordToAdd(e.target.value as string);
                }}
                onKeyDown={handleKeyDownAdd}
              />
              <Button
                style={{ textTransform: "none", width: "10ch" }}
                variant="contained"
                onClick={() => {
                  handleClickAddWord(wordToAdd, nameNewList);
                }}
                disabled={activeAddButton ? false : true}
                ref={AddButtonRef}
              >
                Add
              </Button>
              <Button
                color="error"
                style={{ textTransform: "none", width: "14ch" }}
                variant="contained"
                onClick={() => {
                  handleClickDeleteList(selectList);
                }}
                disabled={
                  selectList == "create-new-list" || selectList == ""
                    ? true
                    : false
                }
              >
                Delete List
              </Button>
            </Stack>
            {selectList != "create-new-list" && selectList != "" &&
            dictionaries[selectList]?.length != 0 ? (
              <Container
                sx={{
                  marginTop: 2,
                  overflow: "scroll",
                  overflowX: "hidden",
                  height: "50vh",
                }}
              >
                <Grid container spacing={2}>
                  {dictionaries[selectList]?.map((v, i) => {
                    return (
                      <Grid
                        size={4}
                        key={i}
                        sx={{
                          display: "flex",
                          textAlign: "center",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {v}
                        <CloseIcon
                          fontSize="small"
                          sx={{ display: "inline" }}
                          onClick={() => {
                            handleClickRemoveWord(v);
                          }}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Container>
            ) : null}
          </Container>
        }
      </Stack>
    </Container>
  );
}

export default MyLists;
