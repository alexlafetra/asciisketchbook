import { useState } from 'react'
import { HexColorPicker } from "react-colorful";

function ColorPicker({label,callback,defaultValue}){

    const [value,setValue] = useState(defaultValue);

    const callbackFn = (hexColor) => {
        callback(hexColor);
        setValue(hexColor);
    }

    return(
        <>
        <span className = "control_label">{label}</span>
        <HexColorPicker className = "color_picker" onChange={callbackFn} color = {defaultValue}></HexColorPicker>
        </>
    )
}

export default ColorPicker;