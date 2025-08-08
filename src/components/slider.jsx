import { useState } from 'react'

function Slider({maxLength,label,callback,min,max,stepsize,defaultValue}){

    const [value,setValue] = useState(defaultValue);
    const [defaultVal,setDefaultVal] = useState(defaultValue);

    const callbackFn = (event) => {
        callback(event.target.value);
        setValue(event.target.value);
    }

    let progressString = '';
    const prog = (value-min)/(max-min);
    progressString = progressString.padStart(prog*maxLength,'=');
    progressString ='['+progressString+']';
    progressString = progressString.padEnd(maxLength,'.')+'|';
    
    /* The slider itself */
    const sliderStyle = {
        appearance: 'none',
        width: String(maxLength)+'ch', /* Full-width */
        height: '20px', /* Specified height */
        backgroundColor:'transparent',
        outline: 'none', /* Remove outline */
        overflow: 'hidden',
        cursor:'pointer',
        position:'absolute',
        top:'0.5em',
        left:0,
    }

    const asciiDisplayStyle = {
        fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        position:'absolute',
        top:'1em',
        pointerEvents: 'none'
    }
    return(
        <div className = "slider_container">
            <span className = "slider_label" >{label + ":" + value}</span>
            {(value != defaultVal) && <span className = "slider_reset_button" style = {{cursor:'pointer'}}onClick = {(e) => {callback(defaultVal);setValue(defaultVal);}}>[x]</span>}
            <input className = "slider" type = "range" min = {min} max = {max} step = {stepsize} value = {value} onInput  = {callbackFn} style = {sliderStyle}>
            </input>
            <div className = "slider_ascii_display" style = {asciiDisplayStyle}>{progressString}</div>
        </div>
    )
}

export default Slider;