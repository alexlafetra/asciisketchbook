import { useState } from 'react'

function FilePicker({title,callback}){
    const [filename,setFilename] = useState(null);
    const selectFileCallback = async (e) =>{
        //make sure there's a file here
        if(e.target.files.length > 0){
            callback(e.target.files[0]);
        }
        setFilename(e.target.value);
    }
    return(
        <div className = "ui_component_container">
        <label className = "file_input">
        <input className = "button" type = "file" accept="image/png, image/jpeg, image/svg+xml, image/bmp" onChange = {selectFileCallback}></input>
        {(filename !== null) && (title+': ['+filename.split('C:\\fakepath\\')[1]+']')}
        {(filename === null) && title+': [upload an image]'}
        </label>
        </div>
    );
}
export default FilePicker;