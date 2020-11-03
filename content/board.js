

    var Blank = {image: "Blank"};
    var Centre = {image: "Centre"};
    var DoubleWord = {image: "DoubleWord"};
    var DoubleLetter = {image: "DoubleLetter"};
    var TripleWord = {image: "TripleWord"};
    var TripleLetter = {image: "TripleLetter"};
    var TILE_WIDTH = 44;
    var TILE_HEIGHT = 44;
    var BOARD_LENGTH= 15; //IE 15 spaces wide and 15 spaces high
    
    var STANDARD_BOARD =  [
        [TripleWord, Blank, Blank, DoubleLetter,Blank,Blank,Blank,TripleWord, Blank,Blank,Blank, DoubleLetter,  Blank, Blank, TripleWord],
        [Blank, DoubleWord, Blank,Blank,Blank,TripleLetter,Blank,Blank,Blank,TripleLetter,Blank,Blank,Blank,DoubleWord,Blank],
        [Blank,Blank, DoubleWord, Blank,Blank,Blank,DoubleLetter, Blank, DoubleLetter, Blank,Blank,Blank,DoubleWord,Blank,Blank],
        [DoubleLetter, Blank,Blank, DoubleWord, Blank,Blank,Blank,DoubleLetter, Blank,Blank,Blank,DoubleWord,Blank,Blank, DoubleLetter],
        [Blank, Blank, Blank,Blank, DoubleWord, Blank,Blank,Blank, Blank,Blank,DoubleWord,Blank,Blank, Blank, Blank],
        [Blank, TripleLetter, Blank,Blank, Blank, TripleLetter,Blank,Blank, Blank,TripleLetter, Blank,Blank,Blank, TripleLetter, Blank],
        [Blank, Blank, DoubleLetter,Blank, Blank,Blank,DoubleLetter,Blank, DoubleLetter,Blank,Blank,Blank,DoubleLetter, Blank, Blank],
        [TripleWord, Blank, Blank, DoubleLetter,Blank,Blank,Blank,Centre, Blank,Blank,Blank, DoubleLetter,  Blank, Blank, TripleWord],
        [Blank, Blank, DoubleLetter,Blank, Blank,Blank,DoubleLetter,Blank, DoubleLetter,Blank,Blank,Blank,DoubleLetter, Blank, Blank],
        [Blank, TripleLetter, Blank,Blank, Blank, TripleLetter,Blank,Blank, Blank,TripleLetter, Blank,Blank,Blank, TripleLetter, Blank],
        [Blank, Blank, Blank,Blank, DoubleWord, Blank,Blank,Blank, Blank,Blank,DoubleWord,Blank,Blank, Blank, Blank],
        [DoubleLetter, Blank,Blank, DoubleWord, Blank,Blank,Blank,DoubleLetter, Blank,Blank,Blank,DoubleWord,Blank,Blank, DoubleLetter],
        [Blank,Blank, DoubleWord, Blank,Blank,Blank,DoubleLetter, Blank, DoubleLetter, Blank,Blank,Blank,DoubleWord,Blank,Blank],
        [Blank, DoubleWord, Blank,Blank,Blank,TripleLetter,Blank,Blank,Blank,TripleLetter,Blank,Blank,Blank,DoubleWord,Blank],
        [TripleWord, Blank, Blank, DoubleLetter,Blank,Blank,Blank,TripleWord, Blank,Blank,Blank, DoubleLetter,  Blank, Blank, TripleWord]
    ];

function GameBoard(game, name) {
    //Static display properties
    this.name = name;
    this.game = game;
    //Static (set after init)
    this.boardWidth = 0;
    this.boardHeight = 0;
    this.origx = 0;
    this.origy = 0;
    this.squares = null;
    //Dynamic game properties
    this.letters = [] ;
    this.oldLetters = [];

    //Fullboard
    game.load.image('board', 'assets/board.jpg');
    //Squares
    game.load.image('Blank', 'assets/Blank.jpg');
    game.load.image('Centre', 'assets/Centre.jpg');
    game.load.image('DoubleWord', 'assets/DoubleWord.jpg');
    game.load.image('DoubleLetter', 'assets/DoubleLetter.jpg');
    game.load.image('TripleWord', 'assets/TripleWord.jpg');
    game.load.image('TripleLetter', 'assets/TripleLetter.jpg');
    //Dynamic state
    this.state = {} //GameState
    
    this.EndTurn = function(){
        //UpdateBoard so live letters are added to old
        letters = this.GetLiveLetters()
        this.DeleteLiveLetters();
        this.LayLetters(letters)
    }
    this.ShowPreview = function(letters){
        this.DeleteLiveLetters();
        this.PreviewLetters(letters)
    }
    this.UpdateToTurnState = function(turnState){
        //This method resets board display to a given state
        //Delete all sprites
        this.deleteLetters(this.letters);
        this.deleteLetters(this.oldLetters);
        //Add all letters from last state
        var allLetters = turnState.GetBoardLetters();
        this.addLettersToBoard(allLetters, this.oldLetters);
    }
    this.UpdateFromLastTurn = function(lastTurn){
        if (lastTurn.DidAddWord()){
            this.DeleteLiveLetters();
            this.addLettersToBoard(lastTurn.LettersOut, this.oldLetters);
        }
    }
    this.PreviewLetters = function(letters) {
        this.addLettersToBoard(letters, this.letters);
     }
    this.LayLetters = function(letters) {
        this.addLettersToBoard(letters, this.oldLetters);
    }
    this.DeleteLiveLetters = function(){
        this.deleteLetters(this.letters)
        this.letters = [] ;
    }
    this.GetLiveLetters = function(){
        return this.convertSpritesToLetters(this.letters)
    }
    this.GetOldLetters = function(){
        return this.convertSpritesToLetters(this.oldLetters)
    }
    this.deleteLetters = function (sprites){
        for (var i=0;i<sprites.length;i++){
            sprites[i].destroy(true);
        }
    }
    this.addLettersToBoard = function(letters, letterList){
        //Letters is array of letters. Need to create sprites, place them on board and add to letterList.
        //letterList is either this.letters or this.oldLetters
       for (var i=0;i<letters.length;i++){
        var boardPos = {x: letters[i].x, y:letters[i].y}
        var pos = this.getLetterPosFromTileSquarePos(LETTER_SIZE, this. boardPosToScreenPos(boardPos));
        var letterSprite = this.game.add.sprite(pos.x, pos.y, letters[i].name);
        letterSprite.name = letters[i].name;
        letterList.push(letterSprite);
       }
    }
    this.convertSpritesToLetters = function(sprites){
        var letters = [];
        for (var i=0;i<sprites.length;i++){
            let letterCopy = Object.assign({}, ALPHABET_DICTIONARY[sprites[i].name]);
            var square = this.squares.getClosestTo(sprites[i]);
            //Inside sprite we stored boardPosition
            letterCopy.x = square.boardPosition.x
            letterCopy.y = square.boardPosition.y
            letterCopy.square =square.squareName;
            letters.push(letterCopy);
        }
        return letters;
    }
    this.CanIDropLetter = function (point, letterSprite){
      if(point.x > (this.origx + this.boardWidth) || point.x < this.origx  || point.y > (this.origy + this.boardHeight || point.y < this.origy)){
          return false;
      }else if(this.isOverAnyLetter(letterSprite)){
        return false;
      }
      return true;
    }
    this.RemoveLetter = function(letterSprite){
        for (var i=0;i<this.letters.length;i++){
            if (letterSprite == this.letters[i]){
                this.letters.splice(i,1);
                console.log("Removing a letter from board:" + letterSprite.key)
                this.logCurrentLetters();
                return
            }
        }
        return;
    }
    this.DropLetter = function(point, letterSprite){
       if (this.CanIDropLetter(point, letterSprite)){
        console.log("Dropping letter on board:" + letterSprite.key);
        //Letter can be moved around alot so only add if not added already
        if (!this.isLetterOnBoard(letterSprite)) this.letters.push(letterSprite);
        this.positionNicely(letterSprite);
        this.logCurrentLetters();
       }
    }
    this.positionNicely = function (letterSprite){
       var square = this.squares.getClosestTo(letterSprite);
       var pos = this.getLetterPosFromTileSquarePos(letterSprite.width,square.position);
       letterSprite.x = pos.x;
       letterSprite.y = pos.y;
    }
    this.logCurrentLetters = function(){
        var text = "Current letters on board: "
        for (var i=0;i<this.letters.length;i++){
            text += this.letters[i].key + " ";
        }
        console.log(text);
    }
    this.SetState = function(state){
        this.state=state;
    }
    this.GetState = function(){
        return this.state;
    }
    this.isLetterOnBoard = function(letterSprite){
        for (var i=0;i<this.letters.length;i++){
            if (letterSprite == this.letters[i]) return true;
        }
        return false
    }
    this.isOverAnyLetter = function (letterSprite){
        if (this.isOverActiveLetter(letterSprite)) return true;
        if (this.isOverInActiveLetter(letterSprite)) return true;
        return false;
    }
    this.isOverActiveLetter = function (letterSprite){
        return this.isOverOtherLetter(letterSprite, this.letters);
    }
    this.isOverInActiveLetter = function (letterSprite){
        return this.isOverOtherLetter(letterSprite, this.oldLetters);
    }
    this.isOverOtherLetter = function(letterSprite, letters){
        for (var i=0;i<letters.length;i++){
            if (letterSprite.overlap(letters[i]) && letters[i] != letterSprite){
                console.log(letterSprite.key + "overlaps " + letters[i].key);
                return true;
            }
        }
        return false;
    }
    
    this.getLetterPosFromTileSquarePos = function(letterSize, squarePoint){
        var offset = (TILE_WIDTH-letterSize)/2;
        var point = {x: squarePoint.x+offset, y:squarePoint.y+offset};
        return point;
    }
    this.initBoard = function(origx,origy,board2DArray){
        this.origx = origx;
        this.origy = origy;
        var x = origx;
        var y = origy;
        this.squares = this.game.add.group();
        for (var i=0;i<board2DArray.length;i++){
            x=origx;
            for (var j=0;j<board2DArray[i].length;j++){
                var sprite=this.squares.create(x, y, board2DArray[i][j].image);
                //Add a couple of extra properties to squares for later use
                sprite.boardPosition = {x: j, y:i};
                sprite.squareName = board2DArray[i][j].image;
                x += TILE_WIDTH;
            }
            y += TILE_HEIGHT;
        }
        this.boardWidth = x;
        this.boardHeight =y;
    }
    this.boardPosToScreenPos = function(boardPos){
       return {x: this.origx + (boardPos.x * TILE_WIDTH), y: this.origy + (boardPos.y * TILE_HEIGHT)};
    }
    this.init = function(){
        //Initialise display of board
        if (this.name == "standard"){
            this.initBoard(0,0,STANDARD_BOARD)
        }else if (this.name == "default"){
         this.game.add.sprite(0, 0, 'board');
        }

    }
}
//A BoardState copy of board state at end of a turn
function BoardState(letters) {
    // Storage class for a BoardState.
    // Used by Board but also instantiated by game
    //at end of each turn to keep history
    this.letters = []; //Array of tiles
    if(letters) this.letters = letters;
    //Gets a clone
    this.Clone = function() {
        //Clone letters
        var letters = []
        for (var i=0;i<this.letters.length;i++){
            letters.push(Object.assign({}, this.letters[i]));
        }
        var newBoard = new BoardState();
        newBoard.letters = letters;
        return newBoard;
    }
   
 
    this.GetLetters = function(){
        return this.letters;
    }
    this.AddLetters = function(letters){
        for (var i=0;i<letters.length;i++){
            this.letters.push(letters[i])
        }
    }
    this.RemoveLetter = function(letter){
        if (letter.positionType != 'board'){
            console.log("Can't remove letter " + letter.name +  " from board because it has type: " + letter.positionType);
        }
        for (var i=0;i<this.letters.length;i++){
            var lett = this.letters[i];
            if ((lett.positionType == "board") && (lett.x == letter.x) && (lett.y == letter.y)){
                this.letters.splice(i,1);
                return;
            }
        }
        console.log("Failed to remove letter " + letter.name +  " of type "+ letter.positionType);
    }
}