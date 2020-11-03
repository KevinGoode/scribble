//Tray has a display but also contains a state
function Tray (game, onDragFunc, onDropFunc) {
    //Static display properties
    var traySquareSize = 44; //Size of each square of tray
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
    this.letters =[]; //Array of letter sprites

    game.load.image("Tray",  "assets/Tray.jpg" );
    //Dynamic state
    this.state = {} //TrayState
    
    this.UpdateToTurnState = function(turnState, playerName){
        //This method resets tray display to a given state
        //Delete all letters on tray 
        this.removeAllSprites();
        this.removeAllSpriteReferences();
        //Add all letters from last state
        var trayState = turnState.GetPlayerTrayState(playerName);
        this.AddLetters(trayState.GetLetters());
    }
    this.GetTrayState = function (playerName){
        //Get TrayState from current arrangement of letter sprites on tray sprites.
        //This is called at end of turn
        //Loop through all tray positions , get letter sprite as letter objects
        trayState = new TrayState(playerName)
        var letters = [];
        for (var i=0;i<this.tray.length;i++){
            if (this.tray[i].letterSprite){
                let letterCopy = Object.assign({}, ALPHABET_DICTIONARY[this.tray[i].letterSprite.name]);
                letterCopy.x = i
                letterCopy.y = 1;
                letterCopy.positionType = "tray";
                letters.push(letterCopy);
            }
        }
        trayState.letters = letters;
        return trayState
    }

    this.GetNumberOfLetters = function(){
        return this.letters.length;
    }
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
                console.log("Removing a letter from tray:" + letterSprite.key)
                this.letters.splice(i,1);
                this.removeLetterFromTray(letterSprite);
                this.logCurrentLetters();
                this.logCurrentTray();
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
            this.positionNicely(letterSprite);
            this.logCurrentLetters();
            this.logCurrentTray();
        }
    }
    this.removeAllSprites = function(){
        //Destroy all sprites
        for (var i=0;i<this.letters.length;i++){
            this.letters[i].destroy(true);
        }
    }
    this.removeAllSpriteReferences = function(){
        for (var i=0;i<this.NumberPositions;i++){
                this.tray[i].letterSprite = null;
        }
    }
    this.removeLetterFromTray = function (letterSprite){
        var tray = null;
        for (var i=0;i<this.NumberPositions;i++){
            if (this.tray[i].letterSprite == letterSprite){
                this.tray[i].letterSprite = null;
                break;
            }
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
    this.GetState = function(){
        return this.state;
    }
    this.AddLetters = function(letters){
        for (var i=0;i<letters.length;i++){
            var trayItem = this.getEmptyPosition();
            var pos = this.getLetterPosFromTileSquarePos(LETTER_SIZE,trayItem.sprite.position);
            var letterSprite = this.group.create(pos.x, pos.y, letters[i].name)
            //Store name . This is useful when we convert sprites back to state objects later
            letterSprite.name = letters[i].name;
            trayItem.letterSprite = letterSprite;
            this.addLetter(letterSprite);
        }
     }
     this.positionNicely = function (letterSprite){
         //Before positioning nicely, sprite could have just moved from another position in tray so remove
        this.removeLetterFromTray(letterSprite);
        var trayItem = this.getClosestTrayPosition(letterSprite);
        var pos = this.getLetterPosFromTileSquarePos(letterSprite.width,trayItem.sprite.position);
        trayItem.letterSprite = letterSprite;
        letterSprite.x = pos.x;
        letterSprite.y = pos.y;
     }
    this.logCurrentLetters = function(){
        var text = "Current letters on tray: "
        for (var i=0;i<this.letters.length;i++){
            text += this.letters[i].key + " ";
        }
        console.log(text);
    }
    this.logCurrentTray = function(){
        var text = "Current letters by tray position: "
        for (var i=0;i<this.NumberPositions;i++){
            if(this.tray[i].letterSprite){
               text +=  i.toString() + ":" + this.tray[i].letterSprite.key + " ";
            }else{
                text +=  i.toString() + ": None "
            }
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


    this.getEmptyPosition = function(){
        var tray = null;
        for (var i=0;i<this.NumberPositions;i+=1){
            if (!this.tray[i].letterSprite){
                tray = this.tray[i];
                break;
            }
        }
        return tray;
    }
    this.getClosestTrayPosition= function(letterSprite){
        //This dosn't actually get closest position but gets first empty
        //tray position it is touching
        var tray = null;
        for (var i=0;i<this.NumberPositions;i+=1){
            if (letterSprite.overlap(this.tray[i].sprite) && (!this.tray[i].letterSprite )){
                tray = this.tray[i];
                break;
            }
        }
        return tray;
    }
    this.getLetterPosFromTileSquarePos = function(letterSize, trayPoint){
     var offset = (traySquareSize-letterSize)/2;
     var point = {x: trayPoint.x+offset, y:trayPoint.y+offset};
     return point;
    }
    this.init = function(x, y){
        //Initialise display of tray
        this.x = x;
        this.y = y;
        var offset = 0;
        for (var i=0;i<this.NumberPositions;i+=1){
            this.tray.push( {position: i, sprite:this.game.add.sprite(x  + offset, y, 'Tray'), letterSprite: null});
            offset += traySquareSize;
        }
        this.group = this.game.add.group();
    }
}
//A TrayState is a storage class for player current state. IE score, player name and letters in tray
function TrayState(player, letters, score) {
    // Storage class for a turnState.
    // Used by tray display and also instantiated by game
    //at end of each turn to keep history
    this.player = player; //Player name/identifier
    this.letters = []; //Array of tiles
    this.score = 0; //Player score number
    //Second 2 args are only passed on reconstruction on receiving a json state update event
    if (letters) this.letters = letters;
    if (score) this.score = score
    this.Clone = function() {
        var trayState = new TrayState(this.player);
        trayState.letters = this.cloneLetters();
        trayState.score = this.score
        return trayState;
    }
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
    this.cloneLetters = function(){
        var letters = []
        for (var i=0;i<this.letters.length;i++){
            letters.push(Object.assign({}, this.letters[i]));
        }
        return letters;
    }
}