//Tray has a display but also contains a state
function Tray (game, imagePath) {
    //Static display properties
    var trayCharWidth = 44;
    var trayCharHeight = 44;
    this.NumberPositions = 10;
    this.game = game;
    this.imagePath = imagePath;
    this.tray = []
    this.width = this.NumberPositions * trayCharWidth;
    this.height = trayCharHeight
    this.group = null;
    game.load.image("Tray", imagePath );
    //Dynamic state
    this.state = {} //TrayState
    
    this.SetState = function(state){
        this.state=state;
    }
    this.SetState = function(){
        return this.state;
    }
    this.AddLetters = function(letters){
        for (var i=0;i<letters.length;i++){
            var pos = this.getEmptyPosition();
            this.addLetter(this.group.create(pos.x, pos.y, letters[i].name));
        }
     }
    this.addLetter = function(letter){
        letter.inputEnabled = true;
        letter.input.enableDrag();
        letter.events.onDragStart.add(this.onDragStart, this);
        letter.events.onDragStop.add(this.onDragStop, this);
    }
    this.onDragStop = function (sprite, pointer) {
        var message = sprite.key + " dropped at x:" + pointer.x + " y: " + pointer.y;
        console.log(message);
        /*
        if (false)
       {
        console.log('input disabled on', sprite.key);
        sprite.input.enabled = false;

        sprite.sendToBack();
       }
       */
    
    }
    this.onDragStart = function (sprite, pointer) {

        console.log('tray letter onDragStart');
    
    }

    this.getEmptyPosition = function(){
        var pos = null;
        for (var i=0;i<this.NumberPositions;i+=1){
            if (!this.tray[i].occupied){
                pos = this.tray[i].sprite.position;
                this.tray[i].occupied=true;
                break;
            }
        }
        return pos;
    }
    this.init = function(x, y){
        //Initialise display of tray
        var offset = 0;
        for (var i=0;i<this.NumberPositions;i+=1){
            this.tray.push( {position: i, sprite:this.game.add.sprite(x  + offset, y, 'Tray'), occupied: false});
            offset += trayCharWidth;
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