import { useState } from "react";

function AsciiCharacter({defaultVal,isActive,index,data}){
    const [value,setValue] = useState(defaultVal);
    const [active,setActive] = useState(isActive);
    return(
        <span key = {index} string-index = {index} className = {(value === ' ')?"blank_character":"normal_character"} style = {{color:settings.characterColor,backgroundColor:((data.charAt(char) === ' ')?settings.blankBackground:settings.characterBackground)}}onClick = {handleClick}>{data.charAt(char)}</span>
    )
}
export default AsciiCharacter;