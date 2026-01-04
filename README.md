# Ascii Sketchbook

This is a sketchbook designed for experimenting with monospace text.
Drawing/imagemaking is rendered through a string of raw HTML text, which can be copied from this sketchbook or pasted into it from other sources, or typed directly onto the canvas like using a typewriter.
It also supports an image rendering algorithm and some editing tools designed for weird, experimental ascii art imagemaking.

written by Alex LaFetra, summer 2025

![Example image of ascii sketchbook](public/preview.png)

## **The Basics**

Typing text enters it into the canvas at the cursor location, which advances as you write. The cursor can also be moved by clicking around and the arrow keys.


Shift clicking+dragging will create a selection box, which can be filled with a character when typed or cut, copied, moved with the arrow keys, and dragged with the mouse. By default, whitespaces will be treated as "transparent" when moving or pasting text.

### Drawing

The character drawn is the last character pressed, shown in the top left display box.

***brush***~ draw freehand lines by dragging the mouse. Brush thickness can be changed with the slider. Tick 'dynamic brush' to draw lines that resize thickness based on mouse speed.

***lines***~ draw straight lines by dragging the mouse.

***stamp***~ draw using a copied section of the canvas as a brush.<br></br>
***fill***~ fill an area using the current character (like a 'bucket fill')

***images*** ~ render an image to the canvas with the 'render image' button, or by pasting an image from the clipboard. You can control image contrast, brightness, and the character pallette used to render the image. At first the image is drawn to a separate layer, but can be committed to the drawing and edited like normal text.

### shortcuts
+ **Cmd+A** - select all
+ **Cmd+Shift+A** - deselect all
+ **Cmd+Z** - undo
+ **Cmd+Shift+Z** - redo
+ **Cmd+X** - cut selected area
+ **Cmd+C** - copy selected area
+ **Cmd+V** - paste clipboard
+ **Cmd+Backspace or '/'** - clear Canvas
+ **Backspace** - delete character
+ **Arrow keys** - move cursor or translate selected text
+ **Arrow keys** + Shift - translate row/column
+ **Enter** - move cursor down a line
+ **Enter+Shift** - insert blank line
