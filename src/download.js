  export function downloadCanvas(canvas,options){
    let string = canvas.data;
    if(options.linebreaks){
      string = addLineBreaksToText(canvas);
    }
    else{
      string = canvas.data;
    }
    if(options.escaped){
      string = escapeTextData(string);
    }
    if(options.asConst){
      string = `//sketch ${canvas.width} x ${canvas.height}\nconst sketch = {\n\twidth:${canvas.width},\n\theight:${canvas.height},\n\tdata:'${string}'\n};`;
    }
    const blob = new Blob([string],{type:'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "sketch.txt";
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  }