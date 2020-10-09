//Tray has a display but also contains a state
function Tray (game, imagePath) {
    //Static display properties
    var trayCharWidth = 44;
    var trayCharHeight = 44;
    this.NumberPositions = 8;
    this.game = game;
    this.imagePath = imagePath;
    this.tray = []
    this.width = this.NumberPositions * trayCharWidth;
    this.height = trayCharHeight
    game.load.image("Tray", imagePath );
    //Dynamic state
    this.state = {} //TrayState

    this.SetState = function(state){
        this.state=state;
    }
    this.SetState = function(){
        return this.state;
    }
   
    this.init = function(x, y){
        //Initialise display of tray
        var offset = 0;
        for (var i=0;i<10;i+=1){
            this.tray.push( {'position': i, 'sprite':this.game.add.sprite(x  + offset, y, 'Tray')});
            offset += trayCharWidth;
        }
    }
}
//A TrayState is a storage class for player current state. IE score, player name and letters in tray
function TrayState(player, letters, score) {
    // Storage class for a turnState.
    // USed by tray display and also instantiated by game
    //at end of each turn to keep history
    this.player = player; //Player name/identifier
    this.letters = letters; //Array of tiles
    this.score = score; //Player score number
    this.SetLetters = function(letters){
        this.letters=letters;
    }
    this.GetLetters = function(){
        return this.letters;
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