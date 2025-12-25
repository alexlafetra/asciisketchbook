import { useState } from 'react'
import { HexColorPicker } from "react-colorful";

function ColorPicker({callback,defaultValue,backgroundColor,textColor}){

    const [active,setActive] = useState(false);

    return(
        <div className = "color_picker_container" style = {{position:'relative',cursor:'pointer',width:'fit-content',height:'fit-content'}}>
        {active &&
            <div onClick = {(e) => {setActive(false)}} style = {{position:'absolute',right:'0px',top:'0px',color:'white',backgroundColor:'blue'}}>{'[x]'}</div>
        }
        <div className = "control_label" onClick = {(e) => {setActive(!active)}} style = {{color:'black',backgroundColor:active?'yellow':null}}>{'color'}</div>
        {active &&
        <div style = {{paddingLeft:'20px'}}>
            <div style = {{width:'fit-content',backgroundColor:backgroundColor}}>
                <span className = "control_label" style = {{backgroundColor:'black',mixBlendMode:'difference',color:'white'}}>{'background'}</span>
            </div>
            <HexColorPicker style = {{border:'none',height:'40px',borderRadius:'0px'}} className = "color_picker" onChange={callback.bg} color = {defaultValue.bg}></HexColorPicker>
            <div className = "control_label" style = {{color:textColor}}>{'text'}</div>
            <HexColorPicker style = {{border:'none',height:'40px',borderRadius:'0px'}} className = "color_picker" onChange={callback.fg} color = {defaultValue.fg}></HexColorPicker>
        </div>
        }
        </div>
    )
}

export default ColorPicker;