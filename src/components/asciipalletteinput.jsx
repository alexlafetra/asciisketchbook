import * as React from 'react';
import { Input } from '@base-ui-components/react/input';


function AsciiPalletteInput({value,callback,style}){
    function inputHandler(e){
        e.stopPropagation();
        callback(e.target.value);
    }
    return(
        <div style = {style}>
        <span>Pallette characters:</span>
        <Input style = {style} value = {value} onInput = {inputHandler}/>
        <span>{'<- darkest'}</span><span style = {{position:'relative',float:'right'}}>{' lightest ->'}</span>
        </div>
    )
}

export default AsciiPalletteInput;