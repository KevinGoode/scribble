
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
function Game(){
    this.gameStarted = false;
    this.gameCreated = false ;//Can be also used to indicate whether jopined game
    this.gameName = "";
    this.playerName = "";
    this.state = null;
    this.HasGameStarted = function() {
        return this.gameStarted
    }
    this.CanIStartGame =function(){
        if (! this.gameCreated){
            var msg = "Cannot start game. You need to create a new game or join an existing one.";
            return new QuestionResponse(false, msg);
        } else if (! this.amIGameOwner()){
            var msg = "Only the player who created the game can start it."
            return new QuestionResponse(false, msg)
        }
        return OK_RESPONSE
    }
    this.CanICreateNewGame = function(){
        if (this.gameCreated){
            var msg = "Cannot create game. Game has already been created.";
            return new QuestionResponse(false, msg);
        } else if (! this.HasGameStarted()){
            var msg = "Cannot create game. Game has already been started."
            return new QuestionResponse(false, msg)
        }else if ( this.gameName == ""){
            var msg = "Cannot create game. Game name has not been set."
            return new QuestionResponse(false, msg)
        }else if ( this.playerName == ""){
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
    this.CanIJoinGame = function(){
        if ( this.gameName == ""){
            var msg = "Cannot join game. Game name has not been set."
            return new QuestionResponse(false, msg)
        }else if ( this.playerName == ""){
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
        //TODO
        return OK_RESPONSE
    }
    this.CanIEndTurn = function(){
        //TODO
        return OK_RESPONSE
    }
    this.CanIUndo = function(){
        if (! this.amIGameOwner()){
            var msg = "Only the game manager is allowed to undo. Ask " + this.state.GameOwner + " to undo if you think last word is illegal."
            return new QuestionResponse(false, msg)
        } else if (!this.HasGameStarted()) {
            var msg = "Cannot undo. Game has not started yet."
            return new QuestionResponse(false, msg)
        }else if (state.History.length < 2) {
            var msg = "Cannot undo. There is nothing to undo. Nobody has had a turn yet."
            return new QuestionResponse(false, msg)
        }
        else if (!state.History[state.History.length-1].DidAddWord()) {
            var msg = "Cannot undo. Last turn did not not involve adding a word"
            return new QuestionResponse(false, msg)
        }
        return OK_RESPONSE
    }
    this.ChangeLetters = function (){
        var response = this.CanIChangeLetters();
        if (response.Yes){
            //TODO update state , send message to server to update all other players
        }
    }
    this.EndTurn = function (){
        var response = this.CanIEndTurn();
        if (response.Yes){
            //TODO update state , send message to server to update all other players
        }
    }
    this.EndGame = function (){
        var response = this.CanIEndGame();
        if (response.Yes){
            //TODO update state , send message to server to reinit all  players to reset
        }
    }
    this.CreateGame = function(){
        var response = this.CanICreateNewGame();
        if (response.Yes){
            //TODO send request to server
            this.gameCreated = true;
            this.state.GameOwner = this.playerName;
        }
    }
    this.StartGame = function() {
        var response = this.CanIStartGame();
        if (response.Yes){
            this.state = GameState()
            //TODO add letters to trays for each player, determine who starts then send instructions to all
            return this.gameStarted = true
        }
    }
    this.amIGameOwner = function() {
        return (this.playerName != "" && this.state && this.state.GameOwner == this.playerName );
    }
    //updateFromLastTurn called at end of each turn (non-active players only)
    //This function changes all state
    this.updateFromLastTurn = function(state, turn){
        this.state = state;
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
}