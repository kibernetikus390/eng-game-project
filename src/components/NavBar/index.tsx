import {useContext} from "react";
import { ThemeContext } from "../../ThemeContext";
import classes from "./index.module.css";

function NavBar(props:any) {
    const {theme, toggleTheme} = useContext(ThemeContext);

    return (
        <div className={`${classes.Host} ${theme === "light" ? null : classes.dark}`}>
            <div>
                <p onClick={toggleTheme}>{theme}</p>
            </div>
            <hr/>
            {props.children}
        </div>
    );
}

export default NavBar;