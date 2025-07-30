import { useState , useEffect , useRef} from 'react'
import React from 'react'
import ColorPicker from './components/colorpicker';
import './App.css'
import './main.css';


function App() {

  const settings = {
    pixelDensity : 1,
    canvasWidth : window.innerWidth,
    canvasHeight : window.innerHeight,
    rows:25,
    columns:50,
    fontSize : 20,
    backgroundColor:'#0099ff',
    textColor : '#0000ff',
    activeHighlight : '#ffff00',
    advanceWhenCharacterEntered : false,
  }

  const house = `                                                                                                                               #  #                                               #          #                                     ###          #                                 ### /       # #                                  #  //      ###                                      /|#( (.#   ##|                               ,   ( (.#) #..  #/|                              . \\   ) )/ / . #./ /                             /// \\ /  /   /) ##  (                            ///// \\ ^  .-) ) # ) )                           ///  ///, ^/ # /  .  /                            |\\  // .=. ###/ ..  /                             |#\\ / /=  \\##  /    ##                  ##########|##\\ /==   \\ _) ^ #                   ############+###/====   \\) ^  ##7 7                 ###########\\##|====== |# ) _^ 7                     ##########\\#|====   |## )                           #########\\|====== |#                                    ####+=======+                                                                                                                         `;
  let canvasData = house;
  //holds the processed jsx children
  const [divContents,setDivContents] = useState(canvasData);
  const [activeCharIndex,setActiveCharIndex] = useState(0);
  const [backgroundColor,setBackgroundColor] = useState(settings.backgroundColor);
  const [textColor,setTextColor] = useState(settings.textColor);
  const activeCharIndexRef = useRef(activeCharIndex);
  const divContentsRef = useRef(divContents);

  //making sure the callback can access "fresh" versions of state data
  useEffect(() => {
    activeCharIndexRef.current = activeCharIndex;
  }, [activeCharIndex]);

  useEffect(() => {
    divContentsRef.current = divContents;
  }, [divContents]);

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

  function handleClick(e){
    const clickCoords = {
      x:e.clientX - e.target.offsetLeft,
      y:e.clientY - e.target.offsetTop
    };
    //px per char
    const characterDims = {
      width : e.target.clientWidth / settings.columns,
      height : e.target.clientHeight / settings.rows,
    };

    const newIndex = Math.trunc(clickCoords.x/characterDims.width)+settings.columns*Math.trunc(clickCoords.y/characterDims.height);
    setActiveCharIndex(newIndex);
  }

  function setCharacter(index,char,data){
    //set active character
    setDivContents(data.substring(0,index)+char+data.substring(index+1));
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

    //janky way to see if it's a letter
    if(e.key.length === 1){
      setCharacter(index,e.key,textData);
      if(settings.advanceWhenCharacterEntered && (index%settings.columns)<(settings.columns-1)){
        setActiveCharIndex(index+1);
      }
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
    finalString = [finalString.substring(0,activeCharIndex+Math.trunc(activeCharIndex/settings.columns)),<span className = "active_character" style = {{backgroundColor:settings.activeHighlight}}>{finalString.charAt(activeCharIndex+Math.trunc(activeCharIndex/settings.columns))}</span>,finalString.substring(activeCharIndex+Math.trunc(activeCharIndex/settings.columns)+1)];
    return finalString;
  }

  return (
    <>
    {/* controls */}
    <div className = "ui_container" style = {{width:200,display:'block'}}>
      <div className = "ascii_button" onClick = {(e) => {navigator.clipboard.writeText(divContents);}}>copy</div>
      <div className = "ascii_button" onClick = {(e) => {canvasData=``;
      for(let i = 0; i<settings.rows*settings.columns; i++){
        canvasData+=' ';
      }setDivContents(canvasData);}}>clear</div>
      <input type="color" id="head" name="head" onChange = {(e) => {setBackgroundColor(e.target.value);}}value={backgroundColor} />
      <input type="color" id="head" name="head" onChange = {(e) => {setTextColor(e.target.value);}}value={textColor} />
      {/* <ColorPicker label = 'background' defaultValue={backgroundColor} callback = {(e) => {setBackgroundColor(e);}}></ColorPicker> */}
      {/* <ColorPicker label = 'text' defaultValue={textColor} callback = {(e) => {setTextColor(e);}}></ColorPicker> */}
      {/* canvas */}
    </div>

    <div className = "ascii_canvas" onClick = {handleClick} style = {{cursor:'pointer',fontSize:settings.fontSize+'px',color:textColor,backgroundColor:backgroundColor,width: settings.columns+'ch'}}>
      {processText(divContents)}
    </div>
    </>
  )
}

export default App
