import { useState , useEffect , useRef} from 'react'
import React from 'react'
import ColorPicker from './components/colorpicker';
import Slider from './components/slider';
import './App.css'
import './main.css';


function App() {

  const settings = {
    pixelDensity : 1,
    rows:25,
    columns:50,
    fontSize : 12,
    textSpacing : 0,
    lineHeight : 1.15,
    backgroundColor:'#ffffff',
    textColor : '#0000ff',
    activeHighlight : '#ffff00',
    advanceWhenCharacterEntered : false,
    presets : {
      house: {
        title: 'house',
        data : `                                                                                                                                                                                                                                   #  #                                               #          #                                     ###          #                                 ### /       # #                                  #  //      ###                                      /|#( (.#   ##|                               ,   ( (.#) #..  #/|                              . \\   ) )/ / . #./ /                             /// \\ /  /   /) ##  (                            ///// \\ ^  .-) ) # ) )                           ///  ///, ^/ # /  .  /                            |\\  // .=. ###/ ..  /                 .           |#\\ / /=  \\##  /    ##                  ##########|##\\ /==   \\ _) ^ #                   ##0##0####0#+###/====   \\) ^  ##7 7                 ###00###00#\\##|====== |# ) _^ 7                 '   #####0##0#\\#|====   |## )                           #########\\|====== |#                                    ####+=======+                                                                                                                         `,
        rows : 25,
        columns : 50
      },
      wire: {
        title:'wire',
        data : `                                                             #\\                                                 .\\                        y                        \\\\                      /.           _.            \\\\                    //            . \` --.       \\ \\                  ./              ._   \`\\\`\`\`-_  \\ \\__.             ;/              \`\`\`-_   \\    \`\`\`\\ \\ \\-.          / *                   \`\`\`\`\`-_  \\  \\ \\ \\ \\-,      : /                            \`\`\`\`.\\ \\ \\ \\ \\--. / ;                                 / y_. \\ \\ \\. \\ /                                 / /   \\_\\ \\ \\\\ \\ \`\`\`\`-_                          //\`       \\_\\ \\\\ \\      \`.\`\`\`-_                  //            \`-\`\\ \\\`\`\`-_  \\     \`\`\`             {.                 \\ ;    \`\`\`---_                                     \\ \\          \`\`\`\`                                  \`\\                                                 \`}                                                                                                                                                                                                                                                                                                                                                                            `,
        rows : 25,
        columns : 50
      }
    },
  }
  
  let canvasData = settings.presets.wire.data.padStart(settings.rows*settings.columns,' ');
  //holds the processed jsx children
  const [divContents,setDivContents] = useState(canvasData);
  const [bufferCanvas,setBufferCanvas] = useState(canvasData);
  const [currentChar,setCurrentChar] = useState('a');
  const [activeCharIndex,setActiveCharIndex] = useState(0);
  const [backgroundColor,setBackgroundColor] = useState(settings.backgroundColor);
  const [textColor,setTextColor] = useState(settings.textColor);
  const [fontSize,setFontSize] = useState(settings.fontSize);
  const [textSpacing,setTextSpacing] = useState(settings.textSpacing);
  const [lineHeight,setLineHeight] = useState(settings.lineHeight);
  const [canvasDimensions,setCanvasDimensions] = useState({width:settings.columns,height:settings.rows});
  const [textSelectable,setTextSelectable] = useState(false);
  const [selectionBox,setSelectionBox] = useState({
    started : false,
    finished : false,
    startCoord : {x:0,y:0},
    endCoord : {x:0,y:0}
  });
  const [textClipboard,setTextClipboard] = useState({data:'',width:0,height:0});
  const [lineData,setLineData] = useState({
    begun : false,
    moved : false,
    startIndex : 0,
    endIndex : 0,
    char : currentChar
  });
  const activeCharIndexRef = useRef(activeCharIndex);
  const divContentsRef = useRef(divContents);
  const lineDataRef = useRef(lineData);
  const bufferCanvasRef = useRef(bufferCanvas);
  const selectionBoxRef = useRef(selectionBox);
  const canvasDimensionsRef = useRef(canvasDimensions);
  const currentCharRef = useRef(currentChar);
  const textClipboardRef = useRef(textClipboard);
  //making sure the callback can access "fresh" versions of state data
  useEffect(() => {
    activeCharIndexRef.current = activeCharIndex;
  }, [activeCharIndex]);

  useEffect(() => {
    divContentsRef.current = divContents;
  }, [divContents]);

  useEffect(() => {
    lineDataRef.current = lineData;
  },[lineData]);

  useEffect(() => {
    bufferCanvasRef.current = bufferCanvas;
  },[bufferCanvas]);

  useEffect(() => {
    selectionBoxRef.current = selectionBox;
  },[selectionBox]);

  useEffect(() => {
    canvasDimensionsRef.current = canvasDimensions;
  },[canvasDimensions]);

  useEffect(() => {
    currentCharRef.current = currentChar;
  },[currentChar]);

  useEffect(() => {
    textClipboardRef.current = textClipboard;
  },[textClipboard]);

  //add keypress event handlers, but only once
  useEffect(() => {
    window.document.addEventListener('keyup', handleKeyPress);
    return () => {
      window.document.removeEventListener('keyup', handleKeyPress);
    }
  }, []);

  // for(let i = 0; i<canvasDimensions.height*settings.columns; i++){
  //   canvasData+=' ';
  // }

  function createBackground(){
    let side = '';
    side = side.padStart(canvasDimensions.width,' ');
    side = '|'+side+'|';
    let str = '';
    for(let i = 0; i<canvasDimensions.height; i++){
      str += side +'\n';
    }
    let top = '';
    top = top.padStart(canvasDimensions.width,'-');
    top = '*'+top+'*';
    return top+'\n'+str+top;
  }

  function resizeCanvas(originalDims,newDims,data){
    let newString = '';
    for(let r = 1; r<Math.min(originalDims.height,newDims.height); r++){
      //get the original row
      let rowString = data.substring((r-1)*originalDims.width,Math.min((r*originalDims.width),(r*newDims.width)));
      rowString = rowString.padEnd(newDims.width,' ');
      newString += rowString;
    }
    newString = newString.padEnd(newDims.width*newDims.height,' ');
    setCanvasDimensions({width:newDims.width,height:newDims.height});
    return newString;
  }

  function startLine(index){
    const line = {
      begun : true,
      moved : false,
      startIndex : index,
      endIndex : null,
      char : currentChar
    }
    setLineData(line);
    //store a copy of div contents in buffer canvas, so you can draw arbitrary lines on top of divContents w/o loosing anything
    setBufferCanvas(divContents);
  }
  function endLine(endIndex){
    const start = {x:lineData.startIndex%canvasDimensions.width,y:Math.trunc(lineData.startIndex/canvasDimensions.width)};
    const end = {x:endIndex%canvasDimensions.width,y:Math.trunc(endIndex/canvasDimensions.width)};
    const line = {
      begun : false,
      moved : false,
      startIndex : lineData.startIndex,
      endIndex : endIndex,
      char : currentChar
    };
    let tempCanvas = bufferCanvas;
    tempCanvas = drawLine(start,end,currentChar,tempCanvas);
    setLineData(line);
    setDivContents(tempCanvas);
    setBufferCanvas(tempCanvas);
  }

  function getClickIndex(e){
    const clickCoords = {
      x:e.clientX - e.target.offsetParent.offsetLeft,
      y:e.clientY - e.target.offsetParent.offsetTop
    };
    //px per char
    const characterDims = {
      width : e.target.clientWidth / canvasDimensions.width,
      height : e.target.clientHeight / canvasDimensions.height,
    };

    return Math.trunc(clickCoords.x/characterDims.width)+canvasDimensions.width*Math.trunc(clickCoords.y/characterDims.height);
  }

  function getClickCoords(e){
    const clickCoords = {
      x:e.clientX - e.target.offsetParent.offsetLeft,
      y:e.clientY - e.target.offsetParent.offsetTop
    };
    //px per char
    const characterDims = {
      width : e.target.clientWidth / canvasDimensions.width,
      height : e.target.clientHeight / canvasDimensions.height,
    };
    return {x: Math.trunc(clickCoords.x/characterDims.width),y:Math.trunc(clickCoords.y/characterDims.height)};
  }

  function handleMouseUp(e){
    const newIndex = getClickIndex(e);
    if(lineData.begun){
      if(lineData.moved){
        endLine(newIndex);
      }
      else{
        const line = {
          begun : false,
          moved : false,
          startIndex : lineData.startIndex,
          endIndex : null,
          char : currentChar
        };
        setLineData(line);
      }
    }
    if(selectionBox.started){
      const newBox = {
        started : false,
        finished : true,
        startCoord : selectionBox.startCoord,
        endCoord : getClickCoords(e)
      };
      setSelectionBox(newBox);
    }
  }

  function handleMouseDown(e){
    //selectionbox
    if(e.shiftKey){
      const newBox = {
        started : true,
        finished : false,
        startCoord : getClickCoords(e),
        endCoord : getClickCoords(e)
      };
      setSelectionBox(newBox);
    }
    else{
      //start drawing a line
      const newIndex = getClickIndex(e);
      startLine(newIndex);
      //cancel the selection box, if there was one
      const newBox = {
        started : false,
        finished : false,
        startCoord : getClickCoords(e),
        endCoord : getClickCoords(e)
      };
      setSelectionBox(newBox);
    }
  }
  function handleMouseMove(e){
    if(lineData.begun){
      const newIndex = getClickIndex(e);
      //if the index didn't change, you haven't moved
      if(newIndex === lineData.startIndex){
        return;
      }
      const tempCanvas = bufferCanvas;
      const start = {x:lineData.startIndex%canvasDimensions.width,y:Math.trunc(lineData.startIndex/canvasDimensions.width)};
      const coords = {x:newIndex%canvasDimensions.width,y:Math.trunc(newIndex/canvasDimensions.width)};
      
      const line = {
        begun : true,
        moved : true,
        startIndex : lineData.startIndex,
        endIndex : newIndex,
        char : currentChar
      };
      setLineData(line);
      setDivContents(drawLine(start,coords,currentChar,tempCanvas));
    }
    if(selectionBox.started){
      let newBox;
      if(e.shiftKey){
        newBox = {
          started : true,
          finished : false,
          startCoord : selectionBox.startCoord,
          endCoord : getClickCoords(e)
        };
      }
      else{
        newBox = {
          started : false,
          finished : false,
          startCoord : selectionBox.startCoord,
          endCoord : getClickCoords(e)
        };
      }
      setSelectionBox(newBox);
    }
  }

  function handleClick(e){
    const newIndex = getClickIndex(e);
    setActiveCharIndex(newIndex);
  }

  function setCharacter(index,char,data){
    //set active character
    setDivContents(data.substring(0,index)+char+data.substring(index+1));
  }

  function writeCharacter(index,char,data){
    return data.substring(0,index)+char+data.substring(index+1);
  }


  function drawLine(start,end,char,canvas){
    const steep = Math.abs(end.y - start.y) > Math.abs(end.x - start.x);
    if (steep) {
      [start.x, start.y] = [start.y,start.x];
      [end.x, end.y] = [end.y,end.x];
    }

    if (start.x > end.x) {
      [start.x, end.x] = [end.x,start.x];
      [start.y, end.y] = [end.y,start.y];
    }

    let dx, dy;
    dx = end.x - start.x;
    dy = Math.abs(end.y - start.y);

    let err = Math.trunc(dx / 2);
    let ystep;

    if (start.y < end.y) {
      ystep = 1;
    } else {
      ystep = -1;
    }
    let y = start.y;
    for (let x = start.x; x <= end.x; x++) {
      if (steep) {
        canvas = writeCharacter(x*canvasDimensions.width+y, char, canvas);
      } else {
        canvas = writeCharacter(y*canvasDimensions.width+x, char, canvas);
      }
      err -= dy;
      if (err < 0) {
        y += ystep;
        err += dx;
      }
    }
    return canvas;
  }

  function shiftCharacters(index,amount,data){
    let insertStr = '';
    const rowStartIndex = Math.trunc(index/canvasDimensions.width)*(canvasDimensions.width);
    const moveAmt = Math.min(amount<0?(canvasDimensions.width - index%canvasDimensions.width):(canvasDimensions.width - (index%canvasDimensions.width)),Math.abs(amount));
    for(let i = 0; i<moveAmt; i++){
      insertStr += ' ';
    }
    if(amount<0)
      setDivContents(data.substring(0,index)+data.substring(index+moveAmt,rowStartIndex+canvasDimensions.width)+insertStr+data.substring(rowStartIndex+canvasDimensions.width));
    else
      setDivContents(data.substring(0,index)+insertStr+data.substring(index,rowStartIndex+canvasDimensions.width-moveAmt)+data.substring(rowStartIndex+canvasDimensions.width));
  }
  function newLine(index,amount,data){
    const rowStartIndex = Math.trunc(index/canvasDimensions.width)*(canvasDimensions.width);
    let insertStr = '';
    for(let i = 0; i<canvasDimensions.width; i++){
      insertStr += ' ';
    }
    const moveAmt = Math.min(amount>0?canvasDimensions.height:(rowStartIndex/canvasDimensions.width),Math.abs(amount))
    if(amount>0){
      for(let i = 0; i<moveAmt; i++){
        setDivContents(data.substring(0,rowStartIndex)+insertStr+data.substring(rowStartIndex,data.length-canvasDimensions.width*moveAmt));
      }
    }
    else{
      for(let i = 0; i<moveAmt; i++){
        setDivContents(data.substring(0,rowStartIndex)+data.substring(rowStartIndex+canvasDimensions.width*moveAmt)+insertStr);
      }
    }
  }

  function moveColumn(index,amount,data){
    const rowIndex = Math.trunc(index/canvasDimensions.width);
    const colIndex = index % canvasDimensions.width;
    if(amount>0){
      for(let i = (canvasDimensions.height); i>rowIndex; i--){
        setCharacter(i*canvasDimensions.width+colIndex,data.charAt((i-1)*canvasDimensions.width+colIndex),data);
      }
      setCharacter(rowIndex*canvasDimensions.width+colIndex,' ');
    }
    else{
      for(let i = rowIndex; i<(canvasDimensions.height-1); i++){
        setCharacter(i*canvasDimensions.width+colIndex,data.charAt((i+1)*canvasDimensions.width+colIndex),data);
      }
    }
  }
  function copyArea(startCoord,endCoord,data,dataWidth){
    let tempData = data;
    let topL = {x:Math.min(startCoord.x,endCoord.x),y:Math.min(startCoord.y,endCoord.y)};
    let bottomR = {x:Math.max(startCoord.x,endCoord.x),y:Math.max(startCoord.y,endCoord.y)};
    let width = bottomR.x - topL.x;

    let copyStr = '';

    //for each row containing the cut, grab the part before, blank, and the part after
    for(let y = topL.y;y<bottomR.y;y++){
      const rowStart = dataWidth*y;
      const cutStart = rowStart+topL.x;
      const cutEnd = cutStart+width;
      const rowEnd = rowStart+dataWidth;
      copyStr += tempData.substring(cutStart,cutEnd);
    };
    //grab the rest of it
    return {data:copyStr,width : width, height: bottomR.y - topL.y};
  }
  function cutArea(startCoord,endCoord,data,dataWidth,fillCharacter){
    let tempData = data;
    let topL = {x:Math.min(startCoord.x,endCoord.x),y:Math.min(startCoord.y,endCoord.y)};
    let bottomR = {x:Math.max(startCoord.x,endCoord.x),y:Math.max(startCoord.y,endCoord.y)};
    let width = bottomR.x - topL.x;

    let cutStr = '';
    let blankStr = '';
    let newStr = '';
    blankStr = blankStr.padStart(width,fillCharacter);

    //first bit (before the first row cut)
    newStr += tempData.substring(0,dataWidth*topL.y);
    //for each row containing the cut, grab the part before, blank, and the part after
    for(let y = topL.y;y<bottomR.y;y++){
      const rowStart = dataWidth*y;
      const cutStart = rowStart+topL.x;
      const cutEnd = cutStart+width;
      const rowEnd = rowStart+dataWidth;
      newStr += tempData.substring(rowStart,cutStart)+blankStr+tempData.substring(cutEnd,rowEnd);
      cutStr += tempData.substring(cutStart,cutEnd);
    };
    //grab the rest of it
    newStr += tempData.substring((bottomR.y) * dataWidth);
    return {data:newStr,cutData:{data:cutStr,width : width, height: bottomR.y - topL.y}};
  }
  function paste(clipData,data,coords,dataWidth){
    let newData = '';
    //grab up until first row
    newData = data.substring(0,dataWidth*coords.y);
    for(let y = 0; y<clipData.height; y++){
      const pasteRow = clipData.data.substring(y*clipData.width,(y+1)*clipData.width);
      const rowStart = dataWidth*(coords.y+y);
      const pasteStart = rowStart+coords.x;
      const pasteEnd = pasteStart+clipData.width;
      const rowEnd = rowStart+dataWidth;
      newData += data.substring(rowStart,pasteStart)+pasteRow+data.substring(pasteEnd,rowEnd);
    }
    newData += data.substring(dataWidth*(coords.y+clipData.height));
    return newData;
  }

  function shiftArea(coords,direction,data,dataWidth){
    let topL = {x:Math.min(coords.startCoord.x,coords.endCoord.x),y:Math.min(coords.startCoord.y,coords.endCoord.y)};
    let bottomR = {x:Math.max(coords.startCoord.x,coords.endCoord.x),y:Math.max(coords.startCoord.y,coords.endCoord.y)};

    //checking bounds
    if(((topL.x + direction.x) < 0) || ((bottomR.x + direction.x) > dataWidth)){
      return data;
    }
    if(((topL.y + direction.y) < 0) || ((bottomR.y + direction.y) > data.length/dataWidth)){
      return data;
    }

    let newData = cutArea(coords.startCoord,coords.endCoord,data,dataWidth,' ');
    newData.data = paste(newData.cutData,newData.data,{x:Math.min(coords.startCoord.x,coords.endCoord.x)+direction.x,y:Math.min(coords.startCoord.y,coords.endCoord.y)+direction.y},dataWidth);
    return newData.data;
  }

  function handleKeyPress(e){
    //stop the event from bubbling, so this is only called once
    e.stopPropagation();
    //get fresh copies of the state data when this callback is fired
    const index = activeCharIndexRef.current;
    const activeChar = currentCharRef.current;
    const textData = divContentsRef.current;
    const line = lineDataRef.current;
    const bufCanvas = bufferCanvasRef.current;
    const selection = selectionBoxRef.current;
    const canvDims = canvasDimensionsRef.current;
    const clip = textClipboardRef.current;

    //janky way to see if it's a letter
    if(e.key.length === 1){
      if(e.key == 'x' && e.ctrlKey && (selection.started || selection.finished)){
        let newData = cutArea(selection.startCoord,selection.endCoord,textData,canvDims.width,' ');
        setDivContents(newData.data);
        setTextClipboard(newData.cutData);
        return;
      }
      else if(e.key == 'c' && e.ctrlKey && (selection.started || selection.finished)){
        let newData = copyArea(selection.startCoord,selection.endCoord,textData,canvDims.width,activeChar);
        setTextClipboard(newData);
        return;
      }
      //if ctrl v, and if there's something on the clipboard
      else if(e.key == 'v' && e.ctrlKey && clip.data.length){
        const coords = {x:index%canvDims.width,y:Math.trunc(index/canvDims.width)};
        const newData = paste(clip,textData,coords,canvDims.width);
        setDivContents(newData);
        return;
      }
      else if(e.key == 'f' && e.ctrlKey && (selection.started || selection.finished)){
        let newData = cutArea(selection.startCoord,selection.endCoord,textData,canvDims.width,activeChar);
        setDivContents(newData.data);
        return;
      }
      //if you're not drawing a line, set the active char
      if(!line.begun){
        setCharacter(index,e.key,textData);
        if(settings.advanceWhenCharacterEntered && (index%canvDims.width)<(canvDims.width-1)){
          setActiveCharIndex(index+1);
        }
      }
      //if you are drawing a line, redraw it with the new character
      else if(line.moved){
        const tempCanvas = bufCanvas;
        const startCoords = {x:line.startIndex%canvDims.width,y:Math.trunc(line.startIndex/canvDims.width)};
        const endCoords = {x:line.endIndex%canvDims.width,y:Math.trunc(line.endIndex/canvDims.width)};
        const newL = {
          begun : true,
          moved : true,
          startIndex : line.startIndex,
          endIndex : line.endIndex,
          char : e.key
        };
        setLineData(newL);
        setDivContents(drawLine(startCoords,endCoords,e.key,tempCanvas));
      }
      setCurrentChar(e.key);
    }
    else if(e.key === 'Backspace'){
      setCharacter(index,' ',textData);
    }
    else if(e.key === 'ArrowRight'){
      if(selection.started || selection.finished){
        setDivContents(shiftArea(selection,{x:1,y:0},textData,canvDims.width));
        setSelectionBox(
          {
            startCoord:{x:selection.startCoord.x+1,y:selection.startCoord.y},
            endCoord:{x:selection.endCoord.x+1,y:selection.endCoord.y},
            started : selection.started,
            finished : selection.finished
          }
        );
        return;
      }
      else if(e.shiftKey)
        shiftCharacters(index,1,textData);
      else if((index%canvDims.width)<(canvDims.width-1)){
        setActiveCharIndex(index+1);
      }
    }
    else if(e.key === 'ArrowLeft'){
      if(selection.started || selection.finished){
        setDivContents(shiftArea(selection,{x:-1,y:0},textData,canvDims.width));
        setSelectionBox(
          {
            startCoord:{x:selection.startCoord.x-1,y:selection.startCoord.y},
            endCoord:{x:selection.endCoord.x-1,y:selection.endCoord.y},
            started : selection.started,
            finished : selection.finished
          }
        );
        return;
      }
      else if(e.shiftKey)
        shiftCharacters(index,-1,textData);
      else if((index%canvDims.width)>0)
        setActiveCharIndex(index-1);

    }
    else if(e.key === 'ArrowUp'){
      if(selection.started || selection.finished){
        setDivContents(shiftArea(selection,{x:0,y:-1},textData,canvDims.width));
        setSelectionBox(
          {
            startCoord:{x:selection.startCoord.x,y:selection.startCoord.y-1},
            endCoord:{x:selection.endCoord.x,y:selection.endCoord.y-1},
            started : selection.started,
            finished : selection.finished
          }
        );
        return;
      }
      else if(e.shiftKey)
        moveColumn(index,-1,textData);
      else if(index/canvDims.width>=1){
        setActiveCharIndex(index-canvDims.width);
      }
    }
    else if(e.key === 'ArrowDown'){
      if(selection.started || selection.finished){
        setDivContents(shiftArea(selection,{x:0,y:1},textData,canvDims.width));
        setSelectionBox(
          {
            startCoord:{x:selection.startCoord.x,y:selection.startCoord.y+1},
            endCoord:{x:selection.endCoord.x,y:selection.endCoord.y+1},
            started : selection.started,
            finished : selection.finished
          }
        );
        return;
      }
      else if(e.shiftKey)
        moveColumn(index,1,textData);
      else if(index/canvDims.width<(canvDims.height-1)){
        setActiveCharIndex(index+canvDims.width);
      }
    }
    else if(e.key == 'Enter'){
      if(e.shiftKey)
        newLine(index,-1,textData);
      else
        newLine(index,1,textData);
    }
  }

  //adds in \n characters and a <span> container for the highlighted text
  function processText(data){
    let finalString = '';
    for(let row = 0; row<canvasDimensions.height; row++){
      finalString += data.substring(row*canvasDimensions.width,(row+1)*canvasDimensions.width)+'\n';
    }
    finalString = [finalString.substring(0,activeCharIndex+Math.trunc(activeCharIndex/canvasDimensions.width)),<span key = '1' className = "active_character" style = {{backgroundColor:settings.activeHighlight,lineHeight:lineHeight,letterSpacing:textSpacing+'px'}}>{finalString.charAt(activeCharIndex+Math.trunc(activeCharIndex/canvasDimensions.width))}</span>,finalString.substring(activeCharIndex+Math.trunc(activeCharIndex/canvasDimensions.width)+1)];
    return finalString;
  }

  const asciiDisplayStyle = {
    zIndex : 2,
    display:'block',
    width : 'fit-content',
    height : 'fit-content',
    transform:'scale(3,1)',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize:'40px',
    backgroundColor:'#ffff00ff',
    color:'#0000ff'
  }

  const selectionBoxStyle = {
    width:String(Math.abs(selectionBox.startCoord.x - selectionBox.endCoord.x))+'ch',
    height:String(Math.abs(selectionBox.startCoord.y - selectionBox.endCoord.y)*lineHeight)+'em',
    left:Math.min(selectionBox.startCoord.x,selectionBox.endCoord.x) + 'ch',
    top:String(Math.min(selectionBox.startCoord.y,selectionBox.endCoord.y)*lineHeight) + 'em',
    lineHeight:lineHeight,
    letterSpacing:textSpacing+'px',
    fontSize:fontSize+'px',
    borderColor:textColor
  }
  return (
    <>
      {/* canvas */}
      <div className = "canvas_container" style = {{lineHeight:lineHeight,letterSpacing:textSpacing+'px',backgroundColor:backgroundColor}}>
        {(selectionBox.started||selectionBox.finished) &&
          <div className = "selection_box" style = {selectionBoxStyle}/>
        }
        <div className = "ascii_canvas" onMouseMove = {handleMouseMove} onMouseDown = {handleMouseDown} onMouseUp = {handleMouseUp} onClick = {handleClick} style = {{userSelect : textSelectable?'default':'none',cursor:'pointer',fontSize:fontSize+'px',color:textColor,backgroundColor:'transparent',width: canvasDimensions.width+'ch'}}>
          {processText(divContents)}
        </div>
        <div className = "canvas_background" style = {{top:'-'+String(lineHeight)+'em',fontSize:fontSize+'px',width: canvasDimensions.width+2+'ch'}}>
          {createBackground()}
        </div>
      </div>
      {/* controls */}
      <div className = "ui_container" style = {{display:'block'}}>
        <div className = 'ascii_display' style = {asciiDisplayStyle} >{currentChar === ' '?'{ }':currentChar}</div>
        {!(selectionBox.started || selectionBox.finished) && 
          <div className = 'help_text'>(shift+drag to select an area)</div>
        }
        {(selectionBox.started && !selectionBox.finished) &&
          <div className = 'help_text'>selecting [{selectionBox.startCoord.x},{selectionBox.startCoord.y}],[{selectionBox.endCoord.x},{selectionBox.endCoord.y}]...</div>
        }
        {selectionBox.finished &&
          <div className = 'help_text'>(arrow keys to translate area)</div>
        }
        <div className = "ascii_button" onClick = {(e) => {setTextSelectable(!textSelectable);}}>selectable [{textSelectable?'X':' '}]</div>
        {(selectionBox.started || selectionBox.finished) && 
        <>
        <div className = "ascii_button" onClick = {(e) => {if(selectionBox.started || selectionBox.finished){
                                                              const newData = cutArea(selectionBox.startCoord,selectionBox.endCoord,divContents,canvasDimensions.width,' ');
                                                              setDivContents(newData.data);
                                                            }}}>cut (ctrl+x)</div>
        <div className = "ascii_button" onClick = {(e) => {if(selectionBox.started || selectionBox.finished){
                                                              const newData = copyArea(selectionBox.startCoord,selectionBox.endCoord,divContents,canvasDimensions.width,' ');
                                                              setTextClipboard(newData);
                                                            }}}>copy (ctrl+c)</div>
        </>}
        {/* paste button, when there's something to paste */}
        {!(textClipboard.data.length === 0) && 
          <div className = "ascii_button" onClick = {(e) => {
                                                            const coords = {x:activeCharIndex%canvasDimensions.width,y:Math.trunc(activeCharIndex/canvasDimensions.width)};
                                                            const newData = paste(textClipboard,divContents,coords,canvasDimensions.width);
                                                            console.log(newData);                                                           
                                                            setDivContents(newData.data);
                                                          }}>paste (ctrl+v)</div>
        }
        {/* fill */}
        {(selectionBox.started || selectionBox.finished) && 
        <div className = "ascii_button" onClick = {(e) => {if(selectionBox.started || selectionBox.finished){
                                                                const newData = cutArea(selectionBox.startCoord,selectionBox.endCoord,divContents,canvasDimensions.width,currentChar);
                                                                setDivContents(newData.data);
                                                              }}}>fill (ctrl+f)</div>
        }
        <div className = "ascii_button" onClick = {(e) => {setDivContents(resizeCanvas({width:canvasDimensions.width,height:canvasDimensions.height},{width:100,height:50},divContents))}}>extend</div>
        <div className = "ascii_button" onClick = {(e) => {navigator.clipboard.writeText(processText(divContents));}}>copy (multiline)</div>
        <div className = "ascii_button" onClick = {(e) => {navigator.clipboard.writeText(divContents);}}>copy (single line)</div>
        <div className = "ascii_button" onClick = {(e) => {canvasData=``;
        for(let i = 0; i<canvasDimensions.height*canvasDimensions.width; i++){
          canvasData+=' ';
        }setDivContents(canvasData);}}>clear</div>
        <ColorPicker label = 'background' defaultValue={backgroundColor} callback = {(e) => {setBackgroundColor(e);}}></ColorPicker>
        <ColorPicker label = 'text' defaultValue={textColor} callback = {(e) => {setTextColor(e);}}></ColorPicker>
        <Slider maxLength = {20} label = {'font size'} stepsize = {1} callback = {(val) => {setFontSize(val)}} defaultValue={settings.fontSize} min = {1} max = {20}></Slider>
        <Slider maxLength = {20} label = {'spacing'} stepsize = {0.1} callback = {(val) => {setTextSpacing(val)}} defaultValue={textSpacing} min = {-4} max = {4}></Slider>
        <Slider maxLength = {20} label = {'line height'} stepsize = {0.01} callback = {(val) => {setLineHeight(val)}} defaultValue={lineHeight} min = {0.1} max = {2}></Slider>
      </div>
    </>
  )
}

export default App