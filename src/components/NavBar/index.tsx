import {useContext} from "react";
import { ThemeContext } from "../../ThemeContext";
import classes from "./index.module.css";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import IconButton from '@mui/material/IconButton';

function NavBar(props:any) {
    const {theme, toggleTheme} = useContext(ThemeContext);

    return (
        <Box sx={{width: "100vw", height: "100vh"}} className={`${classes.Host} ${theme === "light" ? null : classes.dark}`}>
            <AppBar 
                position="static" 
                elevation={1}
                sx={theme==="light"?null:{bgcolor: "#252525"}}
            >
                <Container sx={{p:1,textAlign:"right"}}>
                    <IconButton onClick={toggleTheme}>
                        {theme==="light"?<LightModeIcon sx={{color:"white"}}/>:<DarkModeIcon/>}
                    </IconButton>
                </Container>
            </AppBar>
            {props.children}
        </Box>
    );
}

export default NavBar;