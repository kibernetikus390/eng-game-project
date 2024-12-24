import { Box, Typography, Container } from "@mui/material";
import CircularProgressWithLabel from "../../components/CircularProgressWithLabel";

type GameLoadingProps = {
  loadingCounter: number;
  numQuizAndExtra: number;
};

export default function GameLoading(props: GameLoadingProps) {
  console.log(props.numQuizAndExtra);
  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100%",
        display: "flex",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box>
        <Typography variant="h3">loading...</Typography>
        <CircularProgressWithLabel
          sx={{ m: "1em" }}
          size={"4rem"}
          value={
            (props.loadingCounter / props.numQuizAndExtra) *
            100
          }
        />
      </Box>
    </Container>
  );
}
