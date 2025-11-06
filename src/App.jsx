import { useState , useEffect , useRef} from 'react'
import React from 'react'
import ColorPicker from './components/colorpicker';
import Slider from './components/slider';
import './main.css';
import Dropdown from './components/dropdown';
import FilePicker from './components/filepicker';
import NumberInput from './components/numberinput';
import AsciiPaletteInput from './components/asciipaletteinput';
function App() {

  const presets =  [
    {
      title: 'house',
      data : `                                                                                                                                                                                                                                   #  #                                               #          #                                     ###          #                                 ### /       # #                                  #  //      ###                                      /|#( (.#   ##|                               ,   ( (.#) #..  #/|                              . \\   ) )/ / . #./ /                             /// \\ /  /   /) ##  (                            ///// \\ ^  .-) ) # ) )                           ///  ///, ^/ # /  .  /                            |\\  // .=. ###/ ..  /                 .           |#\\ / /=  \\##  /    ##                  ##########|##\\ /==   \\ _) ^ #                   ##0##0####0#+###/====   \\) ^  ##7 7                 ###00###00#\\##|====== |# ) _^ 7                 '   #####0##0#\\#|====   |## )                           #########\\|====== |#                                    ####+=======+                                                                                                                         `,
      height : 25,
      width : 50
    },
    {
      title:'wire',
      data : `                                                             #\\                                                 .\\                        y                        \\\\                      /.           _.            \\\\                    //            . \` --.       \\ \\                  ./              ._   \`\\\`\`\`-_  \\ \\__.             ;/              \`\`\`-_   \\    \`\`\`\\ \\ \\-.          / *                   \`\`\`\`\`-_  \\  \\ \\ \\ \\-,      : /                            \`\`\`\`.\\ \\ \\ \\ \\--. / ;                                 / y_. \\ \\ \\. \\ /                                 / /   \\_\\ \\ \\\\ \\ \`\`\`\`-_                          //\`       \\_\\ \\\\ \\      \`.\`\`\`-_                  //            \`-\`\\ \\\`\`\`-_  \\     \`\`\`             {.                 \\ ;    \`\`\`---_                                     \\ \\          \`\`\`\`                                  \`\\                                                 \`}                                                                                                                                                                                                                                                                                                                                                                            `,
      height : 25,
      width : 50
    },
    {
      title : 'star portrait',
      data :`                                                                                                                                                                                                                                                                                                                                /                                                                                                                                                                |                                     .|                                               //                                                                                                               ||                                  /. |                                             ../                                   \\\\                                                                          |.|                                 ..  |                                           .. /                                    \\ .\\\\\\                                               ;                      |. |                               .    |                                        /..  /                                      \\ .  \\\\\\\\                                      [%%%%#                     |.  |                             /.     |                                      /..   /                                        \\ .     \\\\\\                               l%/~\' ,%)                      |.   |                           /.     |                                     ...    /                                          \\\\.       \\\\\\\\                         /%~    1~%%                     |.     |                         ..      |                                  /..      /                                             \\.          \\\\\\\\                   %%,       ]%\\\"                    |.     |                        .        |                                /..       /                                               \\..            \\\\               _%         \`/%%                     .       |                     /.         |                              /..        /                                                 \\ .       %.*     &0 {%?%%% <[%%           ;%%%                   |.       |                    /.          |                           /...         /                                                   \\ .      %%%%%%0(}%0^       >              %%,}                  |.        |                  ..           |                         /..           /                                                     \\ .       %%<                             \"%%%%%%*|+(/%%%*%\\&\\1|.          |               /.             |                       /..            /                                                       \\ .       >%<                                                 |.  [%%%%1:}|              /.              |                     /..             /                                                         \\\\.       \"%%                                         ^l{%%:|.) ,%<%%%%%%%|%;%%%_ -    /.               |                  //..              /                                                            \\.         %%%                                   %%?+%}   |.            |^%%}% \"    ..%%>.            |                /...     >         /                                                              \\.         l%%#                            ]&%\"         |.              |        /. ,[#,     ~  >*+: |              /..       1%%(      /                                                                \\.          \\%                         !%%             |.               |      /.           \\~%{!   |   ,%%l    //..       >%>\`  %    /                                                                  \\.         *                           #%!            |.               |     /.                   | .?l\"     //..%<     \' /%;    %[                                                                      \\..      ,%                            %%.          |.                 |  /..                    |     ^] /...        1&%%~      {%                                                                      \\ .     0\`       :,%]!)*             %%            |.                 | /.                      |     //..  ?#                    <                                                                      \\\\.    *       ;%%%~&%%(0          ,%%_\\\\        |.                   ..                       |   //..         \\*l               %                                                                       \\.   %      {%\\      >%%%)<:}    ,%!   \\\\\\     |.                                            | //..              \'%              ^&                                                                      \\.  %     :\\           \"?%%%%%  %*       \\\\\\ |.                                             |/..                (%,                <_                                                                    \\. %    #%                \`<%%%%/          \\\\.                                                                %%<                     *                                                                  \\ %   ~%;                    %%                                                                             \"%                        \`%                                                                 0   !%                                                                                                    %%%%+%%*]\\{#>%%      ^\`       ?                                                               &  __                                                                                                             /       %    :>   #^%%&%\\                                                           <*: #% .                                                                                                           /         0    [         \` *                                                         ~/  %?\\ .                                         ..............---............---   ...                          /           >   ,+                                                                    %;-%%  \\ .                                    ....... .............               ------.....-                   /             !   %                                                                    %-%_    \\ .                               .....//..                                         ::..                /               !  %                                                                    \'%%      ..                              .... ...    >                                        ::\\\\             /                 0 <                                                                    %%%      \\ .                            ... ..                                                  ::\\\\          /                  :& ~                                                                    a&       \\..                          .....                                                      :::\\       /.                   ; %                                                                    %         \\..                       .. .                                                          ..:       ....                  l/%                                                                  %%          . .                    ... .                                                            . .        ....                 %%                                                                   %           . .                  . .. .          ..                                                . .          ...\\               _%                                                                   %            . .                  . .. .      ... .....                                             ..            ...\\              %\'                                                                  %             . .                ..  . .    ..     ssss....                                         ...             ..\\\\             l                                                                 \`/              \\.               ... .. ..                ss                                          ..              //                                                                                \'               \\ .              .;.....     ......                                          sssssss  .             //                 :                                                                %                \\ .             |;..           lll##...          s                     sssss         .           //                   |                                                                1                 \\ .            |;.        . . ll#######.                                           .          //                                                                                      >                  / .         ;;|; .         ... ###### //                      ss     .........    .        //                                                                                       0                 //..           ; ;,.      ,     .....\\./#                          .... 000####.           //                                                                                         .               //..             ;.;,.                                                .000.#####..#         /\\                                                                                                         / .                ;;,.                                                  ..#s#### $ #        ..\\\\                                                                                                     //..                 ; ,.                                               ... \\0,###s0 . .         ..\\\\                                                                                                 //..                   ;.,.            # #                                   ... ,,,,# .             ...\\\\                                                             .                               /..                     ;., .             #                                      ,,,,,  .                ..\\\\                                                                                         //.                        ;.,.                                                     ,,,,  .                  ...\\\\                                                                                    //..                         ;.,.                                                          .                      ..\\\\                                                                                 /..                           ;.,.                                   x             # #      .                        ..\\\\                                                                             //.                             ;.,.                      s s                        #       .                           ...\\\\                                                                        //..                               ;, .                      s ss           s          #       .                              ..\\\\                                                                     /..                                \\;. .                       ssss         s           .      .                                 ..\\\\                                                                 //.                                    .,.                          ss sss                       .                                  ///\\\\                                                             //..                                     #; .                                                     .                           ////////                                                                 /..                                       .;,.                                                     .                   ////////                                                                       /..                                         #; ,.                                                   .            ////////                                                                             //.                                           #.;,.                                    .             .        /////                                   l                                                /..            /                                #;;,.               (((                              .         \\                                       \\                                              /..              (%      -----/                   #;; ,.           ((((((00000   00                   .           \\                                     %&                                            //.     --------- !%%------     /.                  ## ;, .               s  ssssssss000 \\             .            \\                                     %0                                           ---------          |%%%.         /.                   \\##;, .                                          .             \\                                    0{%%                                                              |%%%         /.                    \\\\#;, .                oooooo                 ..               \\                                   % !%                                                              1%\"%%        /.                      \\#;; .                                    ..                 \\                                  %#  %.                                                            %%\\  *)      / .                       \\\\,; .                                 ..                   \\                                 -%   >%                                                           .%%   ~%      /.                          \\\\\\ .                              ..                      \\                                %     %                                                           :%%    <!     /.                             \\\\...                         ..                        \\                               {)     %>                  #                                        ! ~    \">    /.                               \\\\\\....                .....                           \\                              -[      %>               \"}                                          ,%      %/   .                                  \\\\...,.       ......                                \\                              [^      ]%             *%%%                                          {%\"       +\"                                           .......                    \\\\                \\                              %        %!         %%%%%%#                                          !%%\'        %            \'%%%%%/%%%%*~                                           |  \\\\               \\                             %         %# +%%%#^%    \\,                                            %%,         %%;% 1\"_%%%\\}     ^%%%*                                            |     \\\\             \\                            %          l_*\"         !%                                             %%,          ;\'?/}[]         &&%~                                             |        \\\\                                       %[                      \`%                                 \`<?%)%%[%%%%]                            0%>                                              |           \\  >     .%%% \"  >.                 1%%%?                     <%\`                         \\%}<#%%%%%%%&%_ > >                             ~%,                                              |                %%%%%%%%%\']!\'     \'%~1%(%%%/> l                          %?\'                             #.0%% ^                                      %*                /\\                            |                \\ ^\'%%}_%%%%%%%%:                                       !]1                                     +|%<^                               ]%%                // \\.                         ||                  \\\\     \\ ; < %>%%?0                                   <~                                           \')%}                            %?,             ///    \\.                       |                      \\\\   \\       \' :\\%%%%                            \"%%0                                                1%%                         %%\`           //       \\.                      |                         \\   \\           \`)%%%%                          ]%{,                                                   \`/%                      l0|        //          \\.                    |                           \\\\\\\\              \`%&>_                         %%                                                      %                       **%%%%#!              \\ .                  |                              \\\\            ~%]\"                             %%                                                     %%                            :(%%%            \\ .                |                                 \\       \" %0                                 (%%                                                     %;           *%%%%              %%%%%%\`]      \\ .               |                                   \\  1\"%%%              %%%%%^ \' ,%%%%         %%)                                                    **        _[%%#    %%               & %+%%(%   \\ .                               ^ |[#%&%%#^%%%%%%%%%%%%l         /%%%                   /]%%0!   [%\\                                                    %~      \'%%:     //   ^%%)((#:\`  \'     ^,0%%%%%1 ,>  . }\"\'          _]\\%%%%]<1>&/,^  )%%|%%%%>             ~\\%^                               %%%%%%_                                                   _%.    }%%%%   //           [0\"  ^%%         .%%%%%/%%%%%%%]%l%%%%%#%%*                        %%%%%)%{%%?:                                         \\(                                                 . %   \'%%%%l ///                                            |                                                                                                                                          /. %1{%%%   //                                      \\.      |                                                                                                                                           .  -%%%%[!#                                         \\.     |                                                                                                                                           /.  [%%^.                                             \\.   |                                                                                                                                           /.  //.                                                \\.   |                                                                                                                                           ////                                                    \\. |                                                                                                                                           //                                                       \\.|                                                                                                                                                                                                      |                                                                                                                                                                                                                                                                                                                     aaaaaaaaaaaaaaaaa`,
      height:100,
      width :200
    },
    {
      title : 'small star',
      data :`                                                                                                                               .                                                                          .                                                                                                                                  ; :\'                                                                                                                                                                                                                                                             ;\'       ^                                                                                                                       .\'          \'                                                                                                                    :      , ^                                                                                                                                                                                                                                                         :      .                                                                                                                          \`\`                                                                                                                               \' ,         , :;                                                                                                                                                                                                                                                    \'^^     \`   ^:    \"                                                                                                             \`     \`          \' \`                                                                                                              \`   .             ,;^                                                                                                                   \'      ,      ,                                                                                                            #     .         :     :                                       [                                                                    \`  \`^ .   :   .:   \`    ::                         \'  .\'^ $ $                                                                    \`      :\'\" \"\';\"   \"       : ;ll               >   l     ! \'>-                                                                   \`\`   .     ^ \'\'   .   \`    : ,.\"\". :::^     *[ +  :      ! >                                                                        .    : \'\':   \`              : : :           .           $                                                                     :   ~\"  ,;: ;;: \' . ;      .;            \'             \' :                                                                     \` ;     ,    ,;:\`^  ; \"                                                                                                   :\":: : ,           ^\"^;;;;;\" \"              ,   \"\'   \',^      !   ..                                     ,                      ^:\`   ,:         \'   \" \`;;; ;;\";\'     l \" l  lll:l\` ll .        ....                                       :   \` :.  :  \`:    \" : ,   .\'           !\'\' \`;\`;;ll;^ :. \"     l;;ll\`\`l l!lll!         ..                                      ::\`          . ,      \'^ .                . : .^ ;;ll;;\"ll. ll : ,^lll!lll   ^                                                  : .\"^                                    \" ,<;\`\`.:;lllllllllll\"l!!!!!!l!!!!\'l,\` \`        .                                        : :                            ^!  l  ;! !,,>-:\`.:llllllllllllll!l!!!!!:;!!!l ,!       .                                              \"           .\"        :.^ ;l. \` ;;;;;;::!!;,^:;;;;;;;lllllll!ll!lll :!  ,        ..                                              ;l             ; ! .\`!  l!!!!\'\`!###>>########!#!ll!!l!!!ll!!!!!#!#>#!!l  ^   \"  ..                                                  \`\"  ,            , !!!!##########>##>ll<~!;:l!###############l,^> \'   ,      ..                                                     ;     \"  .       ^ l !!!!#!!##>###>:,_];^\':lll!l!!!!!!l!!!! l  !   ^ l  l  .                                                         \`lll           \`l  ^#^\'##>#####>::_[;\"\';lll!l!!!!!,l\'l,!!     \`     !#                                                                           \"  l !!! #>#>#>#>:,_[;\"\`:ll!!!!!!!!;!# # \"^       \'!:                                                                ;l:^\`            \`!\`,.;!#>##>>::-};,\`:l!!!!!!!!!; \`  ,       !                                                                     l\`; \"     ^    #,!^ :###>>>>>;:-};,\`:!!!!!\'!####                                                                                      \'  :          !# ^!l##>:<;:-{!,\`:!!#!##!\'!#\':        \';                                                                           # !\` \`     , .;  # <>>>><l:-}!:^;!!#!# \` #\'          ,                                                                           l#; \`.>    .  l\">>>><<<>+~l;-)!,^;!!!##!! :#                                                                                      ! .l\"            ^><<~~+<~l;_)!:^;#!####l  l                                                                                     !!    \' \`!   . \`  <<~<<<~~~!;~\!;\";####! . :                                                                                     ,\" \`         \'\':::,:::;;;;ll;;;l;;::;;;;\`;                                                                                       ;^^ :    \'  ^ll\`!l!lllll\';;:!^l;l;llllll\": \`  .                                                                                  ;, . ^     \`^\`#!ll!!:: \'\"l! !:!! : llll!l:  \`\'                                                                                     , \"  .      .!l;;ll: ;\"ll\` ll  !!;:l l ; :                                                                                       ;;   .  \'  \`:l lll    ;lll l^:^\"^\",l\`^ l, :    \"                                                                              \"; ^     \' \'^; ;;l;\'l;  \' \'  \":  :  ^\",;ll; ^    l                                                                               \"\` \":,    . \"\":,\';,\'^l           \'; l l  \';l ^   :\'.                                                                               ^^   : : : ;l:    ;     ::       \".!l  :!          ;                                                                         ::,  \`\"\`,: ::;   ;   \' ;     .       ;;      l l     ;                                                                           ::   ^   ,   , ^ :      :                     ,        l.                                                                       :,   \`     \`. ;        ,   ^,:,:,, \`   l          l     !l                                                                      ,,, :^         \"   \`             :\'\` \'   \"        , \" ^                                                                           ^     \`  .   ,   l :               ; \`,   \'           \'                                                                            \"\`          \'\"                                      ,                                                                         ,           \'.^ \";                                                                                                           ,\" \"            :\"^\"                             \'!    \`                                                                              ,   .      \'                       .                , ^l ;                                .                                   ,,         ^;;l                                                                                                                    \"   . l# ^                                                                                                                    ;!  . ,  !#                                                                                                                          ^: ,                                                                                                                                                                                                                                                                                                                                                                                          `,
      height: 65,
      width :130
    },
    {
      title : 'rose',
      data :`  ._-\\                           +....                                                  \\   \\\\                          .   \\.                         __,^._________________/_| \\=  .                        \\.   )                       ,............ ....._=-^ +{ #.  =..\\_                      .    .                ,.......          |/          /_#^ /  \\........_                .   : \"           ,^....                              _.  _-)   ---- ......_______    \\..  /         ,....                                  /__/ /            /..........\\___\\..y _,^........\`                                   ^   |/          .+     .  , \\.............------/                                                   ._     _/         ,                                                                  ,x..._;^                                                                `,
      height:10,
      width:86
    },
    {
      title:'missile',
      data:`                                 /--/+---------      .    ..                                                          |  | ........ /    \`\`\`..........                              ________________________/_/ .._....._/___\`_\`...\`\` \`\`\`....\`\` \`\`                 __--^^^  \\             _______                    \\ \`\`\`\`\`\`\`\`  \`\`\`\`\`\`     \`\`\`\`\`\`\`\`\`\`  <.........|..       ... )**====). __   __  __ - ---|  \`\`        \`              ....... ^^--;;;../ ..... .... /**====/...\\          \\-----/         ..... ............  ..           \`\`^^^\`\`\`\`\`^^^^\`\`\`\`\`\`\`\`^^T^\\\\__________\\^^\`^ \`\` ............  ....                                             \\--.-------       \`\`\`\`\`\`\`\`\`\`   \`\`                                                                          \`\`  \`\`                           `,
      height:9,
      width:86
    },
    {
      title: 'test',
      data:`                                                                                                                                                                                                                                   #  #                                               #          #                                     ###          #                                 ### /       # #                                  #  //      ###                                      /|#( (.#   ##|                               ,   ( (.#) #..  #/|                              . \\   ) )/ / . #./ /                             /// \\ /  /   /) ##  (                            ///// \\ ^  .-) ) # ) )                           ///  ///, ^/ # /  .  /                            |\\  // .=. ###/ ..  /                 .           |#\\ / /=  \\##  /    ##                  ##########|##\\ /==   \\ _) ^ #                   ##0##0####0#+###/====   \\) ^  ##7 7                 ###00###00#\\##|====== |# ) _^ 7                 \'   #####0##0#\\#|====   |## )                           #########\\|====== |#                                    ####+=======+                                                                                                                         `,
      height:25,
      width:50
    },
    {
      title: 'small house',
      data:`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             .^^.                                             //  \\\\                                            | _ #|                                            ||_|_|                                                                                                                                                                                                                                                                                                  .                                                                                                                                       `,
      height:25,
      width:50
    }
  ];

  const asciiPalettePresets = {
    symbols:`$@%&#*0/\\|()1{}[]?-_+~<>#!l;:,"^\`\'. `,
    full:`$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^\`\'. `,
    letters:`BWMoahkbdpqwmZOQLCJUYXzcvunxrjftilI `
  };

  //holds the processed jsx children
  const [divContents,setDivContents] = useState(presets[0].data);
  const [undoCanvas,setUndoCanvas] = useState(undefined);
  const [bufferCanvas,setBufferCanvas] = useState(presets[0].data);
  const [currentChar,setCurrentChar] = useState('a');
  const [activeCharIndex,setActiveCharIndex] = useState(0);
  const [backgroundColor,setBackgroundColor] = useState('#ffffff');
  const [textColor,setTextColor] = useState('#0000ff');
  const [fontSize,setFontSize] = useState(12);
  const [textSpacing,setTextSpacing] = useState(0);
  const [lineHeight,setLineHeight] = useState(1.15);
  const [canvasDimensions,setCanvasDimensions] = useState({width:presets[0].width,height:presets[0].height});
  const [textSelectable,setTextSelectable] = useState(false);
  const [asciiPalettePreset,setAsciiPalettePreset] = useState('full');
  const [asciiPalette,setAsciiPalette] = useState(asciiPalettePresets['full']);
  const [drawingMode,setDrawingMode] = useState('brush');
  const [showAbout,setShowAbout] = useState(false);
  const [showBrushPreview,setShowBrushPreview] = useState(false);
  const [escapeTextBeforeCopying,setEscapeTextBeforeCopying] = useState(true);
  const [copyTextWithLineBreaks,setCopyTextWithLineBreaks] = useState(false);
  const [blendTransparentAreas,setBlendTransparentAreas] = useState(true);
  const [advanceWhenCharacterEntered,setAdvanceWhenCharacterEntered] = useState(true);
  const [useDynamicBrush,setUseDynamicBrush] = useState(false);
  const [canvasDimensionSliders,setCanvasDimensionSliders] = useState(
    {
      width:presets[0].width,height:presets[0].height
    }
  );
  const [selectionBox,setSelectionBox] = useState({
    started : false,
    finished : false,
    startCoord : {x:0,y:0},
    endCoord : {x:0,y:0},
    movingText : false,
    moveBy : {x:0,y:0}
  });
  const [clipboardDimensions,setClipboardDimensions] = useState(undefined);
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
  const divContentsRef = useRef(divContents);
  const lineDataRef = useRef(lineData);
  const bufferCanvasRef = useRef(bufferCanvas);
  const selectionBoxRef = useRef(selectionBox);
  const canvasDimensionsRef = useRef(canvasDimensions);
  const currentCharRef = useRef(currentChar);
  const imageRendererRef = useRef(imageRenderer);
  const clipboardDimensionsRef = useRef(clipboardDimensions);
  const blendTransparentAreasRef = useRef(blendTransparentAreas);
  const undoCanvasRef = useRef(undoCanvas);
  const advanceWhenCharacterEnteredRef = useRef(advanceWhenCharacterEntered);
  const canvasDimensionSlidersRef = useRef(canvasDimensionSliders);
  //making sure the callback can access "fresh" versions of state data
  useEffect(() => {
    advanceWhenCharacterEnteredRef.current = advanceWhenCharacterEntered;
  },[advanceWhenCharacterEntered]);
  useEffect(() => {
    canvasDimensionSlidersRef.current = canvasDimensionSliders;
  },[canvasDimensionSliders]);
  useEffect(() => {
    activeCharIndexRef.current = activeCharIndex;
  }, [activeCharIndex]);
  useEffect(()=>{
    blendTransparentAreasRef.current = blendTransparentAreas;
  },[blendTransparentAreas]);
  useEffect(()=>{
    clipboardDimensionsRef.current = clipboardDimensions;
  },[clipboardDimensions]);
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
    undoCanvasRef.current = undoCanvas;
  },[undoCanvas]);
  useEffect(() => {
    imageRendererRef.current = {
      imageLoaded:imageRenderer.imageLoaded,
      gamma:imageRenderer.gamma,
      contrast:imageRenderer.contrast,
      imageSrc:imageRenderer.imageSrc,
      needToReload:imageRenderer.needToReload
    };
  },[imageRenderer]);
  //add keypress event handlers, but only once
  useEffect(() => {
    window.document.addEventListener('keydown', handleKeyPress);
    return () => {
      window.document.removeEventListener('keydown', handleKeyPress);
    }
  }, []);

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

  function undo(){
    const undoCanv = undoCanvasRef.current;
    if(undoCanv === undefined)
      return;
    setDivContents(undoCanv.canvas);
    setCanvasDimensions(undoCanv.dimensions);
    setCanvasDimensionSliders(undoCanv.dimensions);
    setUndoCanvas({
      canvas:divContentsRef.current,
      dimensions:canvasDimensionsRef.current
    });
  }

  function copyText(data,dimensions){
    //if there's a selection box, copy from that instead
    const selBox = selectionBoxRef.current;
    if(selBox.finished){
      const topL = {x:Math.min(selBox.startCoord.x,selBox.endCoord.x),y:Math.min(selBox.startCoord.y,selBox.endCoord.y)};
      const bottomR = {x:Math.max(selBox.startCoord.x,selBox.endCoord.x),y:Math.max(selBox.startCoord.y,selBox.endCoord.y)};
      data = copyArea(selBox.startCoord,selBox.endCoord,data,dimensions.width,' ').data;
      dimensions = {width:bottomR.x-topL.x,height:bottomR.y-topL.y};
    }
    if(escapeTextBeforeCopying)
      data = escapeTextData(data);
    if(copyTextWithLineBreaks)
      data = addLineBreaksToText(data,dimensions);
    setClipboardDimensions(dimensions);
    navigator.clipboard.writeText(data);
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
    setDivContents(text);
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
    const outputDimensions = {width:canvasDimensions.width,height:canvasDimensions.height};

    const palette = asciiPalette;
    if(palette.length === 0){
      let warningString = '[no character palette to raster with]';
      warningString = warningString.padEnd(outputDimensions.width*outputDimensions.height,' ');
      setDivContents(warningString);
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
    setDivContents(newStr);
  };

  function convertImageToAscii(src){
    if(typeof src === "string"){
      const img = new Image;
      img.onload = function() {
        convertImage(this);
      };
      img.src = src;
      setImageRenderer({
        imageLoaded:true,
        gamma:imageRenderer.gamma,
        contrast:imageRenderer.contrast,
        imageSrc:src,
        needToReload:false
      });
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

  function resizeCanvas(newDims,data){
    const originalDims = canvasDimensionsRef.current;
    let newString = '';
    for(let r = 0; r<Math.min(originalDims.height,newDims.height); r++){
      //get the original row
      let rowString = data.substring(r*originalDims.width,(r+1)*originalDims.width);
      if(newDims.width<originalDims.width)
        rowString = rowString.substring(0,newDims.width);
      else
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

    setUndoCanvas({
      canvas:bufferCanvas,
      dimensions:canvasDimensionsRef.current
    });
  }

  function getClickIndex(e){
    const coords = getClickCoords(e);
    return coords.x+canvasDimensions.width*coords.y;
  }

  function getClickCoords(e){
    const clickCoords = {
      x:e.pageX - e.target.offsetParent.offsetLeft,
      y:e.pageY - e.target.offsetParent.offsetTop
    };
    //px per char
    const characterDims = {
      width : e.target.clientWidth / canvasDimensions.width,
      height : e.target.clientHeight / canvasDimensions.height,
    };

    return {x: Math.trunc(clickCoords.x/characterDims.width),y:Math.trunc(clickCoords.y/characterDims.height)};
  }

  function handleMouseUp(e){

    //set the cursor on the index where the mouse was released
    setActiveCharIndex(getClickIndex(e));

    switch(drawingMode){
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
        endCoord : getClickCoords(e),
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
        endCoord : getClickCoords(e),
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
      const coords = getClickCoords(e);
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
          setBufferCanvas(divContents);
          setUndoCanvas({
            canvas:divContents,
            dimensions:canvasDimensionsRef.current
          });
        }
        return;
      }
    }
    //starting selectionbox
    if(e.shiftKey){
      const newBox = {
        started : true,
        finished : false,
        startCoord : getClickCoords(e),
        endCoord : getClickCoords(e),
        movingText : false,
        moveBy : {x:0,y:0}
      };
      setSelectionBox(newBox);
      //store this version of div contents
      setBufferCanvas(divContents);
    }
    else{
      const newIndex = getClickIndex(e);
      switch(drawingMode){
        case 'line':
          //start drawing a line
          startLine(newIndex);
          break;
        case 'brush':
          const coords = getClickCoords(e);
          // don't draw a character yet, until the mouse is moved
          setBrushData({
            drawing:true,
            brushSize: brushData.brushSize,
            brush: brushData.brush,
            lastCoordinate:coords
          });
          setUndoCanvas({
            canvas:divContents,
            dimensions:canvasDimensionsRef.current
          });
          break;
      }
      //cancel the selection box, if there was one
      const newBox = {
        started : false,
        finished : false,
        startCoord : getClickCoords(e),
        endCoord : getClickCoords(e),
        movingText : false,
        moveBy : {x:0,y:0}
      };
      setSelectionBox(newBox);
    }
  }
  function handleMouseMove(e){
    const newIndex = getClickIndex(e);
    const canvDims = canvasDimensionsRef.current;
    const coords = getClickCoords(e);
    switch(drawingMode){
      case 'line':
        //changing line position
        if(lineData.begun){
          //if the index didn't change, you haven't moved
          if(newIndex === lineData.startIndex){
            return;
          }
          const tempCanvas = bufferCanvas;
          const start = {x:lineData.startIndex%canvasDimensions.width,y:Math.trunc(lineData.startIndex/canvasDimensions.width)};          
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
        break;
      case 'brush':
        if(brushData.drawing){
          let brushSize = brushData.brushSize;
          if(brushData.lastCoordinate !== undefined && useDynamicBrush){
            const distX = brushData.lastCoordinate.x - coords.x;
            const distY = brushData.lastCoordinate.y - coords.y;
            //usually, dist is between 1 and 2
            const distance = Math.sqrt((distX*distX)+(distY*distY));
            //map distance to a thickness (from 0, brushSize)
            brushSize = Math.max(Math.trunc(map_range(distance,0,20,brushSize,0)),0);
          }
          //if there's no other coordinate, just fill circles
          if(brushData.lastCoordinate === undefined){
            setDivContents(fillCircle(coords.x,coords.y,brushSize,currentChar,divContents,canvasDimensions));
          }
          else{
            setDivContents(drawCirclesAlongPath({x:brushData.lastCoordinate.x,y:brushData.lastCoordinate.y},{x:coords.x,y:coords.y},brushSize,currentChar,divContents,canvasDimensions));
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
          endCoord : getClickCoords(e),
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
          endCoord : getClickCoords(e),
          movingText : false,
          moveBy : {x:selectionBox.moveBy.x,y:selectionBox.moveBy.y}
        };
      }
      setSelectionBox(newBox);
    }
    //moving/shifting area
    else if(selectionBox.movingText){
      const coords = getClickCoords(e);
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
      setDivContents(shiftArea(newBox,newBox.moveBy,bufferCanvas,canvDims.width,true));
    }
  }

  function writeCharacter(index,char,data){
    return data.substring(0,index)+char+data.substring(index+1);
  }
  function writeCharacterXY(x,y,char,data,canvDims){
    //check bounds
    if((x < 0) || (x >= canvDims.width) || (y < 0) || (y >= canvDims.height))
      return data;
    return writeCharacter(x+y*canvDims.width,char,data);
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

  function fillCircleHelper(x0, y0, r, corners, delta, c, data, dims) {
    
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
          data = drawFastVLine(x0 + x, y0 - y, 2 * y + delta, c, data, dims);
        if (corners & 2)
          data = drawFastVLine(x0 - x, y0 - y, 2 * y + delta, c, data, dims);
      }
      if (y != py) {
        if (corners & 1)
          data = drawFastVLine(x0 + py, y0 - px, 2 * px + delta, c, data, dims);
        if (corners & 2)
          data = drawFastVLine(x0 - py, y0 - px, 2 * px + delta, c, data, dims);
        py = y;
      }
      px = x;
    }
    return data;
  }

  function drawFastVLine(x,y,height,c,data,dims){
    for(let i = 0; i<height; i++){
      data = writeCharacterXY(x,y+i,c,data,dims);
    }
    return data;
  }

  function fillCircle(x0,y0,r,c,data,dims){
    data = drawFastVLine(x0, y0 - r, 2 * r + 1, c, data, dims);
    data = fillCircleHelper(x0, y0, r, 3, 0, c, data, dims);
    return data;
  }

  function drawLine(start,end,char,canvas){
    const canvDims = canvasDimensionsRef.current;
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
        canvas = writeCharacter(x*canvDims.width+y, char, canvas);
      } else {
        canvas = writeCharacter(y*canvDims.width+x, char, canvas);
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
        data = writeCharacter(i*canvasDimensions.width+colIndex,data.charAt((i-1)*canvasDimensions.width+colIndex),data);
      }
      data = writeCharacter(rowIndex*canvasDimensions.width+colIndex,' ');
    }
    else{
      for(let i = rowIndex; i<(canvasDimensions.height-1); i++){
        data = writeCharacter(i*canvasDimensions.width+colIndex,data.charAt((i+1)*canvasDimensions.width+colIndex),data);
      }
    }
    setDivContents(data);
  }
  //draws circles along a path!
  function drawCirclesAlongPath(A,B,radius,character,data,dimensions){
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
      return drawLine({x:start.x,y:start.y},{x:end.x,y:end.y},character,data);
    }

    //if it's a vertical line, don't use the line slope
    if(start.x == end.x){
      for(let step = start.y; step<end.y; step+=(radius/2)){
        const x = start.x;
        const y = Math.trunc(step);
        data = fillCircle(x,y,radius,character,data,dimensions);
      }
      return data;
    }
    //if it's a horizontal line
    else if(start.y == end.y){
      for(let step = start.x; step<end.x; step+=(radius/2)){
        const x = Math.trunc(step);
        const y = start.y;
        data = fillCircle(x,y,radius,character,data,dimensions);
      }
      return data;
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
        data = fillCircle(x,y,radius,character,data,dimensions);
      }
      return data;
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
    const blend = blendTransparentAreasRef.current;
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
      setDivContents(newCanv);
      setSelectionBox(
        {
          startCoord:{x:selection.startCoord.x,y:selection.startCoord.y},
          endCoord:{x:selection.endCoord.x,y:selection.endCoord.y},
          started : selection.started,
          finished : selection.finished,
          movingText : selection.movingText,
          moveBy : {x:selection.moveBy.x+direction.x,y:selection.moveBy.y+direction.y}
        }
      );
      return true;
    }
    return false;
  }

  function clearCanvas(){
    let canvasData=``;
    canvasData = canvasData.padStart(canvasDimensionsRef.current.height*canvasDimensionsRef.current.width,' ');
    setDivContents(canvasData);
  }

  function handleKeyPress(e){

    if(textSelectable)
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
    let textData = divContentsRef.current;
    const line = lineDataRef.current;
    const bufCanvas = bufferCanvasRef.current;
    const selection = selectionBoxRef.current;
    const canvDims = canvasDimensionsRef.current;
    const canvDimSliders = canvasDimensionSlidersRef.current;
    const advanceOnPress = advanceWhenCharacterEnteredRef.current;

    //janky way to see if it's a letter
    if(e.key.length === 1){
      if(e.key == 'x'){
        if(e.metaKey){
          cutText(textData,canvDims);
          return;
        }
      }
      if(e.key == 'z'){
        if(e.metaKey){
          undo();
          return;
        }
      }
      else if(e.key == 'c'){
        //copy text to clipboard
        if(e.metaKey){
          copyText(textData,canvDims);
          return;
        }
      }
      //if ctrl v, and if there's something on the clipboard
      else if(e.key == 'v'){
        if(e.metaKey){
          pasteClipboardContents();
          return;
        }
      }
      //clear all with ctr+slash, ctrl+backspace is handled in backspace handler
      else if((e.key == '/' || e.key == '\\')&&e.metaKey){
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
        //if selbox, fill the area
        if(selection.started || selection.finished){
          let newData = cutAreaAndFill(selection.startCoord,selection.endCoord,textData,canvDims.width,e.key);
          setDivContents(newData.data);
          setCurrentChar(e.key);
          return;
        }
        //write the character
        setDivContents(writeCharacter(index,e.key,textData));
        if(advanceWhenCharacterEnteredRef.current && index < (canvDims.width*canvDims.height-1)){
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
      if(e.metaKey){
        clearCanvas();
        return;
      }
      setDivContents(writeCharacter(index,' ',textData));
      if(advanceWhenCharacterEnteredRef.current && index > 0){
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
        setDivContents(resizeCanvas({width:canvDimSliders.width,height:canvDimSliders.height},textData));
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
  function addLineBreaksToText(data,dimensions){
    let finalString = '';
    for(let row = 0; row<dimensions.height; row++){
      finalString += data.substring(row*dimensions.width,(row+1)*dimensions.width)+'\n';
    }
    return finalString;
  }

  const keyboardShortcutStyle = {
    // marginLeft:'40px',
    fontFamily:'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    color:"#ffee00ff"
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

  const ascii_rose = <div className = "ascii_graphics" style = {{fontSize:'6px',margin:'auto',paddingTop:'20px',color:'#ff00ff'}}>{` ._-\\                           +....                                                 
 \\   \\\\                          .   \\.                         __,^._________________
/_| \\=  .                        \\.   )                       ,............ ....._=-^ 
+{ #.  =..\\_                      .    .                ,.......          |/          
/_#^ /  \\........_                .   : \"           ,^....                            
  _.  _-)   ---- ......_______    \\..  /         ,....                                
  /__/ /            /..........\\___\\..y _,^........\`                                  
 ^   |/          .+     .  , \\.............------/                                    
               ._     _/         ,                                                    
              ,x..._;^                                                                `}</div>
  const ascii_rocket = <div className = "ascii_graphics" style = {{fontSize:'6px',margin:'auto',paddingTop:'20px',color:'#ff00ff'}}>
{`                                 /--/+---------      .    ..                          
                                |  | ........ /    \`\`\`..........                      
        ________________________/_/ .._....._/___\`_\`...\`\` \`\`\`....\`\` \`\`                
 __--^^^  \\             _______                    \\ \`\`\`\`\`\`\`\`  \`\`\`\`\`\`     \`\`\`\`\`\`\`\`\`\`  
<.........|..       ... )**====). __   __  __ - ---|  \`\`        \`              .......
 ^^--;;;../ ..... .... /**====/...\\          \\-----/         ..... ............  ..   
         \`\`^^^\`\`\`\`\`^^^^\`\`\`\`\`\`\`\`^^T^\\__________\\^^\`^ \`\` ............  ....             
                                \\--.-------       \`\`\`\`\`\`\`\`\`\`   \`\`                     
                                                     \`\`  \`\`                           
`}</div>

  const aboutText = (
    <>
    {ascii_rose}
    +---------------------------------------------------------------------+
    <div style = {{marginLeft:'10px',marginTop:'10px'}}>
    This is a sketchbook designed for experimenting with monospace text. I use it for drawing and for writing. The sketchbook is raw HTML text which can be copied or pasted into from other sources.
    </div>
    <br></br>
    +---------------------------------------------------------------------+
    {ascii_rocket}
    <br></br>
    <div style = {{marginLeft:"10px"}}>
    <span style = {keyboardShortcutStyle}>the basics</span><br></br>
    Typing text enters it into the canvas at the cursor location. The cursor can be moved by clicking, the arrow keys, or by typing if 'advance cursor when typing' is ticked.
    <br></br><br></br>
    Shift clicking+dragging will create a selection box, which can be cut, copied, moved with the arrow keys, or dragged with the mouse. By default, whitespaces will be treated as "transparent" when moving or pasting text, but can be preserved by unticking "blend transparent areas."
    </div>
    <br></br>
    <div style = {{marginLeft:"10px"}}>
    <span style = {keyboardShortcutStyle}>drawing</span><br></br>
    </div>
    <div style = {{marginLeft:"40px"}}>
    The character drawn is the last character pressed, show in the top left display box.<br></br><br></br>
    <span style = {keyboardShortcutStyle}>Brush</span> ~ draw freehand lines by dragging the mouse. Brush thickness can be changed with the slider. Tick 'dynamic brush' to draw lines that resize thickness based on mouse speed.<br></br>
    <span style = {keyboardShortcutStyle}>Lines</span> ~ draw straight lines by dragging the mouse.<br></br>
    <span style = {keyboardShortcutStyle}>Images</span> ~ render an image to the canvas with the 'render image' button, or by pasting an image from the clipboard. You can control image contrast, brightness, and the character pallette used to render the image.<span style = {keyboardShortcutStyle}> Uploading or changing image settings will always overwrite the current canvas! </span><br></br>
    </div>
    +---------------------------------------------------------------------+
    <br></br>
    <div style = {{marginLeft:"10px"}}>
    <span style = {keyboardShortcutStyle}>shortcuts</span><br></br>
    </div>    <div style = {{marginLeft:"40px"}}>
    <span style = {keyboardShortcutStyle}>Cmd+A</span>.....select all<br></br>
    <span style = {keyboardShortcutStyle}>Cmd+A</span>.....undo<br></br>
    <span style = {keyboardShortcutStyle}>Cmd+X</span>.....cut selected area<br></br>
    <span style = {keyboardShortcutStyle}>Cmd+C</span>.....copy selected area<br></br>
    <span style = {keyboardShortcutStyle}>Cmd+V</span>.....paste clipboard<br></br>
    <span style = {keyboardShortcutStyle}>Cmd+Backspace or /</span>...clear Canvas<br></br>
    <span style = {keyboardShortcutStyle}>Backspace</span>...delete character<br></br>
    <span style = {keyboardShortcutStyle}>Arrow keys</span>...move cursor or translate selected text<br></br>
    <span style = {keyboardShortcutStyle}>Arrow keys + Shift</span>...translate row/column<br></br>
    <span style = {keyboardShortcutStyle}>Enter</span>...move cursor down a line<br></br>
    <span style = {keyboardShortcutStyle}>Enter+Shift</span>...insert blank line<br></br>
    </div>
    {/* Understanding technology as a physical, human, inherently political resource--as opposed to the neutral, fingerprint-less identity most tech companies portray it as--limits our ability to conceptualize the labor, violence, and natural resources that go into producing, maintaining, and integrating ourselves with technology. */}
    <br></br>
    {/* Missile guidance systems are written with the same alphabet, the same text encoding, and stored in the same ascii format as what you create on this page. Abstracting technology from its physical reality is a strategy for depersonifying the people targeted by it, and alleviating the consequences for those who develop it. */}
    {/* <br></br> */}
    {/* {ascii_rose}                                                      */}

    <br></br>
    <span style = {{marginLeft:'10px'}}>
    made by <a style = {{color:"#ffee00ff"}}href = "https://alexlafetra.github.io">alex lafetra</a> summer 2025
    </span>
    </>
  )
  
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
    height:String(Math.abs(selectionBox.startCoord.y - selectionBox.endCoord.y)*lineHeight)+'em',
    left:(Math.min(selectionBox.startCoord.x,selectionBox.endCoord.x)+selectionBox.moveBy.x) + 'ch',
    top:String((Math.min(selectionBox.startCoord.y,selectionBox.endCoord.y)+selectionBox.moveBy.y)*lineHeight) + 'em',
    lineHeight:lineHeight,
    letterSpacing:textSpacing+'px',
    fontSize:fontSize+'px',
    borderColor:textColor,
    zIndex:'0',
    position:'absolute',
    borderStyle:'dashed',
    borderWidth:'1px',
    fontFamily:'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    backgroundColor:'#ffff00'
  }

  const resizePreviewStyle = {
    width:String(canvasDimensionSliders.width)+'ch',
    height:String((canvasDimensionSliders.height)*lineHeight)+'em',
    left:'0',
    top:'0',
    // borderColor:textColor,
    lineHeight:lineHeight,
    letterSpacing:textSpacing+'px',
    fontSize:fontSize+'px',
    zIndex:0,
    position:'absolute',
    borderStyle:'dashed',
    borderWidth:'1px',
    pointerEvents:'none',
    fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  }

  const highlightBoxStyle = {
    width:'1ch',
    height: lineHeight+'em',

    left: String(activeCharIndex%canvasDimensions.width) + 'ch',
    top: String(Math.trunc(activeCharIndex/canvasDimensions.width)*lineHeight)+'em',
    lineHeight:lineHeight,
    letterSpacing:textSpacing+'px',
    fontSize:fontSize+'px',
    position:'absolute',
    animation: 'blinkBackground 0.5s infinite'
  };

  const canvasContainerStyle = {
    width:'fit-content',
    height:'fit-content',
    lineHeight:lineHeight,
    letterSpacing:textSpacing+'px',
    marginTop: '120px',
    position:'relative',
    whiteSpace: 'pre',
    fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
  }

  const canvasStyle = {
    userSelect : textSelectable?'text':'none',

    cursor:textSelectable?'text':(selectionBox.finished?'grab':'pointer'),

    fontSize:fontSize+'px',
    color:textColor,
    backgroundColor:'transparent',
    width:'fit-content',
    // width: canvasDimensions.width+'ch',
    lineHeight:lineHeight,
    letterSpacing:textSpacing+'px',
  }

  const brushPreviewStyle = {
    width:(brushData.brushSize*2)+'ch',
    whiteSpace:'pre',
    fontSize:fontSize+'px',
    color:textColor,
    backgroundColor:'transparent',
    lineHeight:lineHeight,
    letterSpacing:textSpacing+'px',
    marginLeft:'20px',
    direction: 'rtl'
  }

  const backgroundStyle = {
    color:'#000000',
    backgroundColor:backgroundColor,
    top:'-'+String(lineHeight)+'em',
    fontSize:fontSize+'px',
    width: canvasDimensions.width+2+'ch'
  };

  const loadImage = (file) => {
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
      let canv = createBackground({width:size*2+1,height:size*2+1});
      canv = fillCircle(size+1,size+1,size,currentChar,canv,{width:size*2+3,height:size*2+3});
      return canv;
    }
  }


  function pasteText(clipText,clipTextDims,coords,data,dimensions){
    let newData = '';
    //grab up until first row
    newData = data.substring(0,dimensions.width*coords.y);
    for(let y = 0; y<clipTextDims.height; y++){
      const rowStart = dimensions.width*(coords.y+y);
      const rowEnd = rowStart+dimensions.width;
      const pasteStart = rowStart+coords.x;
      const pasteEnd = Math.min(pasteStart+clipTextDims.width,rowEnd);
      //get a row from the clipboard
      let pasteRow = clipText.substring(y*clipTextDims.width,(y+1)*clipTextDims.width,dimensions.width+y*clipTextDims.width);
      
      //overlaying blank characters, like they're transparent
      if(blendTransparentAreasRef.current){
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
      const pasteFinal = pasteRow.substring(0,Math.min(dimensions.width-coords.x,clipTextDims.width+coords.x));
      newData += data.substring(rowStart,pasteStart)+pasteFinal+data.substring(pasteEnd,rowEnd);
    }
    newData += data.substring(dimensions.width*(coords.y+clipTextDims.height));
    return newData;
  }

  //grabs any text, or images, in the users clipboard and puts them onto the canvas
  //https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/read
  async function pasteClipboardContents(){
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
          const canvDims = canvasDimensionsRef.current;
          const canvasText = divContentsRef.current;
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
          const coords = {x:activeChar%canvDims.width,y:Math.trunc(activeChar/canvDims.width)};
          setDivContents(pasteText(text,dimensions,coords,canvasText,canvDims));
        }
      }
    }
  }

  function nullHandler(e){

  }

  if(imageRenderer.imageLoaded && imageRenderer.needToReload){
    convertImageToAscii(imageRenderer.imageSrc);
  }

  return (
    <div className = "app_container">
      {showAbout && <div className = "about_text" style = {aboutTextStyle}>{aboutText}</div>}
      <div style = {titleContainer}>
      <div className = 'title_card' style = {titleStyle} >{'sketchbook'}</div>
      <div className = 'help_text' style = {{textDecoration:'underline',color:'#0000ff',cursor:'pointer',width:'fit-content',marginLeft:'200px'}} onClick = {(e) => {setShowAbout(!showAbout)}}>{showAbout?'[Xx close xX]':'About'}</div>
      </div>
      {/* controls */}
      <div className = "ui_container" style = {{display:'block'}}>
        {ascii_rose}
        <div className = 'ascii_display' style = {asciiDisplayStyle} >{currentChar === ' '?'{ }':currentChar}</div>
        {/* <div className = 'help_text'>cursor: (x:{activeCharIndex%canvasDimensions.width} y:{Math.trunc(activeCharIndex/canvasDimensions.width)})</div> */}
        <div className = 'ascii_button' onClick = {(e) => {setTextSelectable(!textSelectable)}}>selectable text [{textSelectable?'X':' '}]</div>
        {textSelectable && 
          <div className = 'help_text' style ={{color:'#ff0000'}}>(cmd+a) select all</div>
        }
        {!textSelectable && <>
        <div className = 'ascii_button' onClick = {(e) => {setAdvanceWhenCharacterEntered(!advanceWhenCharacterEntered)}}>advance cursor when typing [{advanceWhenCharacterEntered?'X':' '}]</div>
        <Dropdown label = 'drawing mode' callback = {(val) => {setDrawingMode(val);}} value = {drawingMode} options = {['line','brush']}></Dropdown>
        {drawingMode == 'brush' &&
        <>
          <Slider maxLength = {10} label = {'brush radius'} stepsize = {1} onMouseEnter = {() => setShowBrushPreview(true)} onMouseLeave = {() => setShowBrushPreview(false)}  callback = {(val) => {setBrushData({lastCoordinate:brushData.lastCoordinate,drawing:brushData.drawing,brushSize:parseInt(val),brush:getBrushCanvas(parseInt(val))});}} value = {brushData.brushSize} defaultValue={brushData.brushSize} min = {0} max = {10}></Slider>
          <div className = 'ascii_button' onClick = {() => {setUseDynamicBrush(!useDynamicBrush)}}>{'dynamic brush ['+(useDynamicBrush?'x':' ')+']'}</div>
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
                                                            cutText(textData,canvDims);
                                                            }}}>cut (cmd+x)</div>
        <div className = "ascii_button" style ={{color:'#ff0000'}} onClick = {(e) => {if(selectionBox.started || selectionBox.finished){
                                                            copyText(textData,canvDims);
                                                            }}}>copy (cmd+c)</div>
        </>}
        {/* paste button, when there's something to paste */}
        {(clipboardDimensions !== undefined) && 
          <div className = "ascii_button" style ={{color:'#ff0000'}} onClick = {(e) => {
                                                          pasteClipboardContents();
                                                          }}>paste (cmd+v)</div>
        }
        {/* overlay white space */}
        <div className = 'ascii_button' onClick = {() => {setBlendTransparentAreas(!blendTransparentAreas)}}>{'blend transparency ['+(blendTransparentAreas?'X':' ')+']'}</div>
        <NumberInput name = "width" value = {canvasDimensionSliders.width} min = {1} max = {1024} buttonCallback = {(val) => {setDivContents(resizeCanvas({width:val,height:canvasDimensions.height},divContents));setCanvasDimensionSliders({width:val,height:canvasDimensionSliders.height})}} inputCallback = {(val) =>{setCanvasDimensionSliders({width:val,height:canvasDimensionSliders.height})}}></NumberInput>
        <NumberInput name = "height" value = {canvasDimensionSliders.height} min = {1} max = {1024} buttonCallback = {(val) => {setDivContents(resizeCanvas({width:canvasDimensions.width,height:val},divContents));setCanvasDimensionSliders({width:canvasDimensionSliders.width,height:val})}} inputCallback = {(val) =>{setCanvasDimensionSliders({height:val,width:canvasDimensionSliders.width})}}></NumberInput>
        { (canvasDimensionSliders.width != canvasDimensions.width || canvasDimensionSliders.height != canvasDimensions.height) &&
          <div className = "ascii_button" onClick = {(e) =>{setDivContents(resizeCanvas({width:canvasDimensionSliders.width,height:canvasDimensionSliders.height},divContents))}} style = {{color:'#0000ff'}}>[enter] apply</div>
        }
        <Dropdown label = 'page# (previous drawings):' callback = {(val) => {const newPreset = presets.find((element) => element.title === val);setDivContents(newPreset.data);setCanvasDimensions({height:newPreset.height,width:newPreset.width});setCanvasDimensionSliders({height:newPreset.height,width:newPreset.width})}} options = {presets.map((n) => n.title)}></Dropdown>
        {/* copy text to clipboard*/}
        <div className = "ascii_button" onClick = {(e) => {copyText(divContents,canvasDimensions)}}>copy drawing to clipboard</div>
        {/* copy settings */}
        <div className = "ascii_button" onClick = {(e) => {setCopyTextWithLineBreaks(!copyTextWithLineBreaks);}}>{'  line breaks ['+(copyTextWithLineBreaks?'X]':' ]')}</div>
        <div className = "ascii_button" onClick = {(e) => {setEscapeTextBeforeCopying(!escapeTextBeforeCopying);}}>{'  escape text ['+(escapeTextBeforeCopying?'X]':' ]')}</div>
        {/* paste text to canvas from clipboard */}
        <div className = "ascii_button" onClick = {(e) => {pasteClipboardContents()}}>paste drawing from clipboard</div>
        {/* clear canvas */}
        <div className = "ascii_button" onClick = {(e) => {clearCanvas();}}>clear canvas</div>
        <ColorPicker label = 'background color' backgroundColor = {backgroundColor} textColor = {'#000000'} defaultValue={backgroundColor} callback = {(e) => {setBackgroundColor(e);}}></ColorPicker>
        <ColorPicker label = 'text color'  textColor = {textColor} backgroundColor = {'transparent'} defaultValue={textColor} callback = {(e) => {setTextColor(e);}}></ColorPicker>
        
        <Slider maxLength = {20} label = {'font size'} stepsize = {1} callback = {(val) => {setFontSize(val)}} defaultValue={fontSize} min = {1} max = {20}></Slider>
        <Slider maxLength = {20} label = {'horizontal spacing'} stepsize = {0.1} callback = {(val) => {setTextSpacing(val)}} defaultValue={textSpacing} min = {-4} max = {4}></Slider>
        <Slider maxLength = {20} label = {'vertical spacing'} stepsize = {0.01} callback = {(val) => {setLineHeight(val)}} defaultValue={lineHeight} min = {0.1} max = {2}></Slider>
     
        <FilePicker title = 'render image' callback = {(val) => {loadImage(val);}}></FilePicker>
        {imageRenderer.imageLoaded &&
        <>
        <img className = "image_preview" src = {imageRenderer.imageSrc}/>
        <AsciiPaletteInput value = {asciiPalette} callback = {(val) => {setAsciiPalette(val);setImageRenderer({...imageRenderer,needToReload:true})}} ></AsciiPaletteInput>
        <Dropdown label = 'palette presets:' callback = {(val) => {setAsciiPalettePreset(val);setAsciiPalette(asciiPalettePresets[val]);setImageRenderer({imageLoaded:imageRenderer.imageLoaded,gamma:imageRenderer.gamma,contrast:imageRenderer.contrast,imageSrc:imageRenderer.imageSrc,needToReload:true});}} value={asciiPalettePreset} options = {['full','symbols','letters']}></Dropdown>
        <Slider maxLength = {20} label = {'image brightness'} stepsize = {0.1} callback = {(val) => {setImageRenderer({imageLoaded:imageRenderer.imageLoaded,gamma:(4.0 - val),contrast:imageRenderer.contrast,imageSrc:imageRenderer.imageSrc,needToReload:true});}} defaultValue={imageRenderer.gamma} min = {0.0} max = {4.0}></Slider>
        <Slider maxLength = {20} label = {'image contrast'} stepsize = {0.1} callback = {(val) => {setImageRenderer({imageLoaded:imageRenderer.imageLoaded,gamma:imageRenderer.gamma,contrast:val,imageSrc:imageRenderer.imageSrc,needToReload:true});}} defaultValue={imageRenderer.contrast} min = {0.0} max = {2.0}></Slider>
        </>
        }
        {/* {ascii_rocket} */}
        </>}
        {/* brush preview */}
        {showBrushPreview &&  
        <div style = {brushPreviewStyle}>
          {addLineBreaksToText(getBrushCanvas(brushData.brushSize),{width:brushData.brushSize*2+3,height:brushData.brushSize*2+3})}
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
        {(canvasDimensionSliders.width != canvasDimensions.width || canvasDimensionSliders.height != canvasDimensions.height) &&
          <div className = "resize_preview_box" style = {resizePreviewStyle}/>
        }
        <div className = "highlight_box" style = {highlightBoxStyle}/>
        <div className = "ascii_canvas" onMouseMove = {textSelectable?nullHandler:handleMouseMove} onMouseDown = {textSelectable?nullHandler:handleMouseDown} onMouseUp = {textSelectable?nullHandler:handleMouseUp}  style = {canvasStyle}>
          {addLineBreaksToText(divContents,canvasDimensions)}
        </div>
        <div className = "canvas_background" style = {backgroundStyle}>
          {addLineBreaksToText(createBackground(canvasDimensions),{width:canvasDimensions.width+2,height:canvasDimensions.height+2})}
        </div>
      </div>
    </div>
  )
}

export default App