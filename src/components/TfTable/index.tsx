// import { useEffect, useState } from "react";
import Stack from '@mui/material/Stack';
import Icon from '@mui/material/Icon';
import CloseIcon from '@mui/icons-material/Close';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RemoveIcon from '@mui/icons-material/Remove';
import Container from '@mui/material/Container';

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
                (v === true) ? <IconCircle/> : (props.gameIndex <= i) ? <IconDash/> : <IconCross/>
            );
          })
        }
    </Container>
  )
}

export default TfTable;
