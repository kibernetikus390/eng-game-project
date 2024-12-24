import {
  Stack,
  Typography,
  Container,
  Button,
  Divider,
  Grid2 as Grid,
} from "@mui/material";
import classes from "./index.module.css";
import { Dictionary } from ".";

type GameResultProps = {
  correctNum: number;
  quizSet: Dictionary[];
  tfTable: boolean[];
  theme: string;
  handleClickBack: ()=>void;
  handleClickRevenge: ()=>void;
}

export default function GameResult(props:GameResultProps) {
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
        <Container
          className={classes.resultBox}
          sx={{
            borderRadius: 1,
            boxShadow: 1,
            background: props.theme === "dark" ? "#252525" : "#FEFEFE",
            p: 1,
          }}
        >
          <Stack spacing={2}>
            {props.quizSet.map((v, i) => {
              const c: string = props.tfTable[i] ? "success" : "error";
              return (
                <Grid
                  key={i + "p"}
                  container
                  spacing={1}
                  sx={{
                    borderRadius: 1,
                    boxShadow: 1,
                    background: props.theme === "dark" ? "#333" : "#FFF",
                    p: 1,
                    textAlign: "left",
                    alignItems: "center",
                  }}
                >
                  <Grid size={11} key={i + "t"}>
                    <Typography
                      color={c}
                      variant="h5"
                    >{`${v.title}`}</Typography>
                    <Typography
                      color={c}
                      variant="subtitle1"
                    >{`(${v.part}) ${v.definition}`}</Typography>
                  </Grid>
                  <Grid size={1} key={i + "d"}></Grid>
                </Grid>
              );
            })}
          </Stack>
        </Container>
      </Stack>
    </Container>
  );
}
