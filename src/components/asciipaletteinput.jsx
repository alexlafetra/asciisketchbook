import * as React from 'react';
import { Input } from '@base-ui-components/react/input';


function AsciiPaletteInput({value,callback}){
    const asciiPaletteInputStyle = {
        width:String(value.length)+'ch',
        minWidth:'22ch',
        fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    }
    function inputHandler(e){
        e.stopPropagation();
        callback(e.target.value);
    }
    return(
        <div style = {asciiPaletteInputStyle}>
        <span>Palette characters:</span>
        <Input style = {asciiPaletteInputStyle} value = {value} onInput = {inputHandler}/>
        <span>{'<- darkest'}</span><span style = {{position:'relative',float:'right'}}>{' lightest ->'}</span>
        </div>
    )
}

export default AsciiPaletteInput;