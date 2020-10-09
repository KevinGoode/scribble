//This games plays best 800*600 pixels. Window scales with browser size so need to adjust screen size.
////Could simple set SCREEN_WIDTH=600, SCREEN_HEIGHT=800
//See folowing article on scaling html5 games
//https://www.joshmorony.com/how-to-scale-a-game-for-all-device-sizes-in-phaser/
var SCREEN_WIDTH = window.innerWidth * window.devicePixelRatio;
var SCREEN_HEIGHT = window.innerHeight * window.devicePixelRatio;
var game = new Phaser.Game(SCREEN_WIDTH, SCREEN_HEIGHT, Phaser.CANVAS,  'phaser-example', { preload: preload, create: create, render: render });

//'positionType' is 'bag'/'drop'/'board'/'tray'.
//If 'drop' then position is x,y position in pixels
//If 'bag' then position is not used
//If 'board' position is x, y position on board
//If 'tray' then position is 0, 0-9 (tray has 10 positions)
//'owner' field is username. 'owner' not relevant in 'bag'. Main use is to identify whose tray piece is in
var LETTER_A = { name: 'A', image:'A.jpg', points: 1, total: 9, positionType: 'bag', position: [0, 0], owner: ''};
var LETTER_B = { name: 'B', image:'B.jpg', points: 3, total: 2, positionType: 'bag', position: [0, 0], owner: ''};
var LETTER_C = { name: 'C', image:'C.jpg', points: 3, total: 2, positionType: 'bag', position: [0, 0], owner: ''};
var LETTER_D = { name: 'D', image:'D.jpg', points: 2, total: 4, positionType: 'bag', position: [0, 0], owner: ''};
var LETTER_E = { name: 'E', image:'E.jpg', points: 1, total: 12, positionType: 'bag', position: [0, 0], owner: ''};
var LETTER_F = { name: 'F', image:'F.jpg', points: 4, total: 2, positionType: 'bag', position: [0, 0], owner: ''};
var LETTER_G = { name: 'G', image:'G.jpg', points: 2, total: 3, positionType: 'bag', position: [0, 0], owner: ''};
var LETTER_H = { name: 'H', image:'H.jpg', points: 4, total: 2, positionType: 'bag', position: [0, 0], owner: ''};
var LETTER_I = { name: 'I', image:'I.jpg', points: 1, total: 9, positionType: 'bag', position: [0, 0], owner: ''};
var LETTER_J = { name: 'J', image:'J.jpg', points: 8, total: 1, positionType: 'bag', position: [0, 0], owner: ''};
var LETTER_K = { name: 'K', image:'K.jpg', points: 5, total: 1, positionType: 'bag', position: [0, 0], owner: ''};
var LETTER_L = { name: 'L', image:'L.jpg', points: 1, total: 4, positionType: 'bag', position: [0, 0], owner: ''};
var LETTER_M = { name: 'M', image:'M.jpg', points: 3, total: 2, positionType: 'bag', position: [0, 0], owner: ''};
var LETTER_N = { name: 'N', image:'N.jpg', points: 1, total: 6, positionType: 'bag', position: [0, 0], owner: ''};
var LETTER_O = { name: 'O', image:'O.jpg', points: 1, total: 8, positionType: 'bag', position: [0, 0], owner: ''};
var LETTER_P = { name: 'P', image:'P.jpg', points: 3, total: 2, positionType: 'bag', position: [0, 0], owner: ''};
var LETTER_Q = { name: 'Q', image:'Q.jpg', points: 10, total: 1, positionType: 'bag', position: [0, 0], owner: ''};
var LETTER_R = { name: 'R', image:'R.jpg', points: 1, total: 6, positionType: 'bag', position: [0, 0], owner: ''};
var LETTER_S = { name: 'S', image:'S.jpg', points: 1, total: 4, positionType: 'bag', position: [0, 0], owner: ''};
var LETTER_T = { name: 'T', image:'T.jpg', points: 1, total: 6, positionType: 'bag', position: [0, 0], owner: ''};
var LETTER_U = { name: 'U', image:'U.jpg', points: 1, total: 4, positionType: 'bag', position: [0, 0], owner: ''};
var LETTER_V = { name: 'V', image:'V.jpg', points: 4, total: 2, positionType: 'bag', position: [0, 0], owner: ''};
var LETTER_W = { name: 'W', image:'W.jpg', points: 4, total: 2, positionType: 'bag', position: [0, 0], owner: ''};
var LETTER_X = { name: 'X', image:'X.jpg', points: 8, total: 1, positionType: 'bag', position: [0, 0], owner: ''};
var LETTER_Y = { name: 'Y', image:'Y.jpg', points: 4, total: 2, positionType: 'bag', position: [0, 0], owner: ''};
var LETTER_Z = { name: 'Z', image:'Z.jpg', points: 10, total: 1, positionType: 'bag', position: [0, 0], owner: ''};
var ALPHABET = [LETTER_A, LETTER_B, LETTER_C, LETTER_D, LETTER_E,
                LETTER_F, LETTER_G, LETTER_H, LETTER_I, LETTER_J,
                LETTER_K, LETTER_L, LETTER_M, LETTER_N, LETTER_O,
                LETTER_P, LETTER_Q, LETTER_R, LETTER_S, LETTER_T,
                LETTER_U, LETTER_V, LETTER_W, LETTER_X, LETTER_Y,LETTER_Z];
var NewGameButton;
var JoinGameButton;
var StartGameButton;
var EndGameButton;
var EndTurnButton;
var UndoButton;
var SendMessageButton;
var ChangeLettersButton;
var messageBox;
var gameBox;
var nameBox;
var Board;
var result = 'Drag a sprite';
var Tray;
var messagePanel;
var scorePanel;
var dropPanel;
var errorPanel;
//A turn can have type : 'skip', 'change', 'word'
//If 'skip' then lettersIn and lettersOut are not used
//If 'change' then lettersIn are those from bag and lettersOut are those returned
//If 'word' then lettersIn are those from bag and lettersOut are those placed on board
var turn = {type: '', lettersIn: [], lettersOut:[], turnNumber: 0, player: '',  nextPlayer: ''}
//turnstate is state of each entity at end of each turn and turn info(after tiles laid and tray updated)
var turnState = { bag: [], board: [], trays:[], score:[], messageBuffer: '', turn: {}};
 //gamestate contains a list of turnStates
var gameState = {turnHistory: []};

//The game state is calculated by the active player and shared with all other players at the end of each turn.
//The server then has no business logic specific to this game . All the server is responsible for is serialsing state
//(in the case that all players machines are closed!!) and passing the gameState to each player.

//In happy path , where everybody is connected all of the time, only really need to use
// the 'turn' field from the last turn in the 'turnHistory' and update game using that. 
//In case where a player becomes disconnected for a few turns then can apply missing turns from turnHistory,
//The state of each entity in the turnState (bag, board and trays) are not really needed but can be used
//as an orthogonal check to make sure the state after each turn is applied is consistent with that previously calculated.


function preload() {
    //Load input plugin https://github.com/azerion/phaser-input
    game.add.plugin(PhaserInput.Plugin);
    loadImages();
}
function loadImages(){
    
    //TODO REMOVE

    //Board = new  GameBoard(game, "default");
    Board = new  GameBoard(game, "standard");
    game.load.image('atari', 'assets/M.jpg');
    game.load.image('sonic', 'assets/Q.jpg');

    //Load letters
    ALPHABET.forEach(letter => {
        for (var i=0;i<letter.total;i++){
            game.load.image(letter.name, 'assets/' + letter.image);
        }
    });

    Tray = new Tray(game, "assets/Tray.jpg")
    //Buttons
    NewGameButton = new Button(game,"NewGame", "assets/NewGame.png", 150, 58, onNewGame);
    JoinGameButton = new Button(game,"JoinGame", "assets/JoinGame.png", 150, 58, onJoinGame);
    StartGameButton = new Button(game, "StartGame", "assets/StartGame.png", 150, 58, onStartGame);
    EndGameButton = new Button(game, "EndGame", "assets/EndGame.png", 150, 58, onEndGame);
    EndTurnButton = new Button(game, "EndTurn", "assets/EndTurn.png", 150, 58,onEndTurn);
    UndoButton = new Button(game, "Undo", "assets/Undo.png", 150, 58, onUndo);
    SendMessageButton = new Button(game, "SendMessage", "assets/SendMessage.png", 150, 58, onSendmessage);
    ChangeLettersButton = new Button(game, "ChangeLetters", "assets/ChangeLetters.png", 150, 58, onChangeLetters);
    StartGameButton = new Button(game, "StartGame", "assets/StartGame.png", 150, 58, onStartGame);
    
  
}
function positionStaticImages(){
    var buttonHeight=67;
    var boardWidth =660; //640
    var boardHeight =660; //640
    var buttonWidth =154;
    var buttonLeftAlign = boardWidth + buttonWidth + 10;
    var feedbackLeftAlign = boardWidth + 10;
    var topButtonsOffset = 0;//buttonHeight + 20;
    var middlesButtonsOffset = boardHeight/2;
    var bottomButtonsOffset = boardHeight-buttonHeight;
    var firstPanelOffset = 80;
    var standardPanelHeight = 120;
    var standardPanelWidth = 150;

    Board.init();
    //Buttons
    NewGameButton.init(buttonLeftAlign, topButtonsOffset);
    JoinGameButton.init(buttonLeftAlign, topButtonsOffset+ buttonHeight);
    StartGameButton.init(buttonLeftAlign, topButtonsOffset+buttonHeight*2);
    
    ChangeLettersButton.init(buttonLeftAlign, topButtonsOffset+buttonHeight*4);
    UndoButton.init(buttonLeftAlign, topButtonsOffset+buttonHeight*5);
    EndGameButton.init(buttonLeftAlign, topButtonsOffset+buttonHeight*6);


    EndTurnButton.init(buttonLeftAlign, topButtonsOffset+buttonHeight*10);
    SendMessageButton.init(44*11, boardHeight+Tray.height +20);
    //SendMessageButton.init(buttonLeftAlign, topButtonsOffset+buttonHeight*11);

    //Tray
    Tray.init(0, boardHeight +10)
    
    //Panels
    scorePanel = new InfoPanel(game,  feedbackLeftAlign, firstPanelOffset, standardPanelWidth, standardPanelHeight,  "12px Arial;", '#50c878', "Game:\n"); //Emerald
    dropPanel = new InfoPanel(game,  feedbackLeftAlign, firstPanelOffset + standardPanelHeight +10, standardPanelWidth, standardPanelHeight,  "12px Arial;", '#c9c9c9', "Drop:\n"); //grey
    errorPanel = new InfoPanel(game,  feedbackLeftAlign, firstPanelOffset + 2*(standardPanelHeight +10), standardPanelWidth, standardPanelHeight,  "12px Arial;", '#ff0000', "System:\n"); //red
    messagePanel = new InfoPanel(game,  feedbackLeftAlign, firstPanelOffset + 3*(standardPanelHeight +10), standardPanelWidth*2, 185,  "12px Arial;", '#00a5ff', "Chat:\n"); //blue

    messageParams = {
        font: '18px Arial',
        fill: '#212121',
        fontWeight: 'bold',
        width: boardWidth-buttonWidth-50,
        height: buttonHeight-30,
        padding: 8,
        borderWidth: 1,
        borderColor: '#000',
        placeHolder : 'Type a message here',
        borderRadius: 6};
    gameParams = {
            font: '18px Arial',
            fill: '#212121',
            fontWeight: 'bold',
            width: buttonWidth-20,
            padding: 8,
            borderWidth: 1,
            borderColor: '#000',
            placeHolder : 'Game name',
            borderRadius: 6};
    nameParams = {
                font: '18px Arial',
                fill: '#212121',
                fontWeight: 'bold',
                width: buttonWidth-20,
                padding: 8,
                borderWidth: 1,
                borderColor: '#000',
                placeHolder : 'Your name',
                borderRadius: 6};
    messageBox = game.add.inputField(0, boardHeight+Tray.height +20, messageParams);
    gameBox = game.add.inputField(feedbackLeftAlign, 0, gameParams);
    nameBox = game.add.inputField(feedbackLeftAlign, 40, nameParams);
}
function create() {
    initGameArea();
    positionStaticImages();
    initBag();
    var group = game.add.group();

    group.inputEnableChildren = true;

    var atari = group.create(32, 100, 'atari');

    //  Enable input and allow for dragging
    atari.inputEnabled = true;
    atari.input.enableDrag();
    atari.events.onDragStart.add(onDragStart, this);
    atari.events.onDragStop.add(onDragStop, this);

    var sonic = group.create(300, 200, 'sonic');

    sonic.inputEnabled = true;
    sonic.input.enableDrag();
    sonic.events.onDragStart.add(onDragStart, this);
    sonic.events.onDragStop.add(onDragStop, this);

    group.onChildInputDown.add(onDown, this);

}
function initBag(){
    gameState.bag =getInitialBag();
}
function getInitialBag(){
      var unmixedBag = [];
      ALPHABET.forEach(letter => {
          for (var i=0;i<letter.total;i++){
            unmixedBag.push(letter);
          }
      });
      return shuffle(unmixedBag);
}
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }
function initGameArea(){
    //Set bounds same size as game canvas
    game.world.setBounds(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
 
}


function onDown(sprite, pointer) {

    result = "Down " + sprite.key;

    console.log('down', sprite.key);

}

function onDragStart(sprite, pointer) {

    result = "Dragging " + sprite.key;

}

function onDragStop(sprite, pointer) {

    result = sprite.key + " dropped at x:" + pointer.x + " y: " + pointer.y;

    if (pointer.y > 400)
    {
        console.log('input disabled on', sprite.key);
        sprite.input.enabled = false;

        sprite.sendToBack();
    }

}

function render() {

    game.debug.text(result, 10, 20);

}
function onNewGame(button){
    alert("onNewGame");
    gameBox.inputEnabled=false;
    nameBox.inputEnabled=false;
    messageBox.inputEnabled=true;
}
function onJoinGame(button){
    alert("onJoinGame")
    gameBox.inputEnabled=false;
    nameBox.inputEnabled=false;
    messageBox.inputEnabled=true;
}
function onStartGame(button){
    alert("onStartGame")
}
function onEndGame(button){
    gameBox.inputEnabled=true;
    nameBox.inputEnabled=true;
    messageBox.inputEnabled=false;
    gameBox.setText("");
    
}
function onSendmessage(button){
    messagePanel.SetText(messageBox.text.text);
    messageBox.setText("");
}
function onEndTurn(button){
    
}
function onUndo(button){
    errorPanel.SetText("Undo is currently not supported\n");
}
function onChangeLetters(button){
    alert("onChangeLetters")
}
