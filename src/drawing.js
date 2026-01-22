function getCharFromString(x,y,str,dims){
    return str.charAt(x+y*dims.width);
}

export function writeCharacter(index,char,canvas){
    return canvas.data.substring(0,index)+char+canvas.data.substring(index+1);
}

export function writeCharacterXY(x,y,char,canvas){
    //check bounds
    if((x < 0) || (x >= canvas.width) || (y < 0) || (y >= canvas.height))
        return canvas.data;
    return writeCharacter(x+y*canvas.width,char,canvas);
}

export function fill(x,y,fillColor,canv){
    const tempChar = '\t';

    let newData = canv.data;

    //seed-checking fn that checks bounds and color to see if a pixel should be a new seed
    const isValid = (xi,yi,color) => {
        return ((xi >= 0) && (xi < canv.width) && (yi >= 0) && (yi < canv.height) && getCharFromString(xi,yi,newData,canv) === color);
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
          newData = writeCharacterXY(lx,seed.y,fillColor.data?tempChar:fillColor,{...canv,data:newData});
          lx = lx -1;
        }

        //right fill
        let rx = seed.x + 1;
        while (isValid(rx, seed.y, seed.color)) {
          newData = writeCharacterXY(rx,seed.y,fillColor.data?tempChar:fillColor,{...canv,data:newData});
          rx = rx + 1;
        }

        //scan up/down
        stack = scan(lx+1, rx-1, seed.y + 1, stack, seed.color);
        stack = scan(lx+1, rx-1, seed.y - 1, stack, seed.color)
    }
    //if it's a pattern fill, switch out the temp chars!
    if(fillColor.data){
      let tempData = newData;
      for(let i = 0; i<tempData.length; i++){
        if(tempData.charAt(i) === tempChar){
          const coords = {
            x: i % canv.width,
            y: Math.trunc(i / canv.width)
          };
          const char = fillColor.data.charAt(coords.x%fillColor.width + (coords.y%fillColor.height) * fillColor.width);
          tempData = writeCharacterXY(coords.x,coords.y,char,{...canv,data:tempData});
        }
      }
      newData = tempData;
    }
    return newData;
}

//draws circles along a path!
export function drawCirclesAlongPath(A,B,radius,character,canvas){
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
      return drawLine(0,{x:start.x,y:start.y},{x:end.x,y:end.y},character,canvas);
    }

    //these could be made to be a lot faster! a better way would be to connect the edges of the start and end circles with lines
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

export function fillCircleHelper(x0, y0, r, corners, delta, c, canvas) {
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

export function drawFastVLine(x,y,height,c,canvas){
    for(let i = 0; i<height; i++){
      canvas.data = writeCharacterXY(x,y+i,c,canvas);
    }
    return canvas.data;
  }

export function fillCircle(x0,y0,r,c,canvas){
    canvas.data = drawFastVLine(x0, y0 - r, 2 * r + 1, c, canvas);
    canvas.data = fillCircleHelper(x0, y0, r, 3, 0, c, canvas);
    return canvas.data;
  }

export function drawLine(size,start,end,char,canvas){
    if(size>0){
        //slope
        let m = (end.y - start.y)/(end.x - start.x);
        
        /*
        there are 8 line possibilities! 
        ____
        /    \
      |      |
        \____/

        
        */
      //vertical line
      if(m == Infinity){
        for(let i = -Math.trunc(size/2); i<Math.trunc(size/2); i++){
          canvas.data = drawLine(0,{x:start.x - i,y:start.y},{x:end.x - i,y:end.y},char,canvas);
        }
      }
      //horizontal line
      else if(m == 0){
        for(let i = -Math.trunc(size/2); i<Math.trunc(size/2); i++){
          canvas.data = drawLine(0,{x:start.x ,y:start.y-i},{x:end.x,y:end.y-i},char,canvas);
        }
      }
      //slope down
      else if(m < 0){
        const newSlope = -1/m;
        for(let i = -Math.trunc(size/2); i<Math.trunc(size/2); i++){
          canvas.data = drawLine(0,{x:start.x+newSlope*i ,y:start.y+newSlope*i},{x:end.x+newSlope*i,y:end.y+newSlope*i},char,canvas);
        }
      }
      //slope up
      else{
        //to the right
        if(end.x > start.x){

        }
        //to the left
        else{

        }
      }
    }

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

export function drawBox(start,end,characters,canvas){
  const topL = {x:Math.min(Math.min(start.x,end.x),canvas.width),y:Math.min(Math.min(end.y,start.y),canvas.height)};
  const bottomR = {x:Math.min(Math.max(start.x,end.x),canvas.width),y:Math.min(Math.max(end.y,start.y),canvas.height)};
  const w = bottomR.x - topL.x;
  const h = bottomR.y - topL.y;
  if(!w || !h)
    return canvas.data;
  if(characters.topL != '')
    canvas.data = writeCharacterXY(topL.x,topL.y,characters.topL,canvas);
  if(characters.top != '')
    canvas.data = drawLine(0,{x:topL.x+1,y:topL.y},{x:topL.x+w-1,y:topL.y},characters.top,canvas);
  if(characters.topR != '') 
    canvas.data = writeCharacterXY(topL.x+w,topL.y,characters.topR,canvas);
  if(characters.sideL != '') 
    canvas.data = drawFastVLine(topL.x,topL.y+1,h-1,characters.sideL,canvas);
  if(characters.sideR != '') 
    canvas.data = drawFastVLine(topL.x+w,topL.y+1,h-1,characters.sideR,canvas);
  if(characters.bottomL != '') 
    canvas.data = writeCharacterXY(topL.x,topL.y+h,characters.bottomL,canvas);
  if(characters.bottom != '') 
    canvas.data = drawLine(0,{x:topL.x+1,y:topL.y+h},{x:topL.x+w-1,y:topL.y+h},characters.bottom,canvas);
  if(characters.bottomR != '') 
    canvas.data = writeCharacterXY(topL.x+w,topL.y+h,characters.bottomR,canvas);
  if(characters.fill != ''){
    for(let x = topL.x+1; x<bottomR.x; x++){
      canvas.data = drawFastVLine(x,topL.y+1,h-1,characters.fill,canvas);
    }
  }
  return canvas.data;
}