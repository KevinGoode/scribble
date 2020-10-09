//This games plays best 800*600 pixels. Window scales with browser size so need to adjust screen size.
////Could simple set SCREEN_WIDTH=600, SCREEN_HEIGHT=800
//See folowing article on scaling html5 games
//https://www.joshmorony.com/how-to-scale-a-game-for-all-device-sizes-in-phaser/
var SCREEN_WIDTH = window.innerWidth * window.devicePixelRatio;
var SCREEN_HEIGHT = window.innerHeight * window.devicePixelRatio;
var game = new Phaser.Game(SCREEN_WIDTH, SCREEN_HEIGHT, Phaser.CANVAS,  'phaser-example', { preload: preload, create: create, render: render });


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
var Tiles;
var Bag;
var messagePanel;
var scorePanel;
var dropPanel;
var errorPanel;
var Game;


function preload() {
    //Load input plugin https://github.com/azerion/phaser-input
    game.add.plugin(PhaserInput.Plugin);
    loadImages();
}
function loadImages(){
    
    //TODO REMOVE
    
    Board = new  GameBoard(game, "standard");
    Tiles = new Tiles(game);
    Tray = new Tray(game, "assets/Tray.jpg");
    
    game.load.image('atari', 'assets/M.jpg');
    game.load.image('sonic', 'assets/Q.jpg');


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
    Game = Game()
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
