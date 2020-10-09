

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




    // https://phaser.io/examples/v2/buttons/action-on-click
    // https://phaser.io/docs/2.6.2/Phaser.Button.html
    //Width and height are sizer of individual button images
    //This component assumes there are 3 images with image 0: normal, 1: lighter, 2: flatter
    this.name = name;
    this.game = game;
    
    //Fullboard
    game.load.image('board', 'assets/board.jpg');
    //Squares
    game.load.image('Blank', 'assets/Blank.jpg');
    game.load.image('Centre', 'assets/Centre.jpg');
    game.load.image('DoubleWord', 'assets/DoubleWord.jpg');
    game.load.image('DoubleLetter', 'assets/DoubleLetter.jpg');
    game.load.image('TripleWord', 'assets/TripleWord.jpg');
    game.load.image('TripleLetter', 'assets/TripleLetter.jpg');

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
        if (this.name == "standard"){
            this.initBoard(0,0,STANDARD_BOARD)
        }else if (this.name == "default"){
         this.game.add.sprite(0, 0, 'board');
        }

    }
}