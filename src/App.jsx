import { useState , useEffect , useRef , Children} from 'react'
import React from 'react'
import ColorPicker from './components/colorpicker';
import Slider from './components/slider';
import './main.css';
import Dropdown from './components/dropdown';
import NumberInput from './components/NumberInput.jsx';
import AsciiPaletteInput from './components/asciipaletteinput';
import { ascii_rose,ascii_title,aboutText } from './about';
import { DropZone } from './components/DropZone';
import { presets } from './presets';
import AsciiButton from './components/AsciiButton.jsx'
function App() {
  const asciiPalettePresets = {
    symbols:`$@%&#*0/\\|()1{}[]?-_+~<>#!l;:,"^\`\'. `,
    full:`$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^\`\'. `,
    letters:`BWMoahkbdpqwmZOQLCJUYXzcvunxrjftilI `
  };

  //holds the processed jsx children
  const [asciiCanvas,setAsciiCanvas] = useState({
    width:presets[0].width,
    height:presets[0].height,
    data:presets[0].data
  });
  const asciiCanvasRef = useRef(asciiCanvas);
  useEffect(() => {
    asciiCanvasRef.current = asciiCanvas;
  },[asciiCanvas]);

  const [bufferCanvas,setBufferCanvas] = useState({...asciiCanvas});
  const [currentChar,setCurrentChar] = useState('a');
  const [activeCharIndex,setActiveCharIndex] = useState(0);
  const [canvasDimensionSliders,setCanvasDimensionSliders] = useState(
    {
      width:presets[0].width,height:presets[0].height
    }
  );
  const [asciiPalettePreset,setAsciiPalettePreset] = useState('full');
  const [asciiPalette,setAsciiPalette] = useState(asciiPalettePresets['full']);
  const asciiPaletteRef = useRef(asciiPalette);

  useEffect(()=>{
    asciiPaletteRef.current = asciiPalette;
  },[asciiPalette]);

  const fontOptions = [
    {
      title:'Any monospace font',
      cssName:'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    {
      title:'Syne Mono',
      cssName:'Syne Mono'
    },
    {
      title:'Bytesized',
      cssName:'Bytesized'
    },
    {
      title:'Workbench',
      cssName:'Workbench'
    }
  ];

  const [settings,setSettings] = useState({
    backgroundColor:'#ffffffff',
    textColor:'#0000ffff',
    fontSize:12,
    textSpacing:0,
    lineHeight:1.15,
    textSelectable:false,
    drawingMode:'brush',
    showAbout:false,
    blendTransparentAreas:true,
    advanceWhenCharacterEntered:true,
    useDynamicBrush:false,
    font:fontOptions[0].cssName
  });
  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  },[settings]);

  const [mouseCoords,setMouseCoords] = useState(null);

  const [selectionBox,setSelectionBox] = useState({
    started : false,
    finished : false,
    startCoord : {x:0,y:0},
    endCoord : {x:0,y:0},
    movingText : false,
    moveBy : {x:0,y:0}
  });
  const [clipboardDimensions,setClipboardDimensions] = useState(undefined);
  const [clipboardText,setClipboardText] = useState('');
  const [lineData,setLineData] = useState({
    begun : false,
    moved : false,
    startIndex : 0,
    endIndex : 0,
    char : currentChar,
    fillByDirection : false,
  });

  const [imageRenderer,setImageRenderer] = useState(
    {
      imageLoaded:false,
      gamma:1.0,
      contrast:1.0,
      imageSrc:'test2.png',
      needToReload:false
    }
  );

  const [brushData,setBrushData] = useState(
    {
      drawing:false,
      brushSize:0,
      brush:'*-*|a|*-*',
      lastCoordinate:undefined
    }
  );

  const activeCharIndexRef = useRef(activeCharIndex);
  const lineDataRef = useRef(lineData);
  const bufferCanvasRef = useRef(bufferCanvas);
  const selectionBoxRef = useRef(selectionBox);
  const currentCharRef = useRef(currentChar);
  const imageRendererRef = useRef(imageRenderer);
  const clipboardTextRef = useRef(clipboardText);
  const clipboardDimensionsRef = useRef(clipboardDimensions);
  const canvasDimensionSlidersRef = useRef(canvasDimensionSliders);
  //making sure the callback can access "fresh" versions of state data
  useEffect(() => {
    canvasDimensionSlidersRef.current = canvasDimensionSliders;
  },[canvasDimensionSliders]);
  useEffect(() => {
    activeCharIndexRef.current = activeCharIndex;
  }, [activeCharIndex]);
  useEffect(()=>{
    clipboardDimensionsRef.current = clipboardDimensions;
  },[clipboardDimensions]);
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
    currentCharRef.current = currentChar;
  },[currentChar]);
  useEffect(() => {
    imageRendererRef.current = {...imageRenderer};
    if(imageRenderer.imageLoaded){
      convertImageToAscii(imageRenderer.imageSrc);
    }
  },[imageRenderer]);
  useEffect(() => {
    clipboardTextRef.current = clipboardText;
  },[clipboardText]);
  //add keypress event handlers, but only once
  useEffect(() => {
    window.document.addEventListener('keydown', handleKeyPress);
    return () => {
      window.document.removeEventListener('keydown', handleKeyPress);
    }
  }, []);

  const undoBuffer = useRef([]);
  const redoBuffer = useRef([]);
  
  function pushUndoState(){
    //if the buffer gets long enough, start removing early entries
    if(undoBuffer.current.length > 200){
      undoBuffer.current.shift();
    }
    undoBuffer.current.push({
      canvasData:asciiCanvasRef.current.data,
      canvasWidth:asciiCanvasRef.current.width,
      canvasHeight:asciiCanvasRef.current.height,
      currentChar:currentCharRef.current,
      activeCharIndex:activeCharIndexRef.current
    });
    //adding to the undo buffer resets the redo buffer
    redoBuffer.current = [];
  }
  
  function undo(){
    if(undoBuffer.current.length === 0)
      return;
    const previousState = undoBuffer.current.pop();
    redoBuffer.current.push({
      canvasData:asciiCanvasRef.current.data,
      canvasWidth:asciiCanvasRef.current.width,
      canvasHeight:asciiCanvasRef.current.height,
      currentChar:currentCharRef.current,
      activeCharIndex:activeCharIndexRef.current
    });
    restoreState(previousState);
  }
  
  function redo(){
    if(redoBuffer.current.length === 0)
      return;
    const nextState = redoBuffer.current.pop();
    undoBuffer.current.push({
      canvasData:asciiCanvasRef.current.data,
      canvasWidth:asciiCanvasRef.current.width,
      canvasHeight:asciiCanvasRef.current.height,
      currentChar:currentCharRef.current,
      activeCharIndex:activeCharIndexRef.current
    });
    restoreState(nextState);
  }

  function restoreState(state){
    setAsciiCanvas({data:state.canvasData,width:state.canvasWidth,height:state.canvasHeight});
    setActiveCharIndex(state.activeCharIndex);
    setCurrentChar(state.currentChar);
  }

  function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }
  function contrastImage(imgData, contrast){  //input range [-1,1]
      let d = imgData.data;
      let intercept = 128 * (1 - contrast);
      for(var i=0;i<d.length;i+=4){   //r,g,b,a
          d[i] = d[i]*contrast + intercept;
          d[i+1] = d[i+1]*contrast + intercept;
          d[i+2] = d[i+2]*contrast + intercept;
      }
      return imgData;
  }

  function copyText(canvas,options){
    //if there's a selection box, copy from that instead
    const selBox = selectionBoxRef.current;
    if(selBox.finished){
      const topL = {x:Math.min(selBox.startCoord.x,selBox.endCoord.x),y:Math.min(selBox.startCoord.y,selBox.endCoord.y)};
      const bottomR = {x:Math.max(selBox.startCoord.x,selBox.endCoord.x),y:Math.max(selBox.startCoord.y,selBox.endCoord.y)};
      canvas = copyArea(selBox.startCoord,selBox.endCoord,canvas);
      canvas.width = bottomR.x-topL.x;
      canvas.height = bottomR.y-topL.y;
    }
    let processedText = canvas.data;
    setClipboardText(processedText);
    if(options.linebreaks)
      processedText = addLineBreaksToText({data:processedText,width:canvas.width,height:canvas.height});
    if(options.escaped)
      processedText = escapeTextData(processedText);
    setClipboardDimensions(canvas);
    navigator.clipboard.writeText(processedText);
  }

  function cutText(data,dimensions){
    const selection = selectionBoxRef.current;
    let startCoord = {x:0,y:0};
    let endCoord = {x:0,y:0};
    if(selection.finished){
      const topL = {x:Math.min(selection.startCoord.x,selection.endCoord.x),y:Math.min(selection.startCoord.y,selection.endCoord.y)};
      const bottomR = {x:Math.max(selection.startCoord.x,selection.endCoord.x),y:Math.max(selection.startCoord.y,selection.endCoord.y)};
      startCoord = topL;
      endCoord = bottomR;
    }
    else{
      return;
    }
    const cutResult = cutAreaAndFill(startCoord,endCoord,data,dimensions.width,' ',false);
    const text = cutResult.data;
    let cut = cutResult.cutData.data;
    setClipboardText(cut);
    setAsciiCanvas({...asciiCanvasRef.current,data:text});
    setClipboardDimensions({width:cutResult.cutData.width,height:cutResult.cutData.height});
    navigator.clipboard.writeText(cut);
  }

  function escapeTextData(data){
    //u need to handle: ` ' " and \
    //first, \
    data = data.replace(/\\/g, '\\\\');
    //then, `
    data = data.replace(/\`/g, '\\\`');
    //then, '
    data = data.replace(/\'/g, '\\\'');
    //then, "
    data = data.replace(/\"/g, '\\\"');
    return data;
  }

  function convertImage(img){
    
    const outputDimensions = {width:asciiCanvas.width,height:asciiCanvas.height};

    const palette = asciiPalette;
    if(palette.length === 0){
      let warningString = '[no character palette to raster with!]';
      warningString = warningString.padEnd(outputDimensions.width*outputDimensions.height,' ');
      setAsciiCanvas({...asciiCanvasRef.current,data:warningString});
      return;
    }
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    let newStr = '';
    //load image onto canvas
    canvas.width = outputDimensions.width;
    canvas.height = outputDimensions.height;
    ctx.drawImage(img,0,0,canvas.width,canvas.height);

    //get pixel data from canvas
    let pixelData = ctx.getImageData(0,0,canvas.width,canvas.height,{pixelFormat:"rgba-unorm8"});

    for(let px = 0; px<pixelData.data.length; px+=4){
      
      const redChannel = pixelData.data[px];
      const greenChannel = pixelData.data[px+1];
      const blueChannel = pixelData.data[px+2];
      const alphaChannel = pixelData.data[px+3];

      const avg = (redChannel + greenChannel + blueChannel) / 3 * (alphaChannel/255) + (1.0 - alphaChannel/255)*255;

      // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
      let grayscaleValue = (0.299*redChannel + 0.587*greenChannel + 0.114*blueChannel) * (alphaChannel/255) + (1.0 - alphaChannel/255)*255;
      // const grayscaleValue = avg;

      //gamma
      grayscaleValue = Math.pow(grayscaleValue/255,imageRenderer.gamma)*255;
      //contrast
      const intercept = 128 * (1 - imageRenderer.contrast);
      grayscaleValue = Math.max(Math.min((grayscaleValue*imageRenderer.contrast) + intercept,255),0);
      const paletteIndex = map_range(grayscaleValue,0,255,0,palette.length-1);

      newStr+= palette.charAt(paletteIndex);
    }
    setAsciiCanvas({...asciiCanvasRef.current,data:newStr});
  };

  function convertImageToAscii(src){
    if(typeof src === "string"){
      const img = new Image;
      img.onload = function() {
        pushUndoState();
        convertImage(this);
      };
      img.src = src;
    }

  }

  function createBackground(dims){
    let side = '';
    side = side.padStart(dims.width,' ');
    side = '|'+side+'|';
    let str = '';
    for(let i = 0; i<dims.height; i++){
      str += side;
    }
    let top = '';
    top = top.padStart(dims.width,'-');
    top = '*'+top+'*';
    return top+str+top;
  }

  function resizeCanvas(canvas,newDims){
    pushUndoState();
    const originalDims = {width:canvas.width,height:canvas.height};
    let newString = '';
    for(let r = 0; r<Math.min(originalDims.height,newDims.height); r++){
      //get the original row
      let rowString = canvas.data.substring(r*originalDims.width,(r+1)*originalDims.width);
      if(newDims.width<originalDims.width)
        rowString = rowString.substring(0,newDims.width);
      else
        rowString = rowString.padEnd(newDims.width,' ');
      newString += rowString;
    }
    newString = newString.padEnd(newDims.width*newDims.height,' ');
    return newString;
  }
  function startLine(index){
    const line = {
      ...lineDataRef.current,
      begun : true,
      moved : false,
      startIndex : index,
      endIndex : null,
      char : currentChar
    }
    setLineData(line);
    //store a copy of div contents in buffer canvas, so you can draw arbitrary lines on top of canvas w/o loosing anything
    setBufferCanvas({...asciiCanvasRef.current});
  }
  function endLine(endIndex){
    const start = {x:lineData.startIndex%asciiCanvas.width,y:Math.trunc(lineData.startIndex/asciiCanvas.width)};
    const end = {x:endIndex%asciiCanvas.width,y:Math.trunc(endIndex/asciiCanvas.width)};
    const char = lineDataRef.current.fillByDirection?getLineDirectionalChar(start,end):currentChar;
    const line = {
      ...lineDataRef.current,
      begun : false,
      moved : false,
      endIndex : endIndex,
      char : char
    };
    let temp = drawLine(start,end,char,{...bufferCanvasRef.current});
    setLineData(line);
    setAsciiCanvas({...asciiCanvasRef.current,data:temp});
    setBufferCanvas({...asciiCanvasRef.current,data:temp});
  }

  function getClickIndex(e){
    const coords = getTruncatedClickCoords(e);
    return coords.x+asciiCanvas.width*coords.y;
  }
  function getClickCoords(e){
    const dims = e.target.getBoundingClientRect();
    const clickCoords = {
      x:e.clientX - dims.left,
      y:e.clientY - dims.top
    };
    //px per char
    const characterDims = {
      width : dims.width / asciiCanvasRef.current.width,
      height : dims.height / asciiCanvasRef.current.height,
    };

    return {x: clickCoords.x/characterDims.width,y:clickCoords.y/characterDims.height};
  }
  function getTruncatedClickCoords(e){
    const coords = getClickCoords(e);
    return {x:Math.max(Math.floor(coords.x),0),y:Math.max(Math.floor(coords.y),0)};
  }
  function getRoundedClickCoords(e){
    const coords = getClickCoords(e);
    return {x:Math.min(Math.round(coords.x),asciiCanvasRef.current.width),y:Math.min(Math.round(coords.y),asciiCanvasRef.current.height)};
  }

  function handleMouseLeave(e){
    setMouseCoords(null);
  }

  function handleMouseUp(e){

    //set the cursor on the index where the mouse was released
    setActiveCharIndex(getClickIndex(e));

    switch(settings.drawingMode){
      case 'line':
        const newIndex = getClickIndex(e);
        //if you already started a line
        if(lineData.begun){
          if(lineData.moved){
            endLine(newIndex);
          }
          else{
            const line = {
              ...lineDataRef.current,
              begun : false,
              moved : false,
              startIndex : lineData.startIndex,
              endIndex : null,
              char : currentChar
            };
            setLineData(line);
          }
        }
        break;
      case 'stamp':
      case 'brush':
        setBrushData({...brushData,
          drawing:false,
          lastCoordinate:undefined
        });
        break;
    }
    //changing the selectionbox
    if(selectionBox.started){
      const newBox = {
        started : false,
        finished : true,
        startCoord : selectionBox.startCoord,
        endCoord : getRoundedClickCoords(e),
        movingText : false,
        moveBy : {x:0,y:0}
      };
      setSelectionBox(newBox);
    }
    //if you're done selecting, apply the transformation u set
    else if(selectionBox.finished){
      const newBox = {...selectionBox,
        started : false,
        finished : true,
        movingText : false,
        moveBy:{x:0,y:0},
        startCoord : {x:selectionBox.startCoord.x+selectionBox.moveBy.x,y:selectionBox.startCoord.y+selectionBox.moveBy.y},
        endCoord : {x:selectionBox.endCoord.x+selectionBox.moveBy.x,y:selectionBox.endCoord.y+selectionBox.moveBy.y}
      };
      setSelectionBox(newBox);
    }
  }

  function handleMouseDown(e){
    setActiveCharIndex(getClickIndex(e));
    //moving selectionbox
    if(selectionBox.finished){
      const coords = getRoundedClickCoords(e);
      const topL = {x:Math.min(selectionBox.startCoord.x,selectionBox.endCoord.x)+selectionBox.moveBy.x,y:Math.min(selectionBox.startCoord.y,selectionBox.endCoord.y)+selectionBox.moveBy.y};
      const bottomR = {x:Math.max(selectionBox.startCoord.x,selectionBox.endCoord.x)+selectionBox.moveBy.x,y:Math.max(selectionBox.startCoord.y,selectionBox.endCoord.y)+selectionBox.moveBy.y};
      if(coords.x < bottomR.x && coords.x > topL.x && coords.y < bottomR.y && coords.y > topL.y){
        const newBox = {
          started : false,
          finished : true,
          startCoord : selectionBox.startCoord,
          endCoord : selectionBox.endCoord,
          movingText : true,
          moveBy : selectionBox.moveBy
        };
        setSelectionBox(newBox);
        //store this version of div contents
        if(selectionBox.moveBy.x || selectionBox.moveBy.y){

        }
        else{
          setBufferCanvas({...asciiCanvasRef.current});
          pushUndoState();
        }
        return;
      }
    }
    //starting selectionbox
    if(e.shiftKey && !settingsRef.current.textSelectable){
      const newBox = {
        started : true,
        finished : false,
        startCoord : getRoundedClickCoords(e),
        endCoord : getRoundedClickCoords(e),
        movingText : false,
        moveBy : {x:0,y:0}
      };
      setSelectionBox(newBox);
      //store this version of div contents
      setBufferCanvas({...asciiCanvasRef.current});
    }
    else{
      const newIndex = getClickIndex(e);
      const coords = getTruncatedClickCoords(e);
      pushUndoState();
      switch(settings.drawingMode){
        case 'line':
          //start drawing a line
          startLine(newIndex);
          break;
        case 'brush':
          // don't draw a character yet, until the mouse is moved
          setBrushData({
            drawing:true,
            brushSize: brushData.brushSize,
            brush: brushData.brush,
            lastCoordinate:coords
          });
          break;
        case 'stamp':
          setBrushData({
            drawing:true,
            brushSize: brushData.brushSize,
            brush: brushData.brush,
            lastCoordinate:coords
          });
          const location = {x:Math.round(coords.x-clipboardDimensionsRef.current.width/2),y:Math.round(coords.y-clipboardDimensionsRef.current.height/2)};
          pasteClipboardContents(location);
          break;
        case 'fill':
          setAsciiCanvas({...asciiCanvasRef.current,data:fill(coords.x,coords.y,currentCharRef.current,asciiCanvasRef.current)});
          break;
      }
      //cancel the selection box, if there was one
      const newBox = {
        started : false,
        finished : false,
        startCoord : getRoundedClickCoords(e),
        endCoord : getRoundedClickCoords(e),
        movingText : false,
        moveBy : {x:0,y:0}
      };
      setSelectionBox(newBox);
    }
  }
  function handleMouseMove(e){
    const newIndex = getClickIndex(e);
    const canvDims = asciiCanvasRef.current;
    const coords = getTruncatedClickCoords(e);
    setMouseCoords(coords);
    switch(settings.drawingMode){
      case 'stamp':
        if(brushData.drawing){
          const location = {x:Math.round(coords.x-clipboardDimensionsRef.current.width/2),y:Math.round(coords.y-clipboardDimensionsRef.current.height/2)};
          pasteClipboardContents(location);
        }
        break;
      case 'line':
        //changing line position
        if(lineDataRef.current.begun){
          //if the index didn't change, you haven't moved
          if(newIndex === lineDataRef.current.startIndex){
            return;
          }
          const start = {x:lineDataRef.current.startIndex%asciiCanvas.width,y:Math.trunc(lineDataRef.current.startIndex/asciiCanvas.width)};          
          const line = {
            ...lineDataRef.current,
            begun : true,
            moved : true,
            endIndex : newIndex,
            char : currentChar
          };
          setLineData(line);
          setAsciiCanvas({...asciiCanvasRef.current,data:drawLine(start,coords,lineDataRef.current.fillByDirection?getLineDirectionalChar(start,coords):currentChar,{...bufferCanvasRef.current})});
        }
        break;
      case 'brush':
        if(brushData.drawing){
          let brushSize = brushData.brushSize;
          if(brushData.lastCoordinate !== undefined && settingsRef.current.useDynamicBrush){
            const distX = brushData.lastCoordinate.x - coords.x;
            const distY = brushData.lastCoordinate.y - coords.y;
            //usually, dist is between 1 and 2
            const distance = Math.sqrt((distX*distX)+(distY*distY));
            //map distance to a thickness (from 0, brushSize)
            brushSize = Math.max(Math.trunc(map_range(distance,0,20,brushSize,0)),0);
          }
          //if there's no other coordinate, just fill circles
          if(brushData.lastCoordinate === undefined){
            setAsciiCanvas({...asciiCanvasRef.current,data:fillCircle(coords.x,coords.y,brushSize,currentChar,asciiCanvasRef.current)});
          }
          else{
            setAsciiCanvas({...asciiCanvasRef.current,data:drawCirclesAlongPath({x:brushData.lastCoordinate.x,y:brushData.lastCoordinate.y},{x:coords.x,y:coords.y},brushSize,currentChar,asciiCanvas)});
          }
          setBrushData({
            drawing:true,
            brushSize:brushData.brushSize,
            brush:brushData.brush,
            lastCoordinate:coords
          });
        }
        break;
      case 'fill':
        if(e.buttons)
          setAsciiCanvas({...asciiCanvasRef.current,data:fill(coords.x,coords.y,currentCharRef.current,asciiCanvasRef.current)});
        break;
    }
    //changing selbox
    if(selectionBox.started){
      let newBox;
      //extend selbox
      if(e.shiftKey){
        newBox = {
          started : true,
          finished : false,
          startCoord : selectionBox.startCoord,
          endCoord : getRoundedClickCoords(e),
          movingText : false,
          moveBy : {x:selectionBox.moveBy.x,y:selectionBox.moveBy.y}
        };
      }
      //cancel it
      else{
        newBox = {
          started : false,
          finished : false,
          startCoord : selectionBox.startCoord,
          endCoord : getRoundedClickCoords(e),
          movingText : false,
          moveBy : {x:selectionBox.moveBy.x,y:selectionBox.moveBy.y}
        };
      }
      setSelectionBox(newBox);
    }
    //moving/shifting area
    else if(selectionBox.movingText){
      const coords = getTruncatedClickCoords(e);
      const selBoxDims = {width:Math.abs(selectionBox.endCoord.x-selectionBox.startCoord.x),height:Math.abs(selectionBox.endCoord.y-selectionBox.startCoord.y)};
      
      //no fractional coordinates! adjust coords so the selbox is moved relative to where the mouse was pressed
      const topL = {x:Math.min(selectionBox.startCoord.x,selectionBox.endCoord.x),y:Math.min(selectionBox.startCoord.y,selectionBox.endCoord.y)};
      // const bottomR = {x:Math.max(selectionBox.startCoord.x,selectionBox.endCoord.x),y:Math.max(selectionBox.startCoord.y,selectionBox.endCoord.y)};
      const moveBy = {
        x: Math.trunc(coords.x - topL.x - selBoxDims.width/2),
        y: Math.trunc(coords.y - topL.y - selBoxDims.height/2)
      }
      const newBox = {
          started : false,
          finished : true,
          startCoord : selectionBox.startCoord,
          endCoord : selectionBox.endCoord,
          movingText : true,
          moveBy : moveBy
      };
      setSelectionBox(newBox);
      setAsciiCanvas({...asciiCanvasRef.current,data:shiftArea(newBox,newBox.moveBy,bufferCanvasRef.current.data,asciiCanvasRef.current.width,true)});
    }
  }

  function writeCharacter(index,char,canvas){
    return canvas.data.substring(0,index)+char+canvas.data.substring(index+1);
  }

  function writeCharacterXY(x,y,char,canvas){
    //check bounds
    if((x < 0) || (x >= canvas.width) || (y < 0) || (y >= canvas.height))
      return canvas.data;
    return writeCharacter(x+y*canvas.width,char,canvas);
  }
  function drawCircle(x0, y0, r, c, data, dims) {
    let f = 1 - r;
    let ddF_x = 1;
    let ddF_y = -2 * r;
    let x = 0;
    let y = r;
    
    data = writeCharacterXY(x0, y0 + r, c, data, dims);
    data = writeCharacterXY(x0, y0 - r, c, data, dims);
    data = writeCharacterXY(x0 + r, y0, c, data, dims);
    data = writeCharacterXY(x0 - r, y0, c, data, dims);
    
    while (x < y) {
      if (f >= 0) {
        y--;
        ddF_y += 2;
        f += ddF_y;
      }
      x++;
      ddF_x += 2;
      f += ddF_x;
      
      data = writeCharacterXY(x0 + x, y0 + y, c, data, dims);
      data = writeCharacterXY(x0 - x, y0 + y, c, data, dims);
      data = writeCharacterXY(x0 + x, y0 - y, c, data, dims);
      data = writeCharacterXY(x0 - x, y0 - y, c, data, dims);
      data = writeCharacterXY(x0 + y, y0 + x, c, data, dims);
      data = writeCharacterXY(x0 - y, y0 + x, c, data, dims);
      data = writeCharacterXY(x0 + y, y0 - x, c, data, dims);
      data = writeCharacterXY(x0 - y, y0 - x, c, data, dims);
    }
    return data;
  }

  function fillCircleHelper(x0, y0, r, corners, delta, c, canvas) {
    let f = 1 - r;
    let ddF_x = 1;
    let ddF_y = -2 * r;
    let x = 0;
    let y = r;
    let px = x;
    let py = y;
    
    delta++; // Avoid some +1's in the loop
    
    while (x < y) {
      if (f >= 0) {
        y--;
        ddF_y += 2;
        f += ddF_y;
      }
      x++;
      ddF_x += 2;
      f += ddF_x;
      // These checks avoid double-drawing certain lines, important
      // for the SSD1306 library which has an INVERT drawing mode.
      if (x < (y + 1)) {
        if (corners & 1)
          canvas.data = drawFastVLine(x0 + x, y0 - y, 2 * y + delta, c, canvas);
        if (corners & 2)
          canvas.data = drawFastVLine(x0 - x, y0 - y, 2 * y + delta, c, canvas);
      }
      if (y != py) {
        if (corners & 1)
          canvas.data = drawFastVLine(x0 + py, y0 - px, 2 * px + delta, c, canvas);
        if (corners & 2)
          canvas.data = drawFastVLine(x0 - py, y0 - px, 2 * px + delta, c, canvas);
        py = y;
      }
      px = x;
    }
    return canvas.data;
  }

  function drawFastVLine(x,y,height,c,canvas){
    for(let i = 0; i<height; i++){
      canvas.data = writeCharacterXY(x,y+i,c,canvas);
    }
    return canvas.data;
  }

  function fillCircle(x0,y0,r,c,canvas){
    canvas.data = drawFastVLine(x0, y0 - r, 2 * r + 1, c, canvas);
    canvas.data = fillCircleHelper(x0, y0, r, 3, 0, c, canvas);
    return canvas.data;
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
        canvas.data = writeCharacter(x*canvas.width+y, char, canvas);
      } else {
        canvas.data = writeCharacter(y*canvas.width+x, char, canvas);
      }
      err -= dy;
      if (err < 0) {
        y += ystep;
        err += dx;
      }
    }
    return canvas.data;
  }

  function shiftCharacters(index,amount,data){
    let insertStr = '';
    const rowStartIndex = Math.trunc(index/asciiCanvasRef.current.width)*(asciiCanvasRef.current.width);
    const moveAmt = Math.min(amount<0?(asciiCanvasRef.current.width - index%asciiCanvasRef.current.width):(asciiCanvasRef.current.width - (index%asciiCanvasRef.current.width)),Math.abs(amount));
    for(let i = 0; i<moveAmt; i++){
      insertStr += ' ';
    }
    if(amount<0)
      setAsciiCanvas({...asciiCanvasRef.current,data:data.substring(0,index)+data.substring(index+moveAmt,rowStartIndex+asciiCanvasRef.current.width)+insertStr+data.substring(rowStartIndex+asciiCanvasRef.current.width)});
    else
      setAsciiCanvas({...asciiCanvasRef.current,data:data.substring(0,index)+insertStr+data.substring(index,rowStartIndex+asciiCanvasRef.current.width-moveAmt)+data.substring(rowStartIndex+asciiCanvasRef.current.width)});
  }

  function newLine(index,amount,data){
    const rowStartIndex = Math.trunc(index/asciiCanvasRef.current.width)*(asciiCanvasRef.current.width);
    let insertStr = '';
    for(let i = 0; i<asciiCanvasRef.current.width; i++){
      insertStr += ' ';
    }
    const moveAmt = Math.min(amount>0?asciiCanvasRef.current.height:(rowStartIndex/asciiCanvasRef.current.width),Math.abs(amount))
    if(amount>0){
      for(let i = 0; i<moveAmt; i++){
        setAsciiCanvas({...asciiCanvasRef.current,data:data.substring(0,rowStartIndex)+insertStr+data.substring(rowStartIndex,data.length-asciiCanvasRef.current.width*moveAmt)});
      }
    }
    else{
      for(let i = 0; i<moveAmt; i++){
        setAsciiCanvas({...asciiCanvasRef.current,data:data.substring(0,rowStartIndex)+data.substring(rowStartIndex+asciiCanvasRef.current.width*moveAmt)+insertStr});
      }
    }
  }

  function moveColumn(index,amount,data){
    const rowIndex = Math.trunc(index/asciiCanvas.width);
    const colIndex = index % asciiCanvas.width;
    if(amount>0){
      for(let i = (asciiCanvas.height); i>rowIndex; i--){
        data = writeCharacter(i*asciiCanvas.width+colIndex,data.charAt((i-1)*asciiCanvas.width+colIndex),data);
      }
      data = writeCharacter(rowIndex*asciiCanvas.width+colIndex,' ');
    }
    else{
      for(let i = rowIndex; i<(asciiCanvas.height-1); i++){
        data = writeCharacter(i*asciiCanvas.width+colIndex,data.charAt((i+1)*asciiCanvas.width+colIndex),data);
      }
    }
    setAsciiCanvas({...asciiCanvasRef.current,data:data});
  }
  //draws circles along a path!
  function drawCirclesAlongPath(A,B,radius,character,canvas){
    let start;
    let end;
    if(A.x<B.x){
      start = A;
      end = B;
    }
    else if(A.x > B.x){
      start = B;
      end = A;
    }
    //if A.x == B.x it's vertical
    else if(A.y < B.y){
      start = A;
      end = B;
    }
    else{
      start = B;
      end = A;
    }
    // radius = 0;
    //if radius is 0, just draw a line
    if(radius == 0){
      return drawLine({x:start.x,y:start.y},{x:end.x,y:end.y},character,canvas);
    }

    //if it's a vertical line, don't use the line slope
    if(start.x == end.x){
      for(let step = start.y; step<end.y; step+=(radius/2)){
        const x = start.x;
        const y = Math.trunc(step);
        canvas.data = fillCircle(x,y,radius,character,canvas);
      }
      return canvas.data;
    }
    //if it's a horizontal line
    else if(start.y == end.y){
      for(let step = start.x; step<end.x; step+=(radius/2)){
        const x = Math.trunc(step);
        const y = start.y;
        canvas.data = fillCircle(x,y,radius,character,canvas);
      }
      return canvas.data;
    }
    //if it's not a straight line, use y = mx+b
    else{
      //calculate (ROUGH!!) how many circles to draw in order to fill the path between the two points
      const distX = Math.abs(end.x - start.x);
      const distY = Math.abs(end.y - start.y);
      const stepCount = Math.round(Math.sqrt((distX*distX)+(distY*distY))/(radius/2));//u kno this won't be 0!

      //parametric eq calculating x,y at t*radius distance down the line
      for(let step = 0; step<stepCount; step++){
        const t = step/stepCount;
        const x = Math.trunc((1-t)*start.x + t*end.x);
        const y = Math.trunc((1-t)*start.y + t*end.y);
        canvas.data = fillCircle(x,y,radius,character,canvas);
      }
      return canvas.data;
    }
  }
  function fillArea(start,end,data,dims,char){
    let topL = {x:Math.min(start.x,end.x),y:Math.min(start.y,end.y)};
    let bottomR = {x:Math.max(start.x,end.x),y:Math.max(start.y,end.y)};
    let width = bottomR.x - topL.x;
    let fillString = '';
    fillString = fillString.padEnd(width,char);

    //for each row containing the cut, grab the part before, blank, and the part after
    for(let y = topL.y;y<bottomR.y;y++){
      const rowStart = dims.width*y;
      const cutStart = rowStart+topL.x;
      const cutEnd = cutStart+width;
      const rowEnd = rowStart+dims.width;
      data = data.substring(rowStart,cutStart)+fillString+data.substring(cutEnd,rowEnd);
    };
    return data;
  }

  function copyArea(startCoord,endCoord,canvas){
    let tempData = canvas.data;
    let topL = {x:Math.min(startCoord.x,endCoord.x),y:Math.min(startCoord.y,endCoord.y)};
    let bottomR = {x:Math.max(startCoord.x,endCoord.x),y:Math.max(startCoord.y,endCoord.y)};
    let width = bottomR.x - topL.x;

    let copyStr = '';

    //for each row containing the cut, grab the part before, blank, and the part after
    for(let y = topL.y;y<bottomR.y;y++){
      const rowStart = canvas.width*y;
      const cutStart = rowStart+topL.x;
      const cutEnd = cutStart+width;
      const rowEnd = rowStart+canvas.width;
      copyStr += tempData.substring(cutStart,cutEnd);
    };
    //grab the rest of it
    return {data:copyStr,width : width, height: bottomR.y - topL.y};
  }

  function cutAreaAndFill(startCoord,endCoord,data,dataWidth,fillCharacter,preserveOriginalArea){
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
      if(preserveOriginalArea){
        newStr += tempData.substring(rowStart,rowEnd);
      }
      else{
        newStr += tempData.substring(rowStart,cutStart)+blankStr+tempData.substring(cutEnd,rowEnd);
      }
      cutStr += tempData.substring(cutStart,cutEnd);
    };
    //grab the rest of it
    newStr += tempData.substring((bottomR.y) * dataWidth);
    return {data:newStr,cutData:{data:cutStr,width : width, height: bottomR.y - topL.y}};
  }

  function shiftArea(coords,direction,data,dataWidth,preserveOriginalArea){
    let topL = {x:Math.min(coords.startCoord.x,coords.endCoord.x),y:Math.min(coords.startCoord.y,coords.endCoord.y)};
    let bottomR = {x:Math.max(coords.startCoord.x,coords.endCoord.x),y:Math.max(coords.startCoord.y,coords.endCoord.y)};

    //checking bounds and clamping them to the canvas
    if(topL.x + direction.x < 0){
      direction.x = -topL.x;
    }
    else if(bottomR.x + direction.x > dataWidth){
      direction.x = dataWidth-bottomR.x;
    }
    if(topL.y + direction.y < 0){
      direction.y = -topL.y;
    }
    else if(bottomR.y + direction.y > data.length/dataWidth){
      direction.y = data.length/dataWidth-bottomR.y;
    }

    let newData = cutAreaAndFill(coords.startCoord,coords.endCoord,data,dataWidth,' ');
    newData.data = pasteText(newData.cutData.data,{width:newData.cutData.width,height:newData.cutData.height},{x:Math.min(coords.startCoord.x,coords.endCoord.x)+direction.x,y:Math.min(coords.startCoord.y,coords.endCoord.y)+direction.y},{data:newData.data,width:dataWidth,height:newData.data.length/dataWidth});
    return newData.data;
  }

  //this is glitching because it's always using the original selection box coords
  function checkMove(selection,direction,dimensions){
    let topL = {x:Math.min(selection.startCoord.x,selection.endCoord.x),y:Math.min(selection.startCoord.y,selection.endCoord.y)};
    let bottomR = {x:Math.max(selection.startCoord.x,selection.endCoord.x),y:Math.max(selection.startCoord.y,selection.endCoord.y)};
    if(((topL.x + direction.x + selection.moveBy.x) < 0) ||
       ((bottomR.x + direction.x + selection.moveBy.x) > dimensions.width) ||
       ((topL.y + direction.y + selection.moveBy.y) < 0) ||
       ((bottomR.y + direction.y + selection.moveBy.y) > dimensions.height)
    ){
      return false;
    }
    else{
      return true;
    }
  }

  function move(selection,direction,bufCanvas,canvDims){
    if((selection.started || selection.finished) && checkMove(selection,direction,canvDims)){
      const newCanv = shiftArea(selection,{x:selection.moveBy.x+direction.x,y:selection.moveBy.y+direction.y},bufCanvas,canvDims.width,true);
      setAsciiCanvas({...asciiCanvasRef.current,data:newCanv});
      setSelectionBox(
        {...selection,
          // startCoord:{x:selection.startCoord.x,y:selection.startCoord.y},
          // endCoord:{x:selection.endCoord.x,y:selection.endCoord.y},
          // started : selection.started,
          // finished : selection.finished,
          // movingText : selection.movingText,
          moveBy : {x:selection.moveBy.x+direction.x,y:selection.moveBy.y+direction.y}
        }
      );
      return true;
    }
    return false;
  }

  function clearCanvas(){
    let canvasData=``;
    canvasData = canvasData.padStart(asciiCanvasRef.current.height*asciiCanvasRef.current.width,' ');
    setAsciiCanvas({...asciiCanvasRef.current,data:canvasData});
  }


  function getCharFromString(x,y,str,dims){
    return str.charAt(x+y*dims.width);
  }

  function fill(x,y,fillColor,canv){

    let newData = canv.data;

    //seed-checking fn that checks bounds and color to see if a pixel should be a new seed
    const isValid = (xi,yi,color) => {
        return ((xi >= 0) && (xi < canv.width) && (yi >= 0) && (yi < canv.height) && (getCharFromString(xi,yi,newData,canv) === color));
    }

    const scan = (lx, rx, y, stack, colorToBeFilled) => {
        for (let i = lx; i <= rx; i++) {
            if (isValid(i, y, colorToBeFilled)) {
            stack.push({x: i, y: y, color: colorToBeFilled});
            }
        }
        return stack;
    }

    const colorToBeFilled = getCharFromString(x,y,newData,canv);

    if(!isValid(x,y,getCharFromString(x,y,newData,canv))){
      return newData;
    }

    if (colorToBeFilled === fillColor) return newData;

    let stack = [{x:x,y:y,color:colorToBeFilled}];

    while (stack.length > 0) {
        let seed = stack.pop();

        //left fill
        let lx = seed.x;
        while (isValid(lx, seed.y, seed.color)) {
            newData = writeCharacterXY(lx,seed.y,fillColor,{...canv,data:newData});
            lx = lx -1;
        }

        //right fill
        let rx = seed.x + 1;
        while (isValid(rx, seed.y, seed.color)) {
            newData = writeCharacterXY(rx,seed.y,fillColor,{...canv,data:newData});
            rx = rx + 1;
        }

        //scan up/down
        stack = scan(lx+1, rx-1, seed.y + 1, stack, seed.color);
        stack = scan(lx+1, rx-1, seed.y - 1, stack, seed.color)
    }
    return newData;
}

  function handleKeyPress(e){

    if(settingsRef.textSelectable)
      return;

    //stop the event from bubbling, so this is only called once
    e.stopPropagation();

    /*
    This vv is for only triggering when the document is focused, so typing
    in the input boxes/outside the page doesn't trigger text entry.
    Enter key still works tho, so you can enter new canv dims
    */
    if((e.target === document.body) || (e.key === 'Enter')){
    }
    //u were focused elsewhere
    else{
      return;
    }

    //get fresh copies of the state data when this callback is fired
    const index = activeCharIndexRef.current;
    const activeChar = currentCharRef.current;
    let textData = asciiCanvasRef.current.data;
    const line = lineDataRef.current;
    const bufCanvas = bufferCanvasRef.current;
    const selection = selectionBoxRef.current;
    const canvDims = asciiCanvasRef.current;
    const canvDimSliders = canvasDimensionSlidersRef.current;
    const advanceOnPress = settingsRef.current.advanceWhenCharacterEntered;

    //janky way to see if it's a letter
    if(e.key.length === 1){
      if(e.metaKey){
        switch(e.key){
          case 'x':
            pushUndoState();
            cutText(textData,canvDims);
            return;
          case 'z':
            if(e.shiftKey)
              redo();
            else
              undo();
            e.preventDefault();
            return;
          case 'c':
            //copy text to clipboard
            copyText(asciiCanvasRef.current,{escaped:false,linebreaks:true});
            return;
          case 'v':
            pushUndoState();
            pasteClipboardContents();
            return;
          //clear all with ctr+slash, ctrl+backspace is handled in backspace handler
          case '/':
          case '\\':
            pushUndoState();
            clearCanvas();
            return;
          case 'a':
            if(e.shiftKey){
              e.preventDefault();
              setSelectionBox({
                started : false,
                finished : false,
                startCoord : {x:0,y:0},
                endCoord : {x:0,y:0},
                movingText : false,
                moveBy : {x:0,y:0}
              });
            }
            else{
              setSelectionBox({
                started : false,
                finished : true,
                startCoord : {x:0,y:0},
                endCoord : {x:canvDims.width,y:canvDims.height},
                movingText : false,
                moveBy : {x:0,y:0}
              });
            }
            return;
        }
      }
      
      if(e.key == ' '){
        e.preventDefault();
      }
      switch(settingsRef.current.drawingMode){
        case 'brush':
          pushUndoState();
          //write the character
          setAsciiCanvas({...asciiCanvasRef.current,data:writeCharacter(index,e.key,asciiCanvasRef.current)});
          if(settingsRef.current.advanceWhenCharacterEntered && index < (canvDims.width*canvDims.height-1)){
            setActiveCharIndex(index+1);
          }
          break;
        case 'line':
          //if you're not drawing a line, handle it normally
          // if(!line.begun){
          //   pushUndoState();
          //   //write the character
          //   setAsciiCanvas({...asciiCanvasRef.current,data:writeCharacter(index,e.key,asciiCanvasRef.current)});
          //   if(settingsRef.current.advanceWhenCharacterEntered && index < (canvDims.width*canvDims.height-1)){
          //     setActiveCharIndex(index+1);
          //   }
          // }
          //if you are drawing a line, redraw it with the new character
          if(line.moved){
            const startCoords = {x:line.startIndex%canvDims.width,y:Math.trunc(line.startIndex/canvDims.width)};
            const endCoords = {x:line.endIndex%canvDims.width,y:Math.trunc(line.endIndex/canvDims.width)};
            const newL = {
              begun : true,
              moved : true,
              startIndex : line.startIndex,
              endIndex : line.endIndex,
              char : e.key
            };
            const tempCanvas  = drawLine(startCoords,endCoords,e.key,{...bufCanvas});
            setLineData(newL);
            setAsciiCanvas({...asciiCanvasRef.current,data:tempCanvas});
          }
          break;
      }
      //if selbox, fill the area
      if(selection.started || selection.finished){
        let newData = cutAreaAndFill({x:selection.startCoord.x+selection.moveBy.x,y:selection.startCoord.y+selection.moveBy.y},{x:selection.endCoord.x+selection.moveBy.x,y:selection.endCoord.y+selection.moveBy.y},textData,canvDims.width,e.key);
        setCurrentChar(e.key);
        setBufferCanvas({...asciiCanvasRef.current,data:newData.data})
        setAsciiCanvas({...asciiCanvasRef.current,data:newData.data});
        return;
      }
      
      setCurrentChar(e.key);
    }
    else if(e.key === 'Backspace'){
      pushUndoState();
      if(e.metaKey){
        setAsciiCanvas({...asciiCanvasRef.current,data:clearCanvas(asciiCanvasRef.current,selection)});
        return;
      }
      //if selbox, clear the area
      else if(selection.finished){
        let newData = cutAreaAndFill({x:selection.startCoord.x+selection.moveBy.x,y:selection.startCoord.y+selection.moveBy.y},{x:selection.endCoord.x+selection.moveBy.x,y:selection.endCoord.y+selection.moveBy.y},textData,canvDims.width,' ');
        setBufferCanvas({...asciiCanvasRef.current,data:newData.data})
        setAsciiCanvas({...asciiCanvasRef.current,data:newData.data});
        return;
      }

      //normal delete
      setAsciiCanvas({...asciiCanvasRef.current,data:writeCharacter(index,' ',{data:textData})});
      if(settingsRef.current.advanceWhenCharacterEntered && index > 0){
        setActiveCharIndex(index-1);
      }
    }
    else if(e.key === 'ArrowRight'){
      //move returns false if it doesn't work
      if(move(selection,{x:1,y:0},bufCanvas.data,canvDims)){
        return;
      }
      else if(e.shiftKey)
        shiftCharacters(index,1,textData);
      else if((index%canvDims.width)<(canvDims.width-1)){
        setActiveCharIndex(index+1);
      }
    }
    else if(e.key === 'ArrowLeft'){
      //move returns false if it doesn't work
      if(move(selection,{x:-1,y:0},bufCanvas.data,canvDims)){
        return;
      }
      else if(e.shiftKey)
        shiftCharacters(index,-1,textData);
      else if((index%canvDims.width)>0)
        setActiveCharIndex(index-1);

    }
    else if(e.key === 'ArrowUp'){
      //move returns false if it doesn't work
      if(move(selection,{x:0,y:-1},bufCanvas.data,canvDims)){
        return;
      }
      else if(e.shiftKey)
        moveColumn(index,-1,textData);
      else if(index/canvDims.width>=1){
        setActiveCharIndex(index-canvDims.width);
      }
    }
    else if(e.key === 'ArrowDown'){
      //move returns false if it doesn't work
      if(move(selection,{x:0,y:1},bufCanvas.data,canvDims)){
        return;
      }
      else if(e.shiftKey)
        moveColumn(index,1,textData);
      else if(index/canvDims.width<(canvDims.height-1)){
        setActiveCharIndex(index+canvDims.width);
      }
    }
    else if(e.key == 'Enter'){
      if((canvDimSliders.width != canvDims.width) || (canvDimSliders.height != canvDims.height)){
        setAsciiCanvas({...asciiCanvasRef.current,data:resizeCanvas(asciiCanvasRef.current,{width:canvDimSliders.width,height:canvDimSliders.height}),width:canvDimSliders.width,height:canvDimSliders.height});
      }
      else{
        if(e.shiftKey)
          newLine(index,1,textData);
        else
          setActiveCharIndex(index+canvDims.width - index%canvDims.width);
      }
    }
  }

  //adds in \n characters at the end of each line
  function addLineBreaksToText(canvas){
    let finalString = '';
    for(let row = 0; row<canvas.height; row++){
      finalString += canvas.data.substring(row*canvas.width,(row+1)*canvas.width)+'\n';
    }
    return finalString;
  }

  function reverseAsciiPalette(){
    const reversed = asciiPaletteRef.current.split('').toReversed().join('');
    setAsciiPalette(reversed);
    setImageRenderer({...imageRenderer,needToReload:true});
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
  const titleContainer = {
    zIndex : 2,
    display:'flex',
    width : 'fit-content',
    height : 'fit-content',
    top:'0px',
    left:'0px',
    position:'fixed',
    float:'right',
    gap:'10px',
    alignItems:'baseline',
    fontFamily: settings.font,
    fontSize:'12px'
  }
  
  const aboutTextStyle = {
    width : '605px',
    fontFamily: settings.font,
    fontSize:'14px',
    color:'#0000ffff',
    top:'0px',
    right:'20px',
    position:'fixed',
    overflowY:'scroll',
    height:'100vh',
    zIndex:'3',
  }

  const leftOffset = Math.min(selectionBox.startCoord.x,selectionBox.endCoord.x)+selectionBox.moveBy.x
  const boxWidth = Math.abs(selectionBox.startCoord.x - selectionBox.endCoord.x);
  const selectionBoxStyle = {
    width:`calc(${boxWidth}ch + ${boxWidth*settings.textSpacing}px)`,
    height:`${Math.abs(selectionBox.startCoord.y - selectionBox.endCoord.y)*settings.lineHeight}em`,
    left:`calc(${leftOffset}ch + ${leftOffset*settings.textSpacing}px)`,
    top:String((Math.min(selectionBox.startCoord.y,selectionBox.endCoord.y)+selectionBox.moveBy.y)*settings.lineHeight) + 'em',
    lineHeight:settings.lineHeight,
    fontSize:settings.fontSize+'px',
    borderColor:settings.textColor,
    zIndex:'0',
    position:'absolute',
    borderStyle:'dashed',
    borderWidth:'1px',
    fontFamily: settings.font,
    backgroundColor:'#ffff00'
  }

  const resizePreviewStyle = {
    width:String(canvasDimensionSliders.width)+'ch',
    height:String((canvasDimensionSliders.height)*settings.lineHeight)+'em',
    left:'0',
    top:'0',
    lineHeight:settings.lineHeight,
    letterSpacing:settings.textSpacing+'px',
    fontSize:settings.fontSize+'px',
    zIndex:0,
    position:'absolute',
    borderStyle:'dashed',
    borderWidth:'1px',
    pointerEvents:'none',
    fontFamily: settings.font,
  }

  const highlightBoxStyle = {
    visibility:settings.textSelectable?'hidden':'visible',
    width:'1ch',
    height: settings.lineHeight+'em',
    left: `calc(${activeCharIndex%asciiCanvas.width - 0.1}ch + ${settings.textSpacing*(activeCharIndex%asciiCanvas.width)}px)`,
    top: `${Math.trunc(activeCharIndex/asciiCanvas.width)*settings.lineHeight}em`,
    lineHeight:settings.lineHeight,
    fontSize:settings.fontSize+'px',
    position:'absolute',
    animation: 'blinkBackground 0.5s infinite'
  };

  const canvasContainerStyle = {
    position:'absolute',
    left:'20px',
    top:'20px',
    width:'fit-content',
    height:'fit-content',
    lineHeight:settings.lineHeight,
    letterSpacing:settings.textSpacing+'px',
    whiteSpace: 'pre',
    fontFamily: settings.font,
  }

  const pageContainerStyle = {
    position:'fixed',
    top:'100px',
    left:'350px',
    overflow:'scroll',
    width:'calc(100% - 350px)',
    height:'calc(100vh - 100px)',
  }

  const canvasStyle = {
    userSelect : settings.textSelectable?'text':'none',
    display:'block',
    position:'relative',
    cursor:settings.textSelectable?'text':(selectionBox.finished?'grab':'pointer'),
    fontSize:settings.fontSize+'px',
    color:settings.textColor,
    backgroundColor:'transparent',
    width:'fit-content',
    // width: asciiCanvas.width+'ch',
    lineHeight:settings.lineHeight,
    letterSpacing:settings.textSpacing+'px',
  }

  const brushPreviewStyle = {
    // width:(brushData.brushSize*2)+'ch',
    width:'fit-content',
    whiteSpace:'pre',
    // fontSize:settings.fontSize+'px',
    fontSize:'6px',
    color:settings.textColor,
    backgroundColor:settings.backgroundColor,
    lineHeight:settings.lineHeight,
    letterSpacing:settings.textSpacing+'px',
    // marginLeft:'20px',
    // direction: 'rtl'
  }

  const backgroundStyle = {
    color:'#000000',
    backgroundColor:settings.backgroundColor,
    top:'-'+String(settings.lineHeight)+'em',
    fontSize:settings.fontSize+'px',
    width:`calc(${asciiCanvas.width+2}ch + ${(asciiCanvas.width+1)*settings.textSpacing}px)`,
  };

  const loadImage = (files) => {
    if(files.length === 1)
      files = [files[0]];
    const file = files[0];
    //make sure there's a file here
    if(!(file === undefined)){
      //create a file reader object
      const reader = new FileReader();

      //attach a callback for when the FR is done opening the img
      reader.onload = (e) => {
        setImageRenderer({...imageRendererRef.current,
          imageLoaded:true,
          imageSrc:reader.result
        })
        // convertImageToAscii(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  function getBrushCanvas(size){
    if(size === 0){
      let canv = createBackground({width:1,height:1});
      canv = canv.substring(0,4)+currentChar+canv.substring(5);
      return canv;
    }
    else{
      const dims = {width:size*2+1,height:size*2+1};
      let canv = {data:createBackground(dims),width:size*2+3,height:size*2+3};
      canv = fillCircle(size+1,size+1,size,currentChar,canv);
      return canv;
    }
  }

  function getStampCanvas(){
    const maxWidth = 32;
    const maxHeight = 16;
    let canv = {height:clipboardDimensions.height+2,width:clipboardDimensions.width+2,data:createBackground({width:clipboardDimensions.width,height:clipboardDimensions.height})};
    canv.data = pasteText(clipboardText,clipboardDimensions,{x:1,y:1},canv);
    if(canv.width > maxWidth){
      const startOffset = Math.ceil(maxWidth/2);
      const endOffset = Math.floor(maxWidth/2);
      let newStr = '';
      for(let y = 0; y<canv.height; y++){
        newStr += canv.data.substring(y*canv.width,(y)*canv.width+startOffset-1);
        newStr += '.';
        newStr += canv.data.substring((y+1)*canv.width - endOffset,(y+1)*canv.width);
      }
      canv.width = maxWidth;
      canv.data = newStr;
    }
    if(canv.height > maxHeight){
      const startOffset = Math.ceil(maxHeight/2);
      const endOffset = Math.floor(maxHeight/2);
      let newStr = canv.data.substring(0,(startOffset-1) * canv.width);
      newStr += '.'.padEnd(canv.width,'.');
      newStr += canv.data.substring(canv.data.length-(endOffset * canv.width));
      canv.height = maxHeight;
      canv.data = newStr;
    }
    return addLineBreaksToText(canv);
  }


  function pasteText(clipText,clipTextDims,coords,canvas){
    //if the coords start off the page, crop the paste area so it just contains the part that fits
    if(coords.x < 0){
      const offset = Math.abs(coords.x);
      let newStr = '';
      for(let y = 0; y<clipTextDims.height; y++){
        newStr += clipText.substring(y*clipTextDims.width+offset,(y+1)*clipTextDims.width);
      }
      clipTextDims.width += coords.x;
      clipText = newStr;
      coords.x = 0;
    }
    if(coords.y < 0){
      let newStr = clipText.substring(-coords.y*clipTextDims.width);
      clipTextDims.height += coords.y;
      clipText = newStr;
      coords.y = 0;
    }
    let newData = '';
    //grab up until first row
    newData = canvas.data.substring(0,canvas.width*coords.y);
    for(let y = 0; y<clipTextDims.height; y++){
      const rowStart = canvas.width*(coords.y+y);
      const rowEnd = rowStart+canvas.width;
      const pasteStart = rowStart+coords.x;
      const pasteEnd = Math.min(pasteStart+clipTextDims.width,rowEnd);
      //get a row from the clipboard
      let pasteRow = clipText.substring(y*clipTextDims.width,(y+1)*clipTextDims.width,canvas.width+y*clipTextDims.width);
      
      //overlaying blank characters, like they're transparent
      if(settingsRef.current.blendTransparentAreas){
        let tempRow = '';
        for(let i = 0; i<pasteRow.length; i++){
          //if it's a blank character, grab the character from the underlying canvas
          if(pasteRow.charAt(i) === ' '){
            tempRow += canvas.data.charAt(pasteStart+i);
          }
          else{
            tempRow+=pasteRow.charAt(i);
          }
        }
        pasteRow = tempRow;
      }

      //grab part that'll fit on the canvas
      const pasteFinal = pasteRow.substring(0,Math.min(canvas.width-coords.x,clipTextDims.width+coords.x));
      newData += canvas.data.substring(rowStart,pasteStart)+pasteFinal+canvas.data.substring(pasteEnd,rowEnd);
    }
    newData += canvas.data.substring(canvas.width*(coords.y+clipTextDims.height));
    return newData;
  }

  //grabs any text, or images, in the users clipboard and puts them onto the canvas
  //https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/read
  async function pasteClipboardContents(coords){
    const contents = await navigator.clipboard.read(['text','images'])
    for(const item of contents){

      //if any item on the clipboard is an image, just use that!
      //^^ avoids pasting about text
      let mimeType = 'text/plain';
      for(let type of item.types){
        if(type === 'image/png')
          mimeType = type;
      }
      //if it's an image, overwrite the main canvas and render it
      if(mimeType === 'image/png'){
        const blob = await item.getType("image/png");
        const reader = new FileReader();
        reader.onload = (e) => {
          setImageRenderer({...imageRendererRef.current,
            imageLoaded:true,
            imageSrc:reader.result
          });
          // convertImageToAscii(reader.result);
        }
        reader.readAsDataURL(blob);
      }
      //if it's text, paste it at the correct loc
      else if(mimeType === 'text/plain'){
        const blob = await item.getType('text/plain');
        let text = await blob.text();
        const clipDims = clipboardDimensionsRef.current;
        const selBox = selectionBoxRef.current;
        const canvDims = asciiCanvasRef.current;
        const canvasText = asciiCanvasRef.current.data;
        const activeChar = activeCharIndexRef.current;
        let dimensions;
        //if the user has already stored data in the clipboard from sketchbook
        //AND if the content on the clipboard matches the content the user last copied from the app,
        //use the clipboard dimensions (this SHOULD cut off the add newline characters)
        if(clipDims !== undefined && clipboardTextRef.current === text){
          dimensions = clipDims;
        }
        //if not, paste it into the selectionbox
        else if(selBox.finished){
          dimensions = {width:Math.abs(selBox.startCoord.x - selBox.endCoord.x),height:Math.abs(selBox.startCoord.y - selBox.endCoord.y)}
        }
        else{
          //get the widest part of the clipboard text, to turn clipboard into a rectangle
          //break it into strings by newline
          const lines = text.split('\n');
          let width = 0;
          for(let line of lines){
            if(line.length > width){
              width = line.length;
            }
          }
          text = '';
          //pad each line to be 'width' characters long
          for(let line of lines){
            line = line.padEnd(width,' ');
            text += line;
          }
          //set the dims to the new clipboard bounding rectangle dims
          dimensions = {width:width,height:lines.length};
        }
        if(!coords)
          coords = {x:activeChar%canvDims.width,y:Math.trunc(activeChar/canvDims.width)};
        setAsciiCanvas({...asciiCanvasRef.current,data:pasteText(text,dimensions,coords,asciiCanvasRef.current)});
      }
    }
  }

  function nullHandler(e){

  }

  function loadPreset(title){
    const newPreset = presets.find((element) => element.title === title);
    setAsciiCanvas({...asciiCanvasRef.current,data:newPreset.data,height:newPreset.height,width:newPreset.width});
    setCanvasDimensionSliders({height:newPreset.height,width:newPreset.width});
  }

  function getLineDirectionalChar(start,end){
    const slope = (end.y - start.y)/(end.x - start.x);
    const heading = Math.atan(slope)*180/Math.PI;
    if(-22.5 <= heading && heading < 22.5)
      return '-';
    else if(22.5 <= heading && heading < 67.5)
      return '\\';
    else if(67.5 <= heading && heading < 112.5)
      return '|'
    else if(112.5 <= heading && heading < 157.5)
      return '/';
    else if(157.5 <= heading && heading < 202.5)
      return '-';
    else if(-112.5 <= heading && heading < -67.5)
      return '|';
    else if(-67.5 <= heading && heading < 0)
      return '/';
    else return '*';
  }

  return (
    <>
    <div style = {aboutTextStyle}>
      <div className = 'help_button' style = {{fontFamily:settings.font,textDecoration:'underline',cursor:'pointer',width:'fit-content',position:'fixed',top:'10px',right:'10px',backgroundColor:settings.showAbout?'blue':null,color:settings.showAbout?'white':null}} onClick = {(e) => {setSettings({...settingsRef.current,showAbout:!settingsRef.current.showAbout})}}>{settings.showAbout?'[Xx close xX]':'about'}</div>
      {settings.showAbout && <div className = "about_text">{aboutText}</div>}
    </div>
    <div className = "app_container" style ={{fontFamily:settings.font}}>
      {/* controls */}
      <div className = "ui_container" style = {{display:'block'}}>
        {ascii_title}
        {ascii_rose}
        <div className = 'ascii_display' style = {asciiDisplayStyle} >{currentChar === ' '?'{ }':currentChar}</div>
        {mouseCoords &&
          <div style = {{position:'absolute',right:'50px',top:'100px'}}>{`[${mouseCoords.x},${mouseCoords.y}]`}</div>
        }
        {/* tools */}
        <div className = "ui_header">*------- tools -------*</div>
        <div style = {{display:'flex',gap:'10px'}}>
          <div className = 'ascii_button' style = {{backgroundColor:settings.drawingMode == 'brush'?'blue':null,color:settings.drawingMode == 'brush'?'white':null}} onClick = {()=>setSettings({...settingsRef.current,drawingMode:'brush'})}>brush</div>
          <div className = 'ascii_button' style = {{backgroundColor:settings.drawingMode == 'line'?'blue':null,color:settings.drawingMode == 'line'?'white':null}} onClick = {()=>setSettings({...settingsRef.current,drawingMode:'line'})}>line</div>
          <div className = 'ascii_button' style = {{backgroundColor:settings.drawingMode == 'stamp'?'blue':null,color:settings.drawingMode == 'stamp'?'white':null}} onClick = {()=>setSettings({...settingsRef.current,drawingMode:'stamp'})}>stamp</div>
          <div className = 'ascii_button' style = {{backgroundColor:settings.drawingMode == 'fill'?'blue':null,color:settings.drawingMode == 'fill'?'white':null}} onClick = {()=>setSettings({...settingsRef.current,drawingMode:'fill'})}>fill</div>
          {/* clear canvas */}
          <div className = "ascii_button" onClick = {(e) => {clearCanvas();}}>clear</div>
        </div>
        {/* tool settings */}
        <br></br>
        <div style = {{color:'#555454ff',fontStyle:'italic'}}>settings</div>
        <div id = "tool-settings" style = {{display:'flex',flexDirection:'column'}}>
          {settings.drawingMode == 'stamp' &&
          <>
            {clipboardText &&
            <div style = {{display:'flex',width:'150px',height:'fit-content',justifyContent:'center'}}>
              <div style = {{...brushPreviewStyle,width:'fit-content',height:'fit-content'}}>
                {getStampCanvas()}
              </div>
            </div>
            }
            {
              !clipboardText &&
              <div style = {{color:'red'}}>copy canvas area to create a stamp</div>
            }
          </>
          }
          {settings.drawingMode == 'line' &&
            <AsciiButton state = {lineData.fillByDirection} title = {'use directional \'-\\|/)\' char'} onClick = {() => {setLineData({...lineDataRef.current,fillByDirection:!lineDataRef.current.fillByDirection})}}></AsciiButton>
          }
          {settings.drawingMode == 'brush' &&
          <>
            <Slider maxLength = {10} label = {'brush radius'} stepsize = {1} callback = {(val) => {setBrushData({lastCoordinate:brushData.lastCoordinate,drawing:brushData.drawing,brushSize:parseInt(val),brush:getBrushCanvas(parseInt(val))});}} value = {brushData.brushSize} defaultValue={brushData.brushSize} min = {0} max = {10}></Slider>
            <AsciiButton state = {settings.useDynamicBrush} title = {'dynamic'} onClick = {() => {setSettings({...settingsRef.current,useDynamicBrush:!settingsRef.current.useDynamicBrush})}}></AsciiButton>
            <div style = {{display:'flex',width:'150px',height:'fit-content',justifyContent:'center'}}> 
            <div style = {brushPreviewStyle}>
              {addLineBreaksToText({data:getBrushCanvas(brushData.brushSize),width:brushData.brushSize*2+3,height:brushData.brushSize*2+3})}
            </div>
        </div>
          </>
          }
        </div>
        <br></br>
        {!(selectionBox.started || selectionBox.finished) && 
          <div className = 'help_text' style ={{color:'#ff0000'}}>(shift+drag to select an area)</div>
        }
        {(selectionBox.started && !selectionBox.finished) &&
          <div className = 'help_text' style ={{color:'#ff0000'}}>selecting [{selectionBox.startCoord.x},{selectionBox.startCoord.y}],[{selectionBox.endCoord.x},{selectionBox.endCoord.y}]...</div>
        }
        {selectionBox.finished &&
          <div className = 'help_text' style ={{color:'#ff0000'}}>(arrow keys to translate area)</div>
        }
        {(selectionBox.started || selectionBox.finished) && 
        <>
        <div className = "ascii_button" style ={{color:'#ff0000'}} onClick = {(e) => {if(selectionBox.started || selectionBox.finished){
                                                            cutText(asciiCanvasRef.current);
                                                            }}}>cut (cmd+x)</div>
        <div className = "ascii_button" style ={{color:'#ff0000'}} onClick = {(e) => {if(selectionBox.started || selectionBox.finished){
                                                            copyText(asciiCanvasRef.current,{escaped:false,linebreaks:true});
                                                            }}}>copy (cmd+c)</div>
        </>}
        {/* paste button, when there's something to paste */}
        {(clipboardDimensions !== undefined) && 
          <div className = "ascii_button" style ={{color:'#ff0000'}} onClick = {(e) => {
                                                          pasteClipboardContents();
                                                          }}>paste (cmd+v)</div>
        }
        {/* overlay white space */}
        
        <AsciiButton onClick = {() => {setSettings({...settingsRef.current,blendTransparentAreas:!settingsRef.current.blendTransparentAreas})}} title = {'treat spaces like transparency'} state = {settings.blendTransparentAreas}></AsciiButton>
        
        {/* canvas */}
        <br></br>
        <div className = "ui_header">*------- text -------*</div>
        <br></br>
        <div style = {{color:'#555454ff',fontStyle:'italic'}}>canvas dimensions</div>
        <div style = {{display:'flex'}}>
        <div style = {{marginLeft:'1ch'}} className = 'ui_header'>width:</div>
        <NumberInput name = "width" value = {canvasDimensionSliders.width} min = {1} max = {1024} buttonCallback = {(val) => {
          setAsciiCanvas({...asciiCanvasRef.current,data:resizeCanvas(asciiCanvasRef.current,{height:asciiCanvasRef.current.height,width:val}),width:val});
          setCanvasDimensionSliders({width:val,height:canvasDimensionSliders.height})}} inputCallback = {(val) =>{setCanvasDimensionSliders({width:val,height:canvasDimensionSlidersRef.current.height})}}></NumberInput>
        </div>
        <div style = {{display:'flex'}}>
        <div className = 'ui_header'>height:</div>
        <NumberInput name = "height" value = {canvasDimensionSliders.height} min = {1} max = {1024} buttonCallback = {(val) => {
          setAsciiCanvas({...asciiCanvasRef.current,data:resizeCanvas(asciiCanvasRef.current,{width:asciiCanvasRef.current.width,height:val}),height:val});
          setCanvasDimensionSliders({width:canvasDimensionSliders.width,height:val})}} inputCallback = {(val) =>{setCanvasDimensionSliders({height:val,width:canvasDimensionSlidersRef.current.width})}}></NumberInput>
        </div>
        { (canvasDimensionSliders.width != asciiCanvas.width || canvasDimensionSliders.height != asciiCanvas.height) &&
          <div className = "ascii_button" onClick = {() =>{setAsciiCanvas({...asciiCanvasRef.current,data:resizeCanvas(asciiCanvasRef.current,{width:canvasDimensionSlidersRef.current.width,height:canvasDimensionSlidersRef.current.height}),width:canvasDimensionSlidersRef.current.width,height:canvasDimensionSlidersRef.current.height})}} style = {{color:'#0000ff'}}>[enter] apply</div>
        }
        <br></br>

        <ColorPicker backgroundColor = {settings.backgroundColor} textColor = {settings.textColor} defaultValue = {{bg:settings.backgroundColor,fg:settings.textColor}} callback = {{bg:(val) => {setSettings({...settingsRef.current,backgroundColor:val})},fg:(val) => {setSettings({...settingsRef.current,textColor:val})}}}></ColorPicker>
        <br></br>
      
        <div className = "dropdown_container">
        <div style = {{color:'#555454ff',fontStyle:'italic'}}>font</div>
        <select className = "dropdown" style = {{userSelect :'none'}} value = {settings.font.title}
            onInput  = {(e) => {
              const font = fontOptions.find((element) => element.title === e.target.value);
              setSettings({...settingsRef.current,font:font.cssName});
            }}>
                <>{fontOptions.map((op,index) => (<option key = {index}>{op.title}</option>))}</>
        </select>
        </div>
        <Slider maxLength = {20} label = {'font size'} stepsize = {1} callback = {(val) => {setSettings({...settingsRef.current,fontSize:val})}} defaultValue={settings.fontSize} min = {1} max = {20}></Slider>
        <Slider maxLength = {20} label = {'horizontal spacing'} stepsize = {0.1} callback = {(val) => {setSettings({...settingsRef.current,textSpacing:val})}} defaultValue={settings.textSpacing} min = {-0.5} max = {4}></Slider>
        <Slider maxLength = {20} label = {'vertical spacing'} stepsize = {0.01} callback = {(val) => {setSettings({...settingsRef.current,lineHeight:val})}} defaultValue={settings.lineHeight} min = {0.1} max = {2}></Slider>
        <br></br>
        <div style = {{color:'#555454ff',fontStyle:'italic'}}>settings</div>
        <AsciiButton onClick = {() => {setSettings({...settingsRef.current,advanceWhenCharacterEntered:!settingsRef.current.advanceWhenCharacterEntered})}} title = {'advance cursor when typing'} state = {settings.advanceWhenCharacterEntered}></AsciiButton>
        <AsciiButton  onClick = {() => {setSettings({...settingsRef.current,textSelectable:!settingsRef.current.textSelectable})}} title = {'freeze text'} state = {settings.textSelectable}></AsciiButton>
        <br></br>
        <Dropdown label = 'page# (previous drawings):' callback = {loadPreset} options = {presets.map((n) => n.title)}></Dropdown>
        {/* drop zone */}
        <div className = "ui_header">*------- image -------*</div>

        <br></br>
        {imageRenderer.imageLoaded &&
          <div className = 'help_text' style ={{color:'#ff0000',fontStyle: 'italic'}}>updating image resets the canvas!</div>
        }
        <DropZone title = {
          `+---------------------+
|                     |
|  Drop images here,  |
| or click to upload. |
|                     |
+---------------------+`}
         callback = {loadImage}></DropZone>
        {imageRenderer.imageLoaded &&
        <>
        <img className = "image_preview" src = {imageRenderer.imageSrc}/>
        <div style = {{display:'flex',gap:'10px'}}>
          <div>Palettes:</div>
          <div className = 'ascii_button' style = {{backgroundColor:asciiPalettePreset == 'full'?'blue':null,color:asciiPalettePreset == 'full'?'white':null}} onClick = {()=>{setAsciiPalettePreset('full');setAsciiPalette(asciiPalettePresets['full']);setImageRenderer({...imageRendererRef.current,needToReload:true});}}>full</div>
          <div className = 'ascii_button' style = {{backgroundColor:asciiPalettePreset == 'symbols'?'blue':null,color:asciiPalettePreset == 'symbols'?'white':null}} onClick = {()=>{setAsciiPalettePreset('symbols');setAsciiPalette(asciiPalettePresets['symbols']);setImageRenderer({...imageRendererRef.current,needToReload:true});}}>symbols</div>
          <div className = 'ascii_button' style = {{backgroundColor:asciiPalettePreset == 'letters'?'blue':null,color:asciiPalettePreset == 'letters'?'white':null}} onClick = {()=>{setAsciiPalettePreset('letters');setAsciiPalette(asciiPalettePresets['letters']);setImageRenderer({...imageRendererRef.current,needToReload:true});}}>letters</div>
        </div>
        <AsciiPaletteInput reverseCallback={reverseAsciiPalette} value = {asciiPalette} callback = {(val) => {setAsciiPalette(val);setImageRenderer({...imageRenderer,needToReload:true})}} ></AsciiPaletteInput>
        <Slider maxLength = {20} label = {'image brightness'} stepsize = {0.1} callback = {(val) => {setImageRenderer({imageLoaded:imageRenderer.imageLoaded,gamma:(4.0 - val),contrast:imageRenderer.contrast,imageSrc:imageRenderer.imageSrc,needToReload:true});}} defaultValue={imageRenderer.gamma} min = {0.0} max = {4.0}></Slider>
        <Slider maxLength = {20} label = {'image contrast'} stepsize = {0.1} callback = {(val) => {setImageRenderer({imageLoaded:imageRenderer.imageLoaded,gamma:imageRenderer.gamma,contrast:val,imageSrc:imageRenderer.imageSrc,needToReload:true});}} defaultValue={imageRenderer.contrast} min = {0.0} max = {2.0}></Slider>
        </>
        }
        {/* copy */}
        <br></br>
        <div className = "ui_header">*------- clipboard -------*</div>
        <div style = {{position:'relative'}}>
          {/* copy text to clipboard*/}
          <div className = "ascii_button" onClick = {(e) => {copyText(asciiCanvasRef.current,{escaped:false,linebreaks:true})}}>copy drawing to clipboard</div>
          {/* <div className = "ascii_button">{'*'}</div> */}
          <div className = "ascii_button" onClick = {(e) => {copyText(asciiCanvasRef.current,{escaped:true,linebreaks:false})}}>{'*> as one line'}</div>
          <div className = "ascii_button" onClick = {(e) => {copyText(asciiCanvasRef.current,{escaped:true,linebreaks:false})}}>{'*> as escaped code'}</div>
          {/* paste text to canvas from clipboard */}
          <div className = "ascii_button" onClick = {(e) => {pasteClipboardContents()}}>paste drawing from clipboard</div>
        </div>
      </div>
      {/* scrollable box, holding the canvas+background+border elements */}
      <div className = "page_container" style = {pageContainerStyle}>
        <div className = "canvas_container" style = {canvasContainerStyle}>
        {/* selection box */}
        {(selectionBox.started||selectionBox.finished) &&
          <div className = "selection_box" style = {selectionBoxStyle}/>
        }
        {/* canvas resizing preview box */}
        {(canvasDimensionSliders.width != asciiCanvas.width || canvasDimensionSliders.height != asciiCanvas.height) &&
          <div className = "resize_preview_box" style = {resizePreviewStyle}/>
        }
        <div className = "highlight_box" style = {highlightBoxStyle}/>
        <div className = "ascii_canvas" onMouseMove = {settings.textSelectable?nullHandler:handleMouseMove} onMouseDown = {settings.textSelectable?nullHandler:handleMouseDown} onMouseUp = {settings.textSelectable?nullHandler:handleMouseUp} onMouseLeave = {settings.textSelectable?nullHandler:handleMouseLeave} style = {canvasStyle}>
          {addLineBreaksToText(asciiCanvas)}
        </div>
        {!settings.textSelectable && 
        <div className = "canvas_background" style = {backgroundStyle}>
          {addLineBreaksToText({data:createBackground(asciiCanvas),width:asciiCanvas.width+2,height:asciiCanvas.height+2})}
        </div>
        }
      </div>
      </div>
    </div>
  </>);
}

export default App