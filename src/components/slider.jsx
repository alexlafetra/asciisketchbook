import { useState } from 'react'

function Slider({label,callback,min,max,stepsize,defaultValue}){

    const [value,setValue] = useState(defaultValue);

    const callbackFn = (event) => {
        callback(event.target.value);
        setValue(event.target.value);
    }

    return(
        <div className = "slider_container">
        <span className = "slider_label">{label + ":" + value}</span>
        <input className = "slider" type = "range" min = {min} max = {max} step = {stepsize} value = {value}
            onInput  = {callbackFn}
            />
        </div>
    )
}

export default Slider;