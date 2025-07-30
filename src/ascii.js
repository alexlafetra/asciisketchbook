class AsciiRenderer{
    constructor(settings){
        this.settings = settings;
        this.currentText = settings.displayText;
        this.p5 = this.settings.p5Inst;
        this.mainCanvas = this.settings.mainCanvas;
    }
}

export default AsciiRenderer