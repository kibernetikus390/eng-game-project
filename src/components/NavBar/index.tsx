import {useContext} from "react";
import {useNavigate} from "react-router-dom";
import { ThemeContext } from "../../ThemeContext";
import classes from "./index.module.css";

import {AppBar, Box, Button, Stack, IconButton} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';


function NavBar(props:any) {
    const {theme, toggleTheme} = useContext(ThemeContext);
    const navigate = useNavigate();

    function handleClickMyLists( e:any ){
        navigate("./mylists");
    }

    return (
        <Box sx={{width: "100vw", height: "100vh"}} className={`${classes.Host} ${theme === "light" ? null : classes.dark}`}>
            <AppBar 
                position="static" 
                elevation={1}
                sx={theme==="light"?null:{bgcolor: "#252525"}}
            >
                <Stack spacing={1} direction="row" sx={{p:1, textAlign: 'right', justifyContent: 'right', alignItems: 'right'}}>
                    <Button 
                        style={{textTransform:"none"}}
                        variant="outlined"
                        sx={{color:"white", borderColor:"white"}}
                        onClick={handleClickMyLists}
                    >
                        myLists
                    </Button>
                    <IconButton onClick={toggleTheme}>
                        {theme==="light"?<LightModeIcon sx={{color:"white"}}/>:<DarkModeIcon/>}
                    </IconButton>
                </Stack>
            </AppBar>
            {props.children}
        </Box>
    );
}

export default NavBar;