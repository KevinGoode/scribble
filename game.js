
//Game contains the  business logic of the game wrt to local player and current turn.
//Since only one player is active any state info stored here is lost at the end of each turn
//The function that resets state is : 'updateFromLastTurn'.
//All buttons have an assocociated CanI{BUTTON} function that returns a QuestionResponse object
//{'Yes',: true/false, 'Message': 'Some reason'} (message only relevant if Yes=false)
function QuestionResponse(yes, message) {
    this.Yes = yes;
    this.Message = message
}
var OK_RESPONSE = new QuestionResponse(true,"");

function Game(updateGameStateHandler, board, dropBox){
    this.updateGameStateHandler = updateGameStateHandler
    this.gameStarted = false;
    this.gameCreated = false ;//Can be also used to indicate whether joined game
    this.gameName = "";
    this.playerName = "";
    this.board = board;
    this.dropBox = dropBox;
    this.state = null;
    
    this.GetMyPlayerName = function (){
        return this.playerName;
    }
    this.HasGameStarted = function() {
        return this.gameStarted
    }
    this.CanIGo = function(){
        //Simple but useful function. Returns true if it is local players turn to go
        return (this.HasGameStarted() && this.state.GetCurrentPlayer() == this.playerName)
            
    }
    this.CanIStartGame =function(){
        if (! this.gameCreated){
            var msg = "Cannot start game. You need to create a new game or join an existing one.";
            return new QuestionResponse(false, msg);
        } else if (! this.amIGameOwner()){
            var msg = "Only the player who created the game can start it."
            return new QuestionResponse(false, msg)
        } else if (this.gameStarted){
            var msg = "Cannot start game. Game has already been started"
            return new QuestionResponse(false, msg)
        }
        return OK_RESPONSE
    }
    this.CanICreateNewGame = function(gameName, playerName){
        if (this.gameCreated){
            var msg = "Cannot create a new game. A game has already been created.";
            return new QuestionResponse(false, msg);
        } else if (this.HasGameStarted()){
            var msg = "Cannot create a new game game. A game has already been created. Press 'EndGame' if you really want to end this game."
            return new QuestionResponse(false, msg)
        }else if ( gameName == ""){
            var msg = "Cannot create game. Game name has not been set."
            return new QuestionResponse(false, msg)
        }else if ( playerName == ""){
            var msg = "Cannot create game. Player name has not been set."
            return new QuestionResponse(false, msg)
        }
        return OK_RESPONSE
    }
    this.CanIEndGame = function(){
        if (! this.gameCreated){
            var msg = "Cannot end game. You need to create a new game before you can end it.";
            return new QuestionResponse(false, msg);
        } else if (! this.amIGameOwner()){
            var msg = "Only the player who created the game can end it."
            return new QuestionResponse(false, msg)
        }
        return OK_RESPONSE
    }
    this.CanIJoinGame = function(gameName, playerName){
        if ( gameName == ""){
            var msg = "Cannot join game. Game name has not been set."
            return new QuestionResponse(false, msg)
        }else if (playerName == ""){
            var msg = "Cannot join game. Player name has not been set."
            return new QuestionResponse(false, msg)
        }else if (this.gameCreated){
            var msg = "Cannot join game. You are already playing a game.";
            //TODO might want to consider rejoining in case coms with server go down?
            return new QuestionResponse(false, msg);
        }
        return OK_RESPONSE
    }
    this.CanIChangeLetters = function(){
        if (!this.HasGameStarted()) {
            var msg = "Cannot change letters. Game has not started yet."
            return new QuestionResponse(false, msg);
        } else if (!this.CanIGo()){
            var msg = "Cannot change letters. It is not your turn."
            return new QuestionResponse(false, msg);
        }else if(this.board.GetLiveLetters().length > 0){
            var msg = "Cannot change letters. Remove letters from board first.";
            return new QuestionResponse(false, msg);
        }else if(this.dropBox.GetLiveLetters().length < 1){
            var msg = "Cannot change letters. No letters in drop box.";
            return new QuestionResponse(false, msg);
        }
        return OK_RESPONSE
    }
    this.CanIEndTurn = function(){
        if (!this.HasGameStarted()) {
            var msg = "Cannot end turn. Game has not started yet."
            return new QuestionResponse(false, msg);
        }else if (!this.CanIGo()){
            var msg = "Cannot end turn. It is not your turn."
            return new QuestionResponse(false, msg);
        }else if(this.dropBox.GetLiveLetters().length > 0){
            var msg = "Cannot end turn if there are letters in letter drop";
            return new QuestionResponse(false, msg);
        }
        return OK_RESPONSE
    }
    this.CanIUndo = function(){
        if (!this.HasGameStarted()) {
            var msg = "Cannot undo. Game has not started yet."
            return new QuestionResponse(false, msg);
        }else if (! this.amIGameOwner()){
            var msg = "Only the game manager is allowed to undo. Ask " + this.state.GameOwner + " to undo."
            return new QuestionResponse(false, msg);
        }else if (this.state.History.length < 2) {
            var msg = "Cannot undo. There is nothing to undo. Nobody has had a turn yet."
            return new QuestionResponse(false, msg);
        }
        else if (!state.History[state.History.length-1].DidAddWord()) {
            var msg = "Cannot undo. Last turn did not not involve adding a word"
            return new QuestionResponse(false, msg);
        }
        return OK_RESPONSE
    }
    this.ChangeLetters = function (){
        var response = this.CanIChangeLetters();
        if (response.Yes){
            //TODO update state , send message to server to update all other players
            alert("ChangeLetters - todo");
        }
    }
    this.EndTurn = function (){
        var response = this.CanIEndTurn();
        if (response.Yes){
           if(this.checkValidTurn()){

           }
        }
    }
    this.EndGame = function (){
        var response = this.CanIEndGame();
        if (response.Yes){
            //TODO update state , send message to server to reinit all  players to reset
            alert("EndGame - todo");
            this.gameCreated = false;
            this.gameStarted = false;
            this.gameName = "";
            this.playerName = "";
            this.state =null;
            this.sendUpdateGameMessage();
        }
    }
    this.CreateGame = function(gameName, playerName){
        var response = this.CanICreateNewGame(gameName, playerName);
        if (response.Yes){
            this.gameName = gameName;
            this.playerName=playerName;
            this.gameCreated = true;
            this.state = new GameState()
            this.state.GameOwner = 0;
            this.onPlayerJoined(this.playerName);
            //TODO send request to server
            //alert("CreateGame - more todo");
        }
    }
    this.StartGame = function() {
        var response = this.CanIStartGame();
        if (response.Yes){
            
            //alert("StartGame - todo");
            //TODO add letters to trays for each player, determine who starts then send instructions to all
            this.gameStarted = true;
            var initialTurnState = this.getInitialTurnState();
            this.state.AddTurnState(initialTurnState);
            //The first tray in first turn is first player
            this.state.SetCurrentPlayer(initialTurnState.GetTrayState(0).GetPlayer());
            this.sendUpdateGameMessage();
        }
    }
    this.Undo = function() {
        var response = this.CanIUndo();
        if (response.Yes){
            alert("Undo - todo");
        }
    }
    this.JoinGame = function(gameName, playerName) {
        var response = this.CanIJoinGame(gameName, playerName);
        if (response.Yes){
            this.gameName = gameName;
            this.playerName=playerName;
            alert("JoinGame - todo");
        }
    }
    this.checkValidTurn = function(){
        var letters = this.board.GetLiveLetters();
        return false;
    }
    this.amIGameOwner = function() {
        return (this.playerName != "" && this.state && this.state.GetGameOwner() == this.playerName );
    }
    //updateFromLastTurn called at end of each turn (non-active players only)
    //This function changes all state
    this.updateFromLastTurn = function(state, turn){
        this.state = state;
    }

    this.onPlayerJoined = function(name){
        //Handler when player joins.
        //Also called by pplayer who creates game
        this.state.Players.push(name);
        this.sendUpdateGameMessage()
    }
    this.getStateText =function (){
       if (this.gameStarted) return "Started";
       if (this.gameCreated) return "Created";
       return "";
    }
    this.getInitialTurnState = function(){
        var bag = new Bag();
        var boardState = new BoardState();
        var trays = bag.GetInitialTrays(this.state.Players);
        var turnState = new TurnState(bag, boardState, trays, "", null);
        return turnState;
    }
    this.receiveUpdateGameMessage = function(state){
        //This is callback that receives a game update
        this.state = state;
        var text = "";
        if (this.state) {
            text += "State:" + this.getStateText() + "\n";
            text += "Letters Left: " + this.state.GetBagSize().toString() + "\n";
            text += "Players:\n";
            for (var i=0;i<this.state.Players.length;i++){
                var score = 0;
                if (this.state.HasScores()) score = this.state.GetPlayerScore(this.state.Players[i]);
                var extra = "";
                if (this.playerName == this.state.Players[i] ){
                    extra += "(Me)"
                }
                if (this.state.GetGameOwner() == this.state.Players[i]){
                    extra +="(Manager)"
                }
                text += score.toString() + " " + this.state.Players[i] + extra + "\n";
            }

        }
        this.updateGameStateHandler(text, this.state);
    }
    this.sendUpdateGameMessage = function(){
        //TODO replace line below with rpc call to all players
        this.receiveUpdateGameMessage(this.state);
    }
}
//The GameState is calculated by the active player and shared with all other players at the end of each turn.
//The server then has no business logic specific to this game . All the server is responsible for is serialsing state
//(in the case that all players machines are closed!!) and passing the GameState to each player.

//In happy path , where everybody is connected all of the time, only really need to use
// the 'turn' field from the last turn in the 'turnHistory' and update game using that. 
//In case where a player becomes disconnected for a few turns then can apply missing turns from turnHistory,
//The state of each entity in the turnState (bag, board and trays) are not really needed but can be used
//as an orthogonal check to make sure the state after each turn is applied is consistent with that previously calculated.


function GameState () {
    // Storage class that is passed to all players at end of turn
    this.Players = [] ;//Ordered array of players in game
    this.GameOwner = 0; //Index into players array of player that owns game
    this.CurrentPlayer = 0; //Index into players array of current player
    // History is array of TurnStates keeping a detailed history of each turn.
    // Note first TurnState is only interesting in terms of initial bag state and each
    //player's tray state
    this.History = [];
    this.GetLastTurn = function(){
        var lastTurn = null;
        if (this.History.length >=1 ) {
            lastTurn =  this.History[this.History.length-1].turn;
        }
        return lastTurn;
    }
    this.GetMyTrayState =function (playerName) {
        var trayState = null;
        if (this.History.length >=1 ) {
            var trays = this.History[this.History.length-1].GetTrayStates();
            if (trays) {
                for (var i=0;i<trays.length;i++){
                    if (trays[i].GetPlayer() == playerName){
                        trayState = trays[i]
                        break;
                    }
                }
            }
       }
       return trayState;
    }
    this.AddTurnState = function(turnState){
        this.History.push(turnState);
    }
    this.HasScores = function(){
        return (this.History.length > 0);
    }
    this.GetBagSize = function(){
        var count = 0;
        if (this.History.length >=1 )
        {
           count = this.History[this.History.length-1].GetBagSize();
        }
        return count;
    }
    this.GetPlayerScore = function (playerName){
       var lastTurnState = this.History[this.History.length-1];
       return lastTurnState.GetPlayerScore(playerName);
    }
    this.GetGameOwner = function(){
        return this.Players[ this.GameOwner];
    }
    this.SetCurrentPlayer = function(playerName){
        this.CurrentPlayer = 0
        for (var i=0;i<this.Players.length;i++){
            if (this.Players[i] == playerName){
                this.CurrentPlayer =  i;
                break;
            }
        }
    }
    this.GetCurrentPlayer = function(){
        var player = "";
        if  (this.CurrentPlayer <= (this.Players.length -1) ){
            player = this.Players[this.CurrentPlayer];
        }
        return player
    }
}