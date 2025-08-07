import { useState } from 'react'

function Dropdown({label,callback,defaultValue,options}){

    const [value,setValue] = useState(defaultValue);

    const callbackFn = (event) => {
        callback(event.target.value);
        setValue(event.target.value);
    }

    return(
        <div className = "dropdown_container">
        <span className = "dropdown_label">{label}</span>
        <select className = "dropdown" value = {value}
            onInput  = {callbackFn}>
                <>{options.map(op => (<option key = {op}>{op}</option>))}</>
        </select>
        </div>
    )
}

export default Dropdown;