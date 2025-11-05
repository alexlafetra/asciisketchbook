import { useState } from 'react'
import { HexColorPicker } from "react-colorful";

function ColorPicker({label,callback,defaultValue,backgroundColor,textColor}){

    const [value,setValue] = useState(defaultValue);
    const [active,setActive] = useState(false);

    const callbackFn = (hexColor) => {
        callback(hexColor);
        setValue(hexColor);
    }

    // const background = backgroundColor?backgroundColor:'transparent';
    // const text = textColor?textColor:'#000000';
    // const 

    return(
        <div className = "color_picker_container" style = {{cursor:'pointer',width:'fit-content',height:'fit-content'}}>
        <span className = "control_label" onClick = {(e) => {setActive(!active)}} style = {{backgroundColor:backgroundColor,color:textColor}}>{label}</span>
        {active &&
            <HexColorPicker className = "color_picker" onChange={callbackFn} color = {defaultValue}></HexColorPicker>
        }
        </div>
    )
}

export default ColorPicker;