import { useState , useEffect , useRef} from 'react'
import React from 'react'
import ColorPicker from './components/colorpicker';
import Slider from './components/slider';
import './App.css'
import './main.css';


function App() {

  const settings = {
    pixelDensity : 1,
    canvasWidth : window.innerWidth,
    canvasHeight : window.innerHeight,
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
    },
  }
  
  let canvasData = settings.presets.house.data.padStart(settings.rows*settings.columns,' ');
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

  //add keypress event handlers, but only once
  useEffect(() => {
    window.document.addEventListener('keyup', handleKeyPress);
    return () => {
      window.document.removeEventListener('keyup', handleKeyPress);
    }
  }, []);

  // for(let i = 0; i<settings.rows*settings.columns; i++){
  //   canvasData+=' ';
  // }

  function createBackground(){
    let side = '';
    side = side.padStart(settings.columns,' ');
    side = '|'+side+'|';
    let str = '';
    for(let i = 0; i<settings.rows; i++){
      str += side +'\n';
    }
    let top = '';
    top = top.padStart(settings.columns,'-');
    top = '*'+top+'*';
    return top+'\n'+str+top;
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
    const start = {x:lineData.startIndex%settings.columns,y:Math.trunc(lineData.startIndex/settings.columns)};
    const end = {x:endIndex%settings.columns,y:Math.trunc(endIndex/settings.columns)};
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
      width : e.target.clientWidth / settings.columns,
      height : e.target.clientHeight / settings.rows,
    };

    return Math.trunc(clickCoords.x/characterDims.width)+settings.columns*Math.trunc(clickCoords.y/characterDims.height);
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
  }

  function handleMouseDown(e){
    //if shifting, then start drawing a line
    if(e.shiftKey){
      const newIndex = getClickIndex(e);
      startLine(newIndex);
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
      const start = {x:lineData.startIndex%settings.columns,y:Math.trunc(lineData.startIndex/settings.columns)};
      const coords = {x:newIndex%settings.columns,y:Math.trunc(newIndex/settings.columns)};
      
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
        canvas = writeCharacter(x*settings.columns+y, char, canvas);
      } else {
        canvas = writeCharacter(y*settings.columns+x, char, canvas);
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
    const rowStartIndex = Math.trunc(index/settings.columns)*(settings.columns);
    const moveAmt = Math.min(amount<0?(settings.columns - index%settings.columns):(settings.columns - (index%settings.columns)),Math.abs(amount));
    for(let i = 0; i<moveAmt; i++){
      insertStr += ' ';
    }
    if(amount<0)
      setDivContents(data.substring(0,index)+data.substring(index+moveAmt,rowStartIndex+settings.columns)+insertStr+data.substring(rowStartIndex+settings.columns));
    else
      setDivContents(data.substring(0,index)+insertStr+data.substring(index,rowStartIndex+settings.columns-moveAmt)+data.substring(rowStartIndex+settings.columns));
  }
  function newLine(index,amount,data){
    const rowStartIndex = Math.trunc(index/settings.columns)*(settings.columns);
    let insertStr = '';
    for(let i = 0; i<settings.columns; i++){
      insertStr += ' ';
    }
    const moveAmt = Math.min(amount>0?settings.rows:(rowStartIndex/settings.columns),Math.abs(amount))
    if(amount>0){
      for(let i = 0; i<moveAmt; i++){
        setDivContents(data.substring(0,rowStartIndex)+insertStr+data.substring(rowStartIndex,data.length-settings.columns*moveAmt));
      }
    }
    else{
      for(let i = 0; i<moveAmt; i++){
        setDivContents(data.substring(0,rowStartIndex)+data.substring(rowStartIndex+settings.columns*moveAmt)+insertStr);
      }
    }
  }

  function moveColumn(index,amount,data){
    const rowIndex = Math.trunc(index/settings.columns);
    const colIndex = index % settings.columns;
    if(amount>0){
      for(let i = (settings.rows); i>rowIndex; i--){
        setCharacter(i*settings.columns+colIndex,data.charAt((i-1)*settings.columns+colIndex),data);
      }
      setCharacter(rowIndex*settings.columns+colIndex,' ');
    }
    else{
      for(let i = rowIndex; i<(settings.rows-1); i++){
        setCharacter(i*settings.columns+colIndex,data.charAt((i+1)*settings.columns+colIndex),data);
      }
    }
  }

  function handleKeyPress(e){
    //stop the event from bubbling, so this is only called once
    e.stopPropagation();
    //get fresh copies of the state data when this callback is fired
    const index = activeCharIndexRef.current;
    const textData = divContentsRef.current;
    const line = lineDataRef.current;
    const bufCanvas = bufferCanvasRef.current;

    //janky way to see if it's a letter
    if(e.key.length === 1){
      //if you're not drawing a line, set the active char
      if(!line.begun){
        setCharacter(index,e.key,textData);
        if(settings.advanceWhenCharacterEntered && (index%settings.columns)<(settings.columns-1)){
          setActiveCharIndex(index+1);
        }
      }
      //if you are drawing a line, redraw it with the new character
      else if(line.moved){
        const tempCanvas = bufCanvas;
        const startCoords = {x:line.startIndex%settings.columns,y:Math.trunc(line.startIndex/settings.columns)};
        const endCoords = {x:line.endIndex%settings.columns,y:Math.trunc(line.endIndex/settings.columns)};
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
      if(e.shiftKey)
        shiftCharacters(index,1,textData);
      else if((index%settings.columns)<(settings.columns-1)){
        setActiveCharIndex(index+1);
      }
    }
    else if(e.key === 'ArrowLeft'){
      if(e.shiftKey)
        shiftCharacters(index,-1,textData);
      else if((index%settings.columns)>0)
        setActiveCharIndex(index-1);

    }
    else if(e.key === 'ArrowUp'){
      if(e.shiftKey)
        moveColumn(index,-1,textData);
      else if(index/settings.columns>=1){
        setActiveCharIndex(index-settings.columns);
      }
    }
    else if(e.key === 'ArrowDown'){
      if(e.shiftKey)
        moveColumn(index,1,textData);
      else if(index/settings.columns<(settings.rows-1)){
        setActiveCharIndex(index+settings.columns);
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
    for(let row = 0; row<settings.rows; row++){
      finalString += data.substring(row*settings.columns,(row+1)*settings.columns)+'\n';
    }
    finalString = [finalString.substring(0,activeCharIndex+Math.trunc(activeCharIndex/settings.columns)),<span key = '1' className = "active_character" style = {{backgroundColor:settings.activeHighlight}}>{finalString.charAt(activeCharIndex+Math.trunc(activeCharIndex/settings.columns))}</span>,finalString.substring(activeCharIndex+Math.trunc(activeCharIndex/settings.columns)+1)];
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

  return (
    <>
      {/* canvas */}
      <div className = "canvas_container" style = {{lineHeight:lineHeight,letterSpacing:textSpacing+'px'}}>
        <div className = "ascii_canvas" onMouseMove = {handleMouseMove} onMouseDown = {handleMouseDown} onMouseUp = {handleMouseUp} onClick = {handleClick} style = {{cursor:'pointer',fontSize:fontSize+'px',color:textColor,backgroundColor:backgroundColor,width: settings.columns+'ch'}}>
          {processText(divContents)}
        </div>
        <div className = "canvas_background" style = {{fontSize:fontSize+'px',width: settings.columns+2+'ch'}}>
          {createBackground()}
        </div>
      </div>
      {/* controls */}
      <div className = "ui_container" style = {{display:'block'}}>
        <div className = 'ascii_display' style = {asciiDisplayStyle} >{currentChar === ' '?'{ }':currentChar}</div>
        <div className = 'help_text'>(shift+click) lines</div>
        <div className = "ascii_button" onClick = {(e) => {navigator.clipboard.writeText(processText(divContents));}}>copy (multiline)</div>
        <div className = "ascii_button" onClick = {(e) => {navigator.clipboard.writeText(divContents);}}>copy (single line)</div>
        <div className = "ascii_button" onClick = {(e) => {canvasData=``;
        for(let i = 0; i<settings.rows*settings.columns; i++){
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