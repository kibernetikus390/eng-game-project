import {useContext} from "react";
import { ThemeContext } from "../../ThemeContext";
import classes from "./index.module.css";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';

function NavBar(props:any) {
    const {theme, toggleTheme} = useContext(ThemeContext);

    return (
        <Box sx={{width: "100vw", height: "100vh"}} className={`${classes.Host} ${theme === "light" ? null : classes.dark}`}>
            <AppBar 
                position="static" 
                elevation={1}
                sx={theme==="light"?null:{bgcolor: "#333333"}}
            >
                <p onClick={toggleTheme}>{theme}</p>
            </AppBar>
            {props.children}
        </Box>
    );
}

export default NavBar;