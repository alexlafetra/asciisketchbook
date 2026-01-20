import { useState } from 'react'
import { HexColorPicker } from "react-colorful";

function ColorPicker({callback,defaultValue,backgroundColor,textColor}){

    const [active,setActive] = useState(false);

    const pixelStyle = {
        // width:'fit-content',
        // height:'1em'
    };

    const paletteHolderStyle = {
        position:'relative',
        display:'flex',
    }
    const makePalette = function(w,h){
        const array = [];
        for(let x = 0; x<w; x++){
            const row = [];
            for(let y = 0; y<h; y++){
                row.push(<div key = {`pixel_${x}_${y}`} style = {{...pixelStyle,backgroundColor:`rgb(${y/h*255},255,${x/w*255},1.0)`}}>|</div>);
            }
            array.push(<div key = {`row_${x}`}>{row}</div>);
        }
        return array;
    }

    return(
        <>
        {/* <div style = {paletteHolderStyle}>
            {makePalette(32,8)}
        </div> */}
        <div className = "color_picker_container" style = {{position:'relative',cursor:'pointer',width:'200px',height:'fit-content'}}>
        <div onClick = {(e) => {setActive(!active)}} style = {{position:'absolute',right:'0px',top:'0px',color:'white',backgroundColor:'blue'}}>{active?'[x]':'[ ]'}</div>
        <div style = {{display:'flex',alignItems:'center'}}>
        <div className = "control_label" onClick = {(e) => {console.log('hey2!');setActive(!active)}} style = {{color:'black',backgroundColor:active?'yellow':null}}>color palette</div>
        <div style = {{width:'10px',height:'10px',backgroundColor:textColor,margin:'0 6px'}}></div>
        <div style = {{width:'10px',height:'10px',backgroundColor:backgroundColor,margin:'0 2px'}}></div>
        </div>
        {active &&
        <div style = {{paddingLeft:'20px'}}>
            <div style = {{display:'flex'}}>
                <div style = {{width:'fit-content',backgroundColor:backgroundColor}}>
                    <span className = "control_label" style = {{backgroundColor:'black',mixBlendMode:'difference',color:'white'}}>{'background'}</span>
                </div>
                {' -- '}<span style = {{fontStyle:'italic'}}>{backgroundColor}</span>
            </div>
            <HexColorPicker style = {{border:'none',height:'40px',borderRadius:'0px'}} className = "color_picker" onChange={callback.bg} color = {defaultValue.bg}></HexColorPicker>
            <div style = {{display:'flex'}}>
                <div className = "control_label" style = {{color:textColor}}>{'text'}</div>
                {' -- '}<span style = {{fontStyle:'italic'}}>{textColor}</span>
            </div>
            <HexColorPicker style = {{border:'none',height:'40px',borderRadius:'0px'}} className = "color_picker" onChange={callback.fg} color = {defaultValue.fg}></HexColorPicker>
        </div>
        }
        </div>
        </>
    )
}

export default ColorPicker;