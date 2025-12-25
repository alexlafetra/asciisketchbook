import { Input } from '@base-ui-components/react/input';


function AsciiPaletteInput({value,callback}){
    const asciiPaletteInputStyle = {
        // width:`${value.length}ch`,
        width:'fit-content',
        minWidth:'22ch',
        padding:'none',
        fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    }
    function inputHandler(e){
        e.stopPropagation();
        callback(e.target.value);
    }
    return(
        <>
        <span>(characters)</span>
        <div style = {asciiPaletteInputStyle}>
        <Input style = {{...asciiPaletteInputStyle,border:'none',width:`${value.length}ch`}} value = {value} onInput = {inputHandler}/>
        <div style = {{...asciiPaletteInputStyle,width:'100%',height:'1.5em',backgroundImage: 'linear-gradient(90deg, #ffffff, #000000)'}}></div>
        </div>
        </>
    )
}

export default AsciiPaletteInput;