import { useState , useEffect} from 'react'
import React from 'react'
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
    characterColor : '#0000ffff',
    characterBackground : '#ffffffff',
    activeHighlight : '#ffff00ff',
    blankBackground : '#ffffffff',
    advanceWhenCharacterEntered : false,
  }

  const house = `                                                                                                                               #  #                                               #          #                                     ###          #                                 ### /       # #                                  #  //      ###                                      /|#( (.#   ##|                               ,   ( (.#) #..  #/|                              . \\   ) )/ / . #./ /                             /// \\ /  /   /) ##  (                            ///// \\ ^  .-) ) # ) )                           ///  ///, ^/ # /  .  /                            |\\  // .=. ###/ ..  /                             |#\\ / /=  \\##  /    ##                  ##########|##\\ /==   \\ _) ^ #                   ############+###/====   \\) ^  ##7 7                 ###########\\##|====== |# ) _^ 7                     ##########\\#|====   |## )                           #########\\|====== |#                                    ####+=======+                                                                                                                         `;
  let canvasData = '';
  for(let i = 0; i<settings.rows*settings.columns; i++){
    canvasData+=' ';
  }

  let activeCharacter = 0;

  function handleClick(e){
    //stop the event from bubbling, so this is only called once
    // e.stopPropagation();
    activeCharacter = parseInt(e.target.getAttribute("string-index"));
    setActiveCharIndex(activeCharacter);
    setDivContents(processStringIntoDom(canvasData,activeCharacter,settings));
  }

  function setCharacter(index,char){
    //set active character
    canvasData = canvasData.substring(0,index)+char+canvasData.substring(index+1);
  }

  function shiftCharacters(index,amount){
    let insertStr = '';
    const rowStartIndex = Math.trunc(index/settings.columns)*(settings.columns);
    const moveAmt = Math.min(amount<0?(settings.columns - index%settings.columns):(settings.columns - (index%settings.columns)),Math.abs(amount));
    for(let i = 0; i<moveAmt; i++){
      insertStr += ' ';
    }
    if(amount<0)
      canvasData = canvasData.substring(0,index)+canvasData.substring(index+moveAmt,rowStartIndex+settings.columns)+insertStr+canvasData.substring(rowStartIndex+settings.columns);
    else
      canvasData = canvasData.substring(0,index)+insertStr+canvasData.substring(index,rowStartIndex+settings.columns-moveAmt)+canvasData.substring(rowStartIndex+settings.columns);
  }
  function newLine(index,amount){
    const rowStartIndex = Math.trunc(index/settings.columns)*(settings.columns);
    let insertStr = '';
    for(let i = 0; i<settings.columns; i++){
      insertStr += ' ';
    }
    const moveAmt = Math.min(amount>0?settings.rows:(rowStartIndex/settings.columns),Math.abs(amount))
    if(amount>0){
      for(let i = 0; i<moveAmt; i++){
        canvasData = canvasData.substring(0,rowStartIndex)+insertStr+canvasData.substring(rowStartIndex,canvasData.length-settings.columns*moveAmt);
      }
    }
    else{
      for(let i = 0; i<moveAmt; i++){
        canvasData = canvasData.substring(0,rowStartIndex)+canvasData.substring(rowStartIndex+settings.columns*moveAmt)+insertStr;
      }
    }
  }
  function moveColumn(index,amount){
    const rowIndex = Math.trunc(index/settings.columns);
    const colIndex = index % settings.columns;
    if(amount>0){
      for(let i = (settings.rows); i>rowIndex; i--){
        setCharacter(i*settings.columns+colIndex,canvasData.charAt((i-1)*settings.columns+colIndex));
      }
      setCharacter(rowIndex*settings.columns+colIndex,' ');
    }
    else{
      for(let i = rowIndex; i<(settings.rows-1); i++){
        setCharacter(i*settings.columns+colIndex,canvasData.charAt((i+1)*settings.columns+colIndex));
      }
    }
  }

  function handleKeyPress(e){
    //stop the event from bubbling, so this is only called once
    e.stopPropagation();
    //janky way to see if it's a letter
    if(e.key.length === 1){
      setCharacter(activeCharacter,e.key);
      if(settings.advanceWhenCharacterEntered && (activeCharacter%settings.columns)<(settings.columns-1)){
        activeCharacter++;
      }
    }
    else if(e.key === 'Backspace'){
      setCharacter(activeCharacter,' ');
    }
    else if(e.key === 'ArrowRight'){
      if(e.shiftKey)
        shiftCharacters(activeCharacter,1);
      else if((activeCharacter%settings.columns)<(settings.columns-1))
        activeCharacter++;
    }
    else if(e.key === 'ArrowLeft'){
      if(e.shiftKey)
        shiftCharacters(activeCharacter,-1);
      else if((activeCharacter%settings.columns)>0)
        activeCharacter--;

    }
    else if(e.key === 'ArrowUp'){
      if(e.shiftKey)
        moveColumn(activeCharacter,-1);
      else if(activeCharacter/settings.columns>=1){
        activeCharacter-=settings.columns;
      }
    }
    else if(e.key === 'ArrowDown'){
      if(e.shiftKey)
        moveColumn(activeCharacter,1);
      else if(activeCharacter/settings.columns<settings.rows-1){
        activeCharacter+=settings.columns;
      }
    }
    else if(e.key == 'Enter'){
      if(e.shiftKey)
        newLine(activeCharacter,-1);
      else
        newLine(activeCharacter,1);
    }
    setDivContents(processStringIntoDom(canvasData,activeCharacter,settings));
  }

  const processStringIntoDom = (data,active,appSettings) => {
    const children = [];
    let char = 0;
    for(let row = 0; row<appSettings.rows; row++){
      let rowChildren = [];
      for(let column = 0; column<appSettings.columns; column++){
        //if you're out of characters, break
        if(char >= data.length){
          break;
        }
        //if you hit the active character
        else if(char == active){
          rowChildren.push(<span key = {char} id = {char} string-index = {char} className = "active_character" style = {{backgroundColor:settings.activeHighlight,color:settings.characterColor}}>{data.charAt(char)}</span>);
        }
        else{
          rowChildren.push(<span key = {char} id = {char} string-index = {char} className = {(data.charAt(char) === ' ')?"blank_character":"normal_character"} style = {{color:settings.characterColor,backgroundColor:((data.charAt(char) === ' ')?settings.blankBackground:settings.characterBackground)}} onMouse = {handleClick}>{data.charAt(char)}</span>);
        }
        char++;
      }
      children.push(rowChildren);
      children.push(<br key = {"row"+row}></br>);
    }
    return children;
  }

  //add keypress event handlers, but only once
  useEffect(() => {
    window.document.addEventListener('keyup', handleKeyPress);

    return () => {
      window.document.removeEventListener('keyup', handleKeyPress);
    }
  }, []);

  //holds the processed jsx children
  const [divContents,setDivContents] = useState(processStringIntoDom(canvasData,activeCharacter,settings));
  const [activeCharIndex,setActiveCharIndex] = useState(0);
  return (
    <>
    <div className = "ascii_button" onClick = {(e) => {navigator.clipboard.writeText(canvasData);}}>copy</div>
    <div className = "ascii_button" onClick = {(e) => {canvasData=``;
    for(let i = 0; i<settings.rows*settings.columns; i++){
      canvasData+=' ';
    }setDivContents(processStringIntoDom(canvasData,activeCharacter,settings));}}>clear</div>
    <div className = "ascii_canvas">
      {divContents}
    </div>
    </>
  )
}

export default App
