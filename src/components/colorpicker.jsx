import { useState } from 'react'
import { HexColorPicker } from "react-colorful";

function ColorPicker({label,callback,defaultValue}){

    const [value,setValue] = useState(defaultValue);
    const [active,setActive] = useState(false);

    const callbackFn = (hexColor) => {
        callback(hexColor);
        setValue(hexColor);
    }

    return(
        <div className = "color_picker_container" style = {{cursor:'pointer',width:'fit-content',height:'fit-content'}}>
        <span className = "control_label" onClick = {(e) => {setActive(!active)}} style = {{color:(active?value:'#000000')}}>{label}</span>
        {active &&
            <HexColorPicker className = "color_picker" onChange={callbackFn} color = {defaultValue}></HexColorPicker>
        }
        </div>
    )
}

export default ColorPicker;