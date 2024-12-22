// import { useEffect, useState } from "react";
import {Container} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RemoveIcon from '@mui/icons-material/Remove';

const IconCircle = () => {
  return (<RadioButtonUncheckedIcon fontSize='small' sx={{display: 'inline'}}/>);
}
const IconCross = () => {
  return (<CloseIcon fontSize='small' sx={{display: 'inline'}}/>);
}
const IconDash = () => {
  return (<RemoveIcon fontSize='small' sx={{display: 'inline'}}/>);
}

function TfTable(props: {arr: boolean[], gameIndex: number}) {
  return (
    <Container>
        {
          props.arr.map((v, i) => {
            return (
                (v === true) ? <IconCircle key={i}/> : (props.gameIndex <= i) ? <IconDash key={i}/> : <IconCross key={i}/>
            );
          })
        }
    </Container>
  )
}

export default TfTable;
