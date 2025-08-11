import { NumberField } from '@base-ui-components/react/number-field';
import { useState } from 'react'

function NumberInput({name,defaultValue,min,max,callback}){
    const [value,setValue] = useState(defaultValue);
    const handleValueChange = (newValue,event) => {
        callback(newValue);
        setValue(newValue);
    }
    const handleInputChange = (e) => {
        let val = parseInt(e.target.value);
        if(val > max){
            val = max;
        }
        else if(val < min){
            val = min;
        }
        callback(val);
        setValue(val);
    }
    return(
    <NumberField.Root className = "number_input_container" min = {min} max = {max} name = {name} defaultValue = {defaultValue} value = {value} onValueChange = {handleValueChange}>
    {/* <NumberField.ScrubArea>
        <NumberField.ScrubAreaCursor />
    </NumberField.ScrubArea> */}
    <div className = "number_input_label">{name}</div>
    <NumberField.Group className = "number_input">
        <NumberField.Decrement className = "number_input_button">{"< [ - ]"}</NumberField.Decrement>
        <NumberField.Input className = "number_input_box" onChange = {handleInputChange} ></NumberField.Input>
        <NumberField.Increment className = "number_input_button" >{"[ + ] >"}</NumberField.Increment>
    </NumberField.Group>
    </NumberField.Root>
    );
}
export default NumberInput;