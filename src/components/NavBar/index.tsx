import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../contexts/Theme";
import classes from "./index.module.css";

import { AppBar, Box, Button, Divider, Stack, IconButton } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { AbortContext } from "../../contexts/AbortContext";

function NavBar(props: React.PropsWithChildren) {
  const { setAbort } = useContext(AbortContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  return (
    <Box
      sx={{ width: "100vw", height: "100vh" }}
      className={`${classes.Host} ${theme === "light" ? null : classes.dark}`}
    >
      <AppBar
        position="static"
        elevation={1}
        sx={theme === "light" ? null : { bgcolor: "#252525" }}
      >
        <Stack
          spacing={1}
          direction="row"
          sx={{
            p: 1,
            textAlign: "right",
            justifyContent: "right",
            alignItems: "right",
          }}
        >
          <Button
            style={{ textTransform: "none" }}
            sx={{ color: "white", borderColor: "white" }}
            onClick={() => {
              navigate("/");
              setAbort(true);
            }}
          >
            Home
          </Button>
          <Divider orientation="vertical" flexItem />
          <Button
            style={{ textTransform: "none" }}
            sx={{ color: "white", borderColor: "white" }}
            onClick={() => {
              navigate("/mylists");
            }}
          >
            My lists
          </Button>
          <Divider orientation="vertical" flexItem />
          <Button
            style={{ textTransform: "none" }}
            sx={{ color: "white", borderColor: "white" }}
            onClick={() => {
              navigate("/history");
            }}
          >
            History
          </Button>
          <Divider orientation="vertical" flexItem />
          <IconButton onClick={toggleTheme}>
            {theme === "light" ? (
              <LightModeIcon sx={{ color: "white" }} />
            ) : (
              <DarkModeIcon />
            )}
          </IconButton>
        </Stack>
      </AppBar>
      {props.children}
    </Box>
  );
}

export default NavBar;
