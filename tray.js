//Tray has a display but also contains a state
function Tray (game, onDragFunc, onDropFunc) {
    //Static display properties
    var traySquareSize = 44; //Size of each square of tgray
    this.NumberPositions = 10;
    this.game = game;
    this.onDragFunc = onDragFunc;
    this.onDropFunc = onDropFunc
    this.tray = []
    this.width = this.NumberPositions * traySquareSize;
    this.height = traySquareSize
    //Set in init
    this.x = 0;
    this.y = 0;
    this.group = null;
    this.letters =[];

    game.load.image("Tray",  "assets/Tray.jpg" );
    //Dynamic state
    this.state = {} //TrayState
    

    this.CanIDropLetter = function (point, letterSprite){
        //Can always drop a letter back in tray if letter over tray
        if(point.x > (this.x + this.width) || point.x < this.x || point.y > (this.y + this.height) || point.y < this.y){
            return false;
        }
        return true;
    }
    this.RemoveLetter = function(letterSprite){
        for (var i=0;i<this.letters.length;i++){
            if (letterSprite == this.letters[i]){
                this.letters.splice(i,1);
                console.log("Removing a letter from tray:" + letterSprite.key)
                this.logCurrentLetters();
                return
            }
        }
        return;
    }
    this.DropLetter = function(point, letterSprite){
        if (this.CanIDropLetter(point, letterSprite)){
            console.log("Dropping letter on tray:" + letterSprite.key);
            //Letter can be moved around alot so only add if not added already
            if (!this.isLetterOnTray(letterSprite)) this.letters.push(letterSprite);
            this.logCurrentLetters();
        }
    }
    this.isLetterOnTray= function(letterSprite){
        for (var i=0;i<this.letters.length;i++){
            if (letterSprite == this.letters[i]) return true;
        }
        return false
    } 
    this.SetState = function(state){
        this.state=state;
    }
    this.SetState = function(){
        return this.state;
    }
    this.AddLetters = function(letters){
        for (var i=0;i<letters.length;i++){
            var pos = this.getEmptyPosition(letters[i]);
            this.addLetter(this.group.create(pos.x, pos.y, letters[i].name));
        }
     }
    this.logCurrentLetters = function(){
        var text = "Current letters on tray: "
        for (var i=0;i<this.letters.length;i++){
            text += this.letters[i].key + " ";
        }
        console.log(text);
    }
    this.addLetter = function(letterSprite){
        //Sprites always starts its life in tray so need to set these attributes
        letterSprite.inputEnabled = true;
        letterSprite.input.enableDrag();
        letterSprite.events.onDragStart.add(this.onDragFunc, this);
        letterSprite.events.onDragStop.add(this.onDropFunc, this);
        this.letters.push(letterSprite);
    }


    this.getEmptyPosition = function(letter){
        var pos = null;
        for (var i=0;i<this.NumberPositions;i+=1){
            if (!this.tray[i].occupied){
                pos = this.getLetterPosFromTileSquarePos(letter,this.tray[i].sprite.position);
                this.tray[i].occupied=true;
                break;
            }
        }
        return pos;
    }
    this.getLetterPosFromTileSquarePos = function(letter, trayPoint){
     var offset = (traySquareSize-letter.size)/2;
     var point = {x: trayPoint.x+offset, y:trayPoint.y+offset};
     return point;
    }
    this.init = function(x, y){
        //Initialise display of tray
        this.x = x;
        this.y = y;
        var offset = 0;
        for (var i=0;i<this.NumberPositions;i+=1){
            this.tray.push( {position: i, sprite:this.game.add.sprite(x  + offset, y, 'Tray'), occupied: false});
            offset += traySquareSize;
        }
        this.group = this.game.add.group();
    }
}
//A TrayState is a storage class for player current state. IE score, player name and letters in tray
function TrayState(player) {
    // Storage class for a turnState.
    // Used by tray display and also instantiated by game
    //at end of each turn to keep history
    this.player = player; //Player name/identifier
    this.letters = []; //Array of tiles
    this.score = 0; //Player score number
    this.GetLetters = function(){
        return this.letters;
    }
    this.AddLetter = function(letter){
        this.letters.push(letter)
    }
    this.RemoveLetter = function(letter){
        if (letter.positionType != 'tray'){
            console.log("Can't remove letter " + letter.name +  " from tray because it has type: " + letter.positionType);
        }
        for (var i=0;i<this.letters.length;i++){
            var lett = this.letters[i];
            if ((lett.positionType == "tray") && (lett.x == letter.x) && (lett.y == letter.y)){
                this.letters.splice(i,1);
                return;
            }
        }
        console.log("Failed to remove letter " + letter.name +  " of type "+ letter.positionType);
    }
    this.GetPlayer = function(){
        return this.player;
    }   
    this.SetPlayer = function(name){
        this.player=name;
    }
    this.GetScore = function(){
        return this.score;
    }   
    this.SetScore = function(score){
        this.score=score;
    }
}