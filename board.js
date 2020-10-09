

    var Blank = {image: "Blank"};
    var Centre = {image: "Centre"};
    var DoubleWord = {image: "DoubleWord"};
    var DoubleLetter = {image: "DoubleLetter"};
    var TripleWord = {image: "TripleWord"};
    var TripleLetter = {image: "TripleLetter"};
    var TILE_WIDTH = 44;
    var TILE_HEIGHT = 44;
    
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
    //Dynamic game properties
    this.letters = []
    
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

    this.SetState = function(state){
        this.state=state;
    }
    this.SetState = function(){
        return this.state;
    }
    

    this.initBoard = function(origx,origy,board2DArray){
        var x = origx;
        var y = origy;
        for (var i=0;i<board2DArray.length;i++){
            x=0;
            for (var j=0;j<board2DArray[i].length;j++){
                this.game.add.sprite(x, y, board2DArray[i][j].image);
                x += TILE_WIDTH;
            }
            y += TILE_HEIGHT;
        }
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
function BoardState() {
    // Storage class for a BoardState.
    // Used by Board but also instantiated by game
    //at end of each turn to keep history
    this.letters = []; //Array of tiles
    this.AddLetter = function(letter){
        this.letters.push(letter)
    }
    this.RemoveLetter = function(letter){
        if (letter.positionType != 'board'){
            console.log("Can't remove letter " + letter.name +  " from board because it has type: " + letter.positionType);
        }
        for (var i=0;i<this.letters.length;i++){
            var lett = this.letters[i];
            if ((lett.positionType == "board") && (lett.position.x == letter.position.x) && (lett.position.y == letter.position.y)){
                this.letters.splice(i,1);
                return;
            }
        }
        console.log("Failed to remove letter " + letter.name +  " of type "+ letter.positionType);
    }
}