function InfoPanel (game,  x, y, width, height, font, textColour, defaultText, drop) {
    //https://phaser.io/examples/v3/view/game-objects/text/static/speech-bubble
    // https://phaser.io/examples/v2/text/text-line-spacing
    //https://phaser.io/docs/2.6.2/Phaser.Graphics.html
    var backgroundColour = 'rgba(255,255,255,0)';
    this.drop = drop;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.defaultText = defaultText;
    this.messageContent = "";
    this.letters = [];
    var graphics = game.add.graphics(x,y);

   
    
    graphics.lineStyle(2, 0xc9c9c9, 1); //grey
    //This got me confgused, the x,y is relative to graphics
    graphics.drawRoundedRect( 0, 0, width, height);
   
    this.GetLiveLetters = function(){
        //Get letter rather than sprite
        var living = [];
        for (var i=0;i<this.letters.length;i++){
            if (this.letters[i].alive){
                let letterCopy = Object.assign({}, ALPHABET_DICTIONARY[this.letters[i].name]);
                living.push(letterCopy);
            }
        }
        return living;
    }
    this.CanIDropLetter = function (point, letterSprite){
         //Can always drop a letter back in panel if letter over panel and panel supports drop
         if(point.x > (this.x + this.width) || point.x < this.x || point.y > (this.y + this.height) || point.y < this.y){
            return false
        }
        return this.drop;
    }
    this.RemoveLetter = function(letterSprite){
        for (var i=0;i<this.letters.length;i++){
            if (letterSprite == this.letters[i]){
                this.letters.splice(i,1);
                console.log("Removing a letter from panel:" + letterSprite.key)
                this.logCurrentLetters();
                return
            }
        }
        return;
    }
    this.DropLetter = function(point, letterSprite){
        if (this.CanIDropLetter(point, letterSprite)){
            console.log("Dropping letter on panel:" + letterSprite.key);
            //Letter can be moved around alot so only add if not added already
            if (!this.isLetterOnPanel(letterSprite)) this.letters.push(letterSprite);
            this.logCurrentLetters();
        }
    }
    this.isLetterOnPanel= function(letterSprite){
        for (var i=0;i<this.letters.length;i++){
            if (letterSprite == this.letters[i]) return true;
        }
        return false
    } 
    this.logCurrentLetters = function(){
        var text = "Current letters on panel: "
        for (var i=0;i<this.letters.length;i++){
            text += this.letters[i].key + " ";
        }
        console.log(text);
    }
    this.SetText = function(text){
        //Call this to set text if don't know if text too big
        this.message.text = this.defaultText + text;
        while(this.message.height > height){
            text = removeWordsFromStart(text, 1)
            this.message.text = this.defaultText + text;
        }
        //Return full text that may have been shortened
        this.messageContent = text
        return this.messageContent;
    }
    this.GetText = function(){
        return this.messageContent;
    }
    this.UpdateText = function(text){
          //Call this to set text if DO know text size is ok
          //Only use this function when updating other players panels having 
          //already called SetText on local player
        this.messageContent = text
        this.message.text = this.defaultText + text;
    }
    function removeWordsFromStart(text, numberWords){
        var shorter = text.split('\n').slice(numberWords).join('\n');
        return  shorter

    }
    
    this.message = game.add.text(x+5, y+5, this.defaultText,  { font: font, fill: textColour,
                                                                backgroundColor: backgroundColour,
                                                                wordWrap: true, wordWrapWidth: width});
    //this.message.lineSpacing = 40;
}