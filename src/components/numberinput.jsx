import { NumberField } from '@base-ui-components/react/number-field';
import { useState } from 'react'

function NumberInput({name,value,min,max,inputCallback,buttonCallback}){
    // const [value,setValue] = useState(defaultValue);
    const handleButtonChange = (newValue,event) => {
        if(event === undefined){
            return;
        }
        //only react to PointerEvents
        if(event.type === 'pointerdown'){
            buttonCallback(newValue);
        }
    }
    const handleInputChange = (e) => {
        e.stopPropagation();
        let val;

        //if NaN is passed, it means the textbox is empty
        //and u should just pretend it's the min value
        if(e.target.value === '')
            val = min;
        else
            val = parseInt(e.target.value);

        if(val > max){
            val = max;
        }
        else if(val < min){
            val = min;
        }
        inputCallback(val);
    }

    return(
    <NumberField.Root format = {{useGrouping:false}} className = "number_input_container" min = {min} max = {max} name = {name} value = {value} onValueChange = {handleButtonChange}>
        <NumberField.Group className = "number_input">
            <NumberField.Decrement className = "number_input_button">{"[ - ]"}</NumberField.Decrement>
            <NumberField.Input className = "number_input_box" onChange = {handleInputChange} ></NumberField.Input>
            <NumberField.Increment className = "number_input_button" >{"[ + ]"}</NumberField.Increment>
        </NumberField.Group>
    </NumberField.Root>
    );
}
export default NumberInput;