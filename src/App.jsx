import { useState , useEffect , useRef , Children} from 'react'
import React from 'react'
import ColorPicker from './components/colorpicker';
import Slider from './components/slider';
import './main.css';
import Dropdown from './components/dropdown';
import NumberInput from './components/numberinput';
import AsciiPaletteInput from './components/asciipaletteinput';
import { ascii_rose,aboutText } from './about';
import { DropZone } from './components/DropZone';
import { presets } from './presets';

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

  const [bufferCanvas,setBufferCanvas] = useState(presets[0].data);
  const [currentChar,setCurrentChar] = useState('a');
  const [activeCharIndex,setActiveCharIndex] = useState(0);
  const [canvasDimensionSliders,setCanvasDimensionSliders] = useState(
    {
      width:presets[0].width,height:presets[0].height
    }
  );
  const [asciiPalettePreset,setAsciiPalettePreset] = useState('full');
  const [asciiPalette,setAsciiPalette] = useState(asciiPalettePresets['full']);

  const [settings,setSettings] = useState({
    backgroundColor:'#ffffffff',
    textColor:'#0000ffff',
    fontSize:12,
    textSpacing:0,
    lineHeight:1.15,
    textSelectable:false,
    drawingMode:'brush',
    showAbout:false,
    showBrushPreview:false,
    escapeTextBeforeCopying:true,
    copyTextWithLineBreaks:false,
    blendTransparentAreas:true,
    advanceWhenCharacterEntered:true,
    useDynamicBrush:false
  });
  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  },[settings]);

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
    char : currentChar
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

  function copyText(canvas){
    //if there's a selection box, copy from that instead
    const selBox = selectionBoxRef.current;
    if(selBox.finished){
      const topL = {x:Math.min(selBox.startCoord.x,selBox.endCoord.x),y:Math.min(selBox.startCoord.y,selBox.endCoord.y)};
      const bottomR = {x:Math.max(selBox.startCoord.x,selBox.endCoord.x),y:Math.max(selBox.startCoord.y,selBox.endCoord.y)};
      canvas = copyArea(selBox.startCoord,selBox.endCoord,canvas);
      canvas.width = bottomR.x-topL.x;
      canvas.height = bottomR.y-topL.y;
    }
    setClipboardText(canvas.data);
    // if(settingsRef.current.escapeTextBeforeCopying)
    //   canvas.data = escapeTextData(canvas.data);
    if(settingsRef.current.copyTextWithLineBreaks)
      canvas.data = addLineBreaksToText(canvas);
    setClipboardDimensions(canvas);
    navigator.clipboard.writeText(canvas.data);
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
    //70 char long
    const outputDimensions = {width:asciiCanvas.width,height:asciiCanvas.height};

    const palette = asciiPalette;
    if(palette.length === 0){
      let warningString = '[no character palette to raster with]';
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
        setImageRenderer({
          imageLoaded:true,
          gamma:imageRenderer.gamma,
          contrast:imageRenderer.contrast,
          imageSrc:src,
          needToReload:false
        });
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
      begun : true,
      moved : false,
      startIndex : index,
      endIndex : null,
      char : currentChar
    }
    setLineData(line);
    //store a copy of div contents in buffer canvas, so you can draw arbitrary lines on top of canvas w/o loosing anything
    setBufferCanvas(asciiCanvasRef.current.data);
  }
  function endLine(endIndex){
    const start = {x:lineData.startIndex%asciiCanvas.width,y:Math.trunc(lineData.startIndex/asciiCanvas.width)};
    const end = {x:endIndex%asciiCanvas.width,y:Math.trunc(endIndex/asciiCanvas.width)};
    const line = {
      begun : false,
      moved : false,
      startIndex : lineData.startIndex,
      endIndex : endIndex,
      char : currentChar
    };
    let tempCanvas = bufferCanvas;
    tempCanvas = drawLine(start,end,currentChar,{width:asciiCanvasRef.current.width,height:asciiCanvasRef.current.height,data:tempCanvas});
    setLineData(line);
    setAsciiCanvas({...asciiCanvasRef.current,data:tempCanvas});
    setBufferCanvas(tempCanvas);
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
    return {x:Math.floor(coords.x),y:Math.floor(coords.y)};
  }
  function getRoundedClickCoords(e){
    const coords = getClickCoords(e);
    return {x:Math.min(Math.round(coords.x),asciiCanvasRef.current.width),y:Math.min(Math.round(coords.y),asciiCanvasRef.current.height)};
  }
  function handleMouseLeave(e){
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
      case 'brush':
        setBrushData({
          drawing:false,
          brushSize:brushData.brushSize,
          brush:brushData.brush,
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
      const newBox = {
        started : false,
        finished : false,
        startCoord : selectionBox.startCoord,
        endCoord : getRoundedClickCoords(e),
        movingText : false,
        moveBy : {x:0,y:0}
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
          setBufferCanvas(asciiCanvasRef.current.data);
          pushUndoState();
        }
        return;
      }
    }
    //starting selectionbox
    if(e.shiftKey){
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
      setBufferCanvas(asciiCanvasRef.current.data);
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
          pasteClipboardContents({x:coords.x-clipboardDimensionsRef.current.width/2,y:coords.y-clipboardDimensionsRef.current.height/2});
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
    switch(settings.drawingMode){
      case 'line':
        //changing line position
        if(lineData.begun){
          //if the index didn't change, you haven't moved
          if(newIndex === lineData.startIndex){
            return;
          }
          const tempCanvas = bufferCanvas;
          const start = {x:lineData.startIndex%asciiCanvas.width,y:Math.trunc(lineData.startIndex/asciiCanvas.width)};          
          const line = {
            begun : true,
            moved : true,
            startIndex : lineData.startIndex,
            endIndex : newIndex,
            char : currentChar
          };
          setLineData(line);
          setAsciiCanvas({...asciiCanvasRef.current,data:drawLine(start,coords,currentChar,{width:asciiCanvasRef.current.width,height:asciiCanvasRef.current.height,data:tempCanvas})});
        }
        break;
      case 'brush':
        if(brushData.drawing){
          console.log(coords);
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
      setAsciiCanvas({...asciiCanvasRef.current,data:shiftArea(newBox,newBox.moveBy,bufferCanvasRef.current,asciiCanvasRef.current.width,true)});
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
  function paste(clipData,data,coords,dataWidth){
    let newData = '';
    const blend = settingsRef.current.blendTransparentAreas;
    //grab up until first row
    newData = data.substring(0,dataWidth*coords.y);
    for(let y = 0; y<clipData.height; y++){
      const rowStart = dataWidth*(coords.y+y);
      const rowEnd = rowStart+dataWidth;
      const pasteStart = rowStart+coords.x;
      const pasteEnd = Math.min(pasteStart+clipData.width,rowEnd);
      //get a row from the clipboard
      let pasteRow = clipData.data.substring(y*clipData.width,(y+1)*clipData.width,dataWidth+y*clipData.width);
      
      //overlaying blank characters, like they're transparent
      if(blend){
        let tempRow = '';
        for(let i = 0; i<pasteRow.length; i++){
          //if it's a blank character, grab the character from the underlying canvas
          if(pasteRow.charAt(i) === ' '){
            tempRow += data.charAt(pasteStart+i);
          }
          else{
            tempRow+=pasteRow.charAt(i);
          }
        }
        pasteRow = tempRow;
      }

      //grab part that'll fit on the canvas
      const pasteFinal = pasteRow.substring(0,Math.min(dataWidth-coords.x,clipData.width+coords.x));
      newData += data.substring(rowStart,pasteStart)+pasteFinal+data.substring(pasteEnd,rowEnd);
    }
    newData += data.substring(dataWidth*(coords.y+clipData.height));
    return newData;
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
    newData.data = paste(newData.cutData,newData.data,{x:Math.min(coords.startCoord.x,coords.endCoord.x)+direction.x,y:Math.min(coords.startCoord.y,coords.endCoord.y)+direction.y},dataWidth);
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
      if(e.key == 'x'){
        if(e.metaKey){
          pushUndoState();
          cutText(textData,canvDims);
          return;
        }
      }
      if(e.key == 'z'){
        if(e.metaKey){
          if(e.shiftKey)
            redo();
          else
            undo();
          return;
        }
      }
      else if(e.key == 'c'){
        //copy text to clipboard
        if(e.metaKey){
          copyText(asciiCanvasRef.current);
          return;
        }
      }
      //if ctrl v, and if there's something on the clipboard
      else if(e.key == 'v'){
        if(e.metaKey){
          pushUndoState();
          pasteClipboardContents();
          return;
        }
      }
      //clear all with ctr+slash, ctrl+backspace is handled in backspace handler
      else if((e.key == '/' || e.key == '\\')&&e.metaKey){
        pushUndoState();
        clearCanvas();
        return;
      }
      //select all
      else if(e.key == 'a'){
        if(e.metaKey){
          setSelectionBox({
            started : false,
            finished : true,
            startCoord : {x:0,y:0},
            endCoord : {x:canvDims.width,y:canvDims.height},
            movingText : false,
            moveBy : {x:0,y:0}
          });
          return;
        }
      }
      else if(e.key == ' '){
        e.preventDefault();
      }
      //if you're not drawing a line, set the active char
      if(!line.begun){
        pushUndoState();
        //if selbox, fill the area
        if(selection.started || selection.finished){
          let newData = cutAreaAndFill(selection.startCoord,selection.endCoord,textData,canvDims.width,e.key);
          setAsciiCanvas({...asciiCanvasRef.current,data:newData.data});
          setCurrentChar(e.key);
          return;
        }
        //write the character
        setAsciiCanvas({...asciiCanvasRef.current,data:writeCharacter(index,e.key,asciiCanvasRef.current)});
        if(settingsRef.current.advanceWhenCharacterEntered && index < (canvDims.width*canvDims.height-1)){
          setActiveCharIndex(index+1);
        }
      }
      //if you are drawing a line, redraw it with the new character
      else if(line.moved){
        const startCoords = {x:line.startIndex%canvDims.width,y:Math.trunc(line.startIndex/canvDims.width)};
        const endCoords = {x:line.endIndex%canvDims.width,y:Math.trunc(line.endIndex/canvDims.width)};
        const newL = {
          begun : true,
          moved : true,
          startIndex : line.startIndex,
          endIndex : line.endIndex,
          char : e.key
        };
        const tempCanvas  = drawLine(startCoords,endCoords,e.key,{width:asciiCanvasRef.current.width,height:asciiCanvasRef.current.height,data:bufCanvas});
        setLineData(newL);
        setAsciiCanvas({...asciiCanvasRef.current,data:tempCanvas});
      }
      setCurrentChar(e.key);
    }
    else if(e.key === 'Backspace'){
      pushUndoState();
      if(e.metaKey){
        clearCanvas();
        return;
      }
      setAsciiCanvas({...asciiCanvasRef.current,data:writeCharacter(index,' ',textData)});
      if(settingsRef.current.advanceWhenCharacterEntered && index > 0){
        setActiveCharIndex(index-1);
      }
    }
    else if(e.key === 'ArrowRight'){
      //move returns false if it doesn't work
      if(move(selection,{x:1,y:0},bufCanvas,canvDims)){
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
      if(move(selection,{x:-1,y:0},bufCanvas,canvDims)){
        return;
      }
      else if(e.shiftKey)
        shiftCharacters(index,-1,textData);
      else if((index%canvDims.width)>0)
        setActiveCharIndex(index-1);

    }
    else if(e.key === 'ArrowUp'){
      //move returns false if it doesn't work
      if(move(selection,{x:0,y:-1},bufCanvas,canvDims)){
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
      if(move(selection,{x:0,y:1},bufCanvas,canvDims)){
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
    left:'200px',
    position:'fixed',
    float:'right',
    gap:'10px',
    // alignItems:'center',
    alignItems:'baseline',
    fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize:'12px'
  }
  const titleStyle = {
    zIndex : 2,
    width : 'fit-content',
    height : 'fit-content',
    transform:'scale(3,1)',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize:'40px',
    backgroundColor:'#0000ffff',
    color:'#ff66bfff',
  }
  
  const highlightColor = '#ff0000ff';
  const aboutTextStyle = {
    zIndex : 2,
    display:'block',
    width : '605px',
    // transform:'scale(1,0.5)',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize:'25px',
    color:'#0000ffff',
    backgroundColor:'#ff66bfff',
    textShadow:' -1px -1px 0 '+highlightColor+', 1px -1px 0 '+highlightColor+', -1px 1px 0 '+highlightColor+', 1px 1px 0 '+highlightColor,
    top:'45px',
    left:'0px',
    bottom:'0px',
    position:'fixed',
    overflowY:'scroll'
  }

  const selectionBoxStyle = {
    width:String(Math.abs(selectionBox.startCoord.x - selectionBox.endCoord.x))+'ch',
    height:String(Math.abs(selectionBox.startCoord.y - selectionBox.endCoord.y)*settings.lineHeight)+'em',
    left:(Math.min(selectionBox.startCoord.x,selectionBox.endCoord.x)+selectionBox.moveBy.x) + 'ch',
    top:String((Math.min(selectionBox.startCoord.y,selectionBox.endCoord.y)+selectionBox.moveBy.y)*settings.lineHeight) + 'em',
    lineHeight:settings.lineHeight,
    letterSpacing:settings.textSpacing+'px',
    fontSize:settings.fontSize+'px',
    borderColor:settings.textColor,
    zIndex:'0',
    position:'absolute',
    borderStyle:'dashed',
    borderWidth:'1px',
    fontFamily:'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    backgroundColor:'#ffff00'
  }

  const resizePreviewStyle = {
    width:String(canvasDimensionSliders.width)+'ch',
    height:String((canvasDimensionSliders.height)*settings.lineHeight)+'em',
    left:'0',
    top:'0',
    // borderColor:textColor,
    lineHeight:settings.lineHeight,
    letterSpacing:settings.textSpacing+'px',
    fontSize:settings.fontSize+'px',
    zIndex:0,
    position:'absolute',
    borderStyle:'dashed',
    borderWidth:'1px',
    pointerEvents:'none',
    fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  }

  const highlightBoxStyle = {
    width:'1ch',
    height: settings.lineHeight+'em',

    left: String(activeCharIndex%asciiCanvas.width) + 'ch',
    top: String(Math.trunc(activeCharIndex/asciiCanvas.width)*settings.lineHeight)+'em',
    lineHeight:settings.lineHeight,
    letterSpacing:settings.textSpacing+'px',
    fontSize:settings.fontSize+'px',
    position:'absolute',
    animation: 'blinkBackground 0.5s infinite'
  };

  const canvasContainerStyle = {
    width:'fit-content',
    height:'fit-content',
    lineHeight:settings.lineHeight,
    letterSpacing:settings.textSpacing+'px',
    marginTop: '120px',
    position:'relative',
    whiteSpace: 'pre',
    fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
  }

  const canvasStyle = {
    userSelect : settings.textSelectable?'text':'none',

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
    width:(brushData.brushSize*2)+'ch',
    whiteSpace:'pre',
    fontSize:settings.fontSize+'px',
    color:settings.textColor,
    backgroundColor:'transparent',
    lineHeight:settings.lineHeight,
    letterSpacing:settings.textSpacing+'px',
    marginLeft:'20px',
    direction: 'rtl'
  }

  const backgroundStyle = {
    color:'#000000',
    backgroundColor:settings.backgroundColor,
    top:'-'+String(settings.lineHeight)+'em',
    fontSize:settings.fontSize+'px',
    width: asciiCanvas.width+2+'ch'
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
        convertImageToAscii(reader.result);
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
    // console.log(clipboardText,clipboardDimensions);
    let canv = {...clipboardDimensions,data:createBackground({width:clipboardDimensions.width,height:clipboardDimensions.height})};
    console.log(canv);
    return addLineBreaksToText({data:pasteText(clipboardText,clipboardDimensions,{x:1,y:1},canv),width:clipboardDimensions.width+2,height:clipboardDimensions.height+2});
  }


  function pasteText(clipText,clipTextDims,coords,canvas){
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
      for(const mimeType of item.types){
        //if it's an image, overwrite the main canvas and render it
        if(mimeType === 'image/png'){
          const blob = await item.getType("image/png");
          convertImageToAscii(URL.createObjectURL(blob));
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
          //if the user has already stored data in the clipboard from sketchbook, it'll have dimensions with it
          if(clipDims !== undefined){
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
  }

  function nullHandler(e){

  }

  function loadPreset(title){
    const newPreset = presets.find((element) => element.title === title);
    setAsciiCanvas({...asciiCanvasRef.current,data:newPreset.data,height:newPreset.height,width:newPreset.width});
    setCanvasDimensionSliders({height:newPreset.height,width:newPreset.width});
  }

  const AsciiBox = ({width,height,children}) => {
    const asciiBoxStyle = {
      whiteSpace: 'pre',
      fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      fontSize: '10px',
      position:'absolute',
      display:'block',
      textWrap:'',
      overflowWrap: 'break-word',
      left:'-1ch',
      top:'-1em',
      width:`${width+2}ch`
    }
    const cornerCharacter = '*';
    let topStr = '';
    topStr = cornerCharacter + topStr.padEnd(width+1,'-') + cornerCharacter;

    let sideStr = '|';
    sideStr = sideStr.padEnd(width+1,' ');
    // sideStr += '|';

    let mainStr = topStr;
    for(let i = 0; i < height; i++){
      mainStr += sideStr;
    }
    mainStr+=topStr;

    return(
      <div style = {asciiBoxStyle}>
        {mainStr}
        {Children.map(children, child =>
            {child}
        )}
      </div>
    )
  }

  if(imageRenderer.imageLoaded && imageRenderer.needToReload){
    convertImageToAscii(imageRenderer.imageSrc);
  }

  return (
    <div className = "app_container">
      {settings.showAbout && <div className = "about_text" style = {aboutTextStyle}>{aboutText}</div>}
      <div style = {titleContainer}>
      <div className = 'title_card' style = {titleStyle} >{'sketchbook'}</div>
      <div className = 'help_text' style = {{textDecoration:'underline',color:'#0000ff',cursor:'pointer',width:'fit-content',marginLeft:'200px'}} onClick = {(e) => {setSettings({...settingsRef.current,showAbout:!settingsRef.current.showAbout})}}>{settings.showAbout?'[Xx close xX]':'About'}</div>
      </div>
      {/* controls */}
      <div className = "ui_container" style = {{display:'block'}}>
        {ascii_rose}
        <div className = 'ascii_display' style = {asciiDisplayStyle} >{currentChar === ' '?'{ }':currentChar}</div>
        {/* <div className = 'help_text'>cursor: (x:{activeCharIndex%asciiCanvas.width} y:{Math.trunc(activeCharIndex/asciiCanvas.width)})</div> */}
        <div className = 'ascii_button' onClick = {() => {setSettings({...settingsRef.current,textSelectable:!settingsRef.current.textSelectable})}}>selectable text [{settings.textSelectable?'X':' '}]</div>
        {settings.textSelectable && 
          <div className = 'help_text' style ={{color:'#ff0000'}}>(cmd+a) select all</div>
        }
        {!settings.textSelectable && <>
        <div className = 'ascii_button' onClick = {() => {setSettings({...settingsRef.current,advanceWhenCharacterEntered:!settingsRef.current.advanceWhenCharacterEntered})}}>advance cursor when typing [{settings.advanceWhenCharacterEntered?'X':' '}]</div>
        <div style = {{display:'flex',gap:'10px'}}>
          <div className = 'ascii_button' style = {{backgroundColor:settings.drawingMode == 'brush'?'blue':null,color:settings.drawingMode == 'brush'?'white':null}} onClick = {()=>setSettings({...settingsRef.current,drawingMode:'brush'})}>brush</div>
          <div className = 'ascii_button' style = {{backgroundColor:settings.drawingMode == 'line'?'blue':null,color:settings.drawingMode == 'line'?'white':null}} onClick = {()=>setSettings({...settingsRef.current,drawingMode:'line'})}>line</div>
          <div className = 'ascii_button' style = {{backgroundColor:settings.drawingMode == 'stamp'?'blue':null,color:settings.drawingMode == 'stamp'?'white':null}} onClick = {()=>setSettings({...settingsRef.current,drawingMode:'stamp'})}>stamp</div>
        </div>
        {settings.drawingMode == 'stamp' &&
        <>
          {clipboardText &&
          <div style = {{...brushPreviewStyle,width:clipboardDimensions.width+2+'ch',height:clipboardDimensions.height+2.5+'em'}}>
            {getStampCanvas()}
          </div>
          }
          {
            !clipboardText &&
            <div style = {{color:'red'}}>copy canvas area to create a stamp</div>
          }
        </>
        }
        {settings.drawingMode == 'brush' &&
        <>
          <Slider maxLength = {10} label = {'brush radius'} stepsize = {1} onMouseEnter = {() => setSettings({...settingsRef.current,showBrushPreview:true})} onMouseLeave = {() => setSettings({...settingsRef.current,showBrushPreview:false})}  callback = {(val) => {setBrushData({lastCoordinate:brushData.lastCoordinate,drawing:brushData.drawing,brushSize:parseInt(val),brush:getBrushCanvas(parseInt(val))});}} value = {brushData.brushSize} defaultValue={brushData.brushSize} min = {0} max = {10}></Slider>
          <div className = 'ascii_button' onClick = {() => {setSettings({...settingsRef.current,useDynamicBrush:!settingsRef.current.useDynamicBrush})}}>{'dynamic ['+(settings.useDynamicBrush?'x':' ')+']'}</div>
        </>
        }
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
                                                            copyText(asciiCanvasRef.current);
                                                            }}}>copy (cmd+c)</div>
        </>}
        {/* paste button, when there's something to paste */}
        {(clipboardDimensions !== undefined) && 
          <div className = "ascii_button" style ={{color:'#ff0000'}} onClick = {(e) => {
                                                          pasteClipboardContents();
                                                          }}>paste (cmd+v)</div>
        }
        {/* overlay white space */}
        <div className = 'ascii_button' onClick = {() => {setSettings({...settingsRef.current,blendTransparentAreas:!settingsRef.current.blendTransparentAreas})}}>{'blend transparency ['+(settings.blendTransparentAreas?'X':' ')+']'}</div>
        <NumberInput name = "width" value = {canvasDimensionSliders.width} min = {1} max = {1024} buttonCallback = {(val) => {
          setAsciiCanvas({...asciiCanvasRef.current,data:resizeCanvas(asciiCanvasRef.current,{height:asciiCanvasRef.current.height,width:val}),width:val});
          setCanvasDimensionSliders({width:val,height:canvasDimensionSliders.height})}} inputCallback = {(val) =>{setCanvasDimensionSliders({width:val,height:canvasDimensionSlidersRef.current.height})}}></NumberInput>
        <NumberInput name = "height" value = {canvasDimensionSliders.height} min = {1} max = {1024} buttonCallback = {(val) => {
          setAsciiCanvas({...asciiCanvasRef.current,data:resizeCanvas(asciiCanvasRef.current,{width:asciiCanvasRef.current.width,height:val}),height:val});
          setCanvasDimensionSliders({width:canvasDimensionSliders.width,height:val})}} inputCallback = {(val) =>{setCanvasDimensionSliders({height:val,width:canvasDimensionSlidersRef.current.width})}}></NumberInput>
        { (canvasDimensionSliders.width != asciiCanvas.width || canvasDimensionSliders.height != asciiCanvas.height) &&
          <div className = "ascii_button" onClick = {() =>{setAsciiCanvas({...asciiCanvasRef.current,data:resizeCanvas(asciiCanvasRef.current,{width:canvasDimensionSlidersRef.current.width,height:canvasDimensionSlidersRef.current.height}),width:canvasDimensionSlidersRef.current.width,height:canvasDimensionSlidersRef.current.height})}} style = {{color:'#0000ff'}}>[enter] apply</div>
        }
        <Dropdown label = 'page# (previous drawings):' callback = {loadPreset} options = {presets.map((n) => n.title)}></Dropdown>
        {/* copy settings */}
        <div style = {{position:'relative'}}>
          {/* copy text to clipboard*/}
          <div className = "ascii_button" onClick = {(e) => {copyText(asciiCanvasRef.current)}}>copy drawing to clipboard</div>
          <div className = "ascii_button" onClick = {() => {setSettings({...settingsRef.current,copyTextWithLineBreaks:!settingsRef.current.copyTextWithLineBreaks})}}>{'  line breaks ['+(settings.copyTextWithLineBreaks?'X]':' ]')}</div>
          <div className = "ascii_button" onClick = {() => {setSettings({...settingsRef.current,escapeTextBeforeCopying:!settingsRef.current.escapeTextBeforeCopying})}}>{'  escape text ['+(settings.escapeTextBeforeCopying?'X]':' ]')}</div>
        </div>
        {/* paste text to canvas from clipboard */}
        <div className = "ascii_button" onClick = {(e) => {pasteClipboardContents()}}>paste drawing from clipboard</div>
        {/* clear canvas */}
        <div className = "ascii_button" onClick = {(e) => {clearCanvas();}}>clear canvas</div>
        <ColorPicker label = 'background color' backgroundColor = {settings.backgroundColor} textColor = {'#000000'} defaultValue={settings.backgroundColor} callback = {(val) => {setSettings({...settingsRef.current,backgroundColor:val})}}></ColorPicker>
        <ColorPicker label = 'text color'  textColor = {settings.textColor} backgroundColor = {'transparent'} defaultValue={settings.textColor} callback = {(val) => {setSettings({...settingsRef.current,textColor:val})}}></ColorPicker>
        
        <Slider maxLength = {20} label = {'font size'} stepsize = {1} callback = {(val) => {setSettings({...settingsRef.current,fontSize:val})}} defaultValue={settings.fontSize} min = {1} max = {20}></Slider>
        <Slider maxLength = {20} label = {'horizontal spacing'} stepsize = {0.1} callback = {(val) => {setSettings({...settingsRef.current,textSpacing:val})}} defaultValue={settings.textSpacing} min = {-4} max = {4}></Slider>
        <Slider maxLength = {20} label = {'vertical spacing'} stepsize = {0.01} callback = {(val) => {setSettings({...settingsRef.current,lineHeight:val})}} defaultValue={settings.lineHeight} min = {0.1} max = {2}></Slider>
        {/* drop zone */}
        <DropZone title = "Drop images here, or click to upload." callback = {loadImage}></DropZone>
        {/* <FilePicker title = 'render image' callback = {(val) => {loadImage(val);}}></FilePicker> */}
        {imageRenderer.imageLoaded &&
        <>
        <img className = "image_preview" src = {imageRenderer.imageSrc}/>
        <AsciiPaletteInput value = {asciiPalette} callback = {(val) => {setAsciiPalette(val);setImageRenderer({...imageRenderer,needToReload:true})}} ></AsciiPaletteInput>
        <div style = {{display:'flex',gap:'10px'}}>
          <AsciiBox width = "20" height = "10">
            <div>palette presets:</div>
            <div className = 'ascii_button' style = {{backgroundColor:asciiPalettePreset == 'full'?'blue':null,color:asciiPalettePreset == 'full'?'white':null}} onClick = {()=>{setAsciiPalettePreset('full');setAsciiPalette(asciiPalettePresets['full']);setImageRenderer({...imageRendererRef.current,needToReload:true});}}>full</div>
            <div className = 'ascii_button' style = {{backgroundColor:asciiPalettePreset == 'symbols'?'blue':null,color:asciiPalettePreset == 'symbols'?'white':null}} onClick = {()=>{setAsciiPalettePreset('symbols');setAsciiPalette(asciiPalettePresets['symbols']);setImageRenderer({...imageRendererRef.current,needToReload:true});}}>symbols</div>
            <div className = 'ascii_button' style = {{backgroundColor:asciiPalettePreset == 'letters'?'blue':null,color:asciiPalettePreset == 'letters'?'white':null}} onClick = {()=>{setAsciiPalettePreset('letters');setAsciiPalette(asciiPalettePresets['letters']);setImageRenderer({...imageRendererRef.current,needToReload:true});}}>letters</div>
          </AsciiBox>
        </div>
        <Slider maxLength = {20} label = {'image brightness'} stepsize = {0.1} callback = {(val) => {setImageRenderer({imageLoaded:imageRenderer.imageLoaded,gamma:(4.0 - val),contrast:imageRenderer.contrast,imageSrc:imageRenderer.imageSrc,needToReload:true});}} defaultValue={imageRenderer.gamma} min = {0.0} max = {4.0}></Slider>
        <Slider maxLength = {20} label = {'image contrast'} stepsize = {0.1} callback = {(val) => {setImageRenderer({imageLoaded:imageRenderer.imageLoaded,gamma:imageRenderer.gamma,contrast:val,imageSrc:imageRenderer.imageSrc,needToReload:true});}} defaultValue={imageRenderer.contrast} min = {0.0} max = {2.0}></Slider>
        </>
        }
        {/* {ascii_rocket} */}
        </>}
        {/* brush preview */}
        {settings.showBrushPreview &&  
        <div style = {brushPreviewStyle}>
          {addLineBreaksToText({data:getBrushCanvas(brushData.brushSize),width:brushData.brushSize*2+3,height:brushData.brushSize*2+3})}
        </div>
        }
      </div>
      {/* canvas */}
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
        <div className = "canvas_background" style = {backgroundStyle}>
          {addLineBreaksToText({data:createBackground(asciiCanvas),width:asciiCanvas.width+2,height:asciiCanvas.height+2})}
        </div>
      </div>
    </div>
  )
}

export default App