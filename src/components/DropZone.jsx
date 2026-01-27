import { useEffect } from "react";

export const DropZone = ({title,callback}) => {
    function dropHandler(ev) {
        
        const files = [...ev.dataTransfer.items]
        .map((item) => item.getAsFile())
        .filter((file) => file);
        console.log(files);
        callback(files);
    }
    useEffect(()=>{
        //add in drop zone listeners
        window.addEventListener("drop", (e) => {
        if ([...e.dataTransfer.items].some((item) => item.kind === "file")) {
            e.preventDefault();
        }
        });

        window.addEventListener("dragover", (e) => {
        const fileItems = [...e.dataTransfer.items].filter(
            (item) => item.kind === "file",
        );
        if (fileItems.length > 0) {
            e.preventDefault();
        }
        });
    },[]);

    const style = {
        width:'fit-content',
        height:'fit-content',
        whiteSpace:'pre',
        padding:'0px',
        border:'none'
    };

    return(
        <label className = "drop-zone" style = {style} onDrop = {dropHandler} onDragOver={(e)=>{
            const fileItems = [...e.dataTransfer.items].filter(
                (item) => item.kind === "file",
            );
            if (fileItems.length > 0) {
                e.preventDefault();
                if (fileItems.some((item) => (item.type.startsWith("image/") || item.type.startsWith("video/")))) {
                    e.dataTransfer.dropEffect = "copy";
                } else {
                    e.dataTransfer.dropEffect = "none";
                }
            }
        }}>
          {title}
          <input type="file" className="file-input" multiple accept="image/* video/*" style = {{display:'none'}} onInput={(e) => {
            console.log(e.target.files[0]);
            callback(e.target.files);
          }} />
        </label>
    )
}