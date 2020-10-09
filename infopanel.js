function InfoPanel (game,  x, y, width, height, font, textColour, defaultText) {
    //https://phaser.io/examples/v3/view/game-objects/text/static/speech-bubble
    // https://phaser.io/examples/v2/text/text-line-spacing
    //https://phaser.io/docs/2.6.2/Phaser.Graphics.html
    var backgroundColour = 'rgba(255,255,255,0)';

    this.defaultText = defaultText;
    var graphics = game.add.graphics(x,y);

   
    
    graphics.lineStyle(2, 0xc9c9c9, 1); //grey
    //This got me confgused, the x,y is relative to graphics
    graphics.drawRoundedRect( 0, 0, width, height);
   
    this.SetText = function(text){
        this.message.text = this.defaultText + text;
        while(this.message.height > height){
            text = removeWordsFromStart(text, 5)
            this.message.text = this.defaultText + text;
        }
        //Return input text that may have been shortened
        return text;
    }
    function removeWordsFromStart(text, numberWords){
        var shorter = text.split(' ').slice(numberWords).join(' ');
        return  shorter

    }
    
    this.message = game.add.text(x+5, y+5, this.defaultText,  { font: font, fill: textColour,
                                                                backgroundColor: backgroundColour,
                                                                wordWrap: true, wordWrapWidth: width});
    //this.message.lineSpacing = 40;
}