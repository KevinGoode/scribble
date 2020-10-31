
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



function Game(updateGameStateHandler, board, dropBox, tray, errorPanel, messagePanel){
    this.updateGameStateHandler = updateGameStateHandler
    this.gameName = "";
    this.playerName = "";
    this.turnNumber = 0;
    this.board = board;
    this.dropBox = dropBox;
    this.errorPanel = errorPanel
    this.state = null;
    this.socket  = null;
    this.messagePanel = messagePanel
    //Active player state can be "Active", "Waiting for Approval", "Approved"
    this.activePlayerState =  {}
    this.tray = tray;

    this.PlayerIsActive = function() {
        //Call this everytime player changes his current turnm
        this.activePlayerState.Active();
    }
    this.GetMyPlayerName = function (){
        return this.playerName;
    }
    this.HasGameStarted = function() {
        if (this.state) return this.state.Started;
        return false;
    }
    this.HaveJoinedGame = function() {
        if (this.state) return true;
        return false;
    }
    this.CanIGo = function(){
        //Simple but useful function. Returns true if it is local players turn to go
        return (this.HasGameStarted() && this.state.GetCurrentPlayer() == this.playerName)
            
    }
    this.CanIStartGame =function(){
        if (! this.HaveJoinedGame()){
            var msg = "Cannot start game. You need to create a new game or join an existing one.";
            return new QuestionResponse(false, msg);
        } else if (! this.amIGameOwner()){
            var msg = "Only the player who created the game can start it."
            return new QuestionResponse(false, msg)
        } else if (this.HasGameStarted()){
            var msg = "Cannot start game. Game has already been started"
            return new QuestionResponse(false, msg)
        }
        return OK_RESPONSE
    }
    this.CanICreateNewGame = function(gameName, playerName){
        if (this.HaveJoinedGame()){
            var msg = "Cannot create a new game. You are already playing a game.";
            return new QuestionResponse(false, msg);
        } else if (this.HasGameStarted()){
            var msg = "Cannot create a new game game. You are already playing a game. Press 'EndGame' if you really want to end this game."
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
        if (! this.HaveJoinedGame()){
            var msg = "Cannot end game. You are currently not playing a game";
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
        }else if (this.HaveJoinedGame()){
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
       } else if (!this.CanIGo()){
           var msg = "Cannot end turn. It is not your turn."
           return new QuestionResponse(false, msg);
       } else if (this.activePlayerState.state == this.activePlayerState.ACTIVE_STATE){
           var msg = "Cannot end turn. If you have finished your turn press 'Submit' to request approval"
           return new QuestionResponse(false, msg);
       }else if (this.activePlayerState.state == this.activePlayerState.WAITING_STATE){
           var msg = "Cannot end turn. All players must press 'Like' before you can end turn."
           return new QuestionResponse(false, msg);
       }
       //State must be 'Approved' so return ok.
       return OK_RESPONSE;
   }
    this.CanISubmit = function(){
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
        return this.checkValidTurn();
    }
    this.CanILike = function(){
        if (!this.HasGameStarted()) {
            var msg = "Cannot like. Game has not started yet."
            return new QuestionResponse(false, msg);
        }else if (this.CanIGo()){
            var msg = "Cannot like. You cannot like your own word"
            return new QuestionResponse(false, msg);
        }
        //Restriction on clicking like are pretty loose from a not-active player point of view
        //On active player side likes and dont likes are strictly handled
        return OK_RESPONSE;
    }
    this.CanIDontLike = function(){
        if (!this.HasGameStarted()) {
            var msg = "Cannot 'not like'. Game has not started yet."
            return new QuestionResponse(false, msg);
        }else if (this.CanIGo()){
            var msg = "Cannot 'not like'. You cannot 'not like' your own word"
            return new QuestionResponse(false, msg);
        }
        //Restriction on clicking dontlike are pretty loose from a not-active player point of view
        //On active player side likes and dont likes are strictly handled
        return OK_RESPONSE;
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
        else if (!this.state.History[state.History.length-1].DidAddWord()) {
            var msg = "Cannot undo. Last turn did not not involve adding a word"
            return new QuestionResponse(false, msg);
        }
        return OK_RESPONSE
    }
    this.SendMessage = function (text){
        this.socket.emit('game_event', {type: 'chat', body: text, sender: this.playerName});
    }
    this.Like = function (){
        var response = this.CanILike();
        if (response.Yes){
            this.socket.emit('game_event', {type: 'like', body: true, sender: this.playerName});
        }
    }
    this.DontLike = function (){
        var response = this.CanIDontLike();
        if (response.Yes){
            this.socket.emit('game_event', {type: 'like', body: false, sender: this.playerName});
        }
    }
    this.ChangeLetters = function (){
        var response = this.CanIChangeLetters();
        if (response.Yes){
            this.changeLetters();
        }
    }
    this.EndTurn = function (){
        var response = this.CanIEndTurn();
        if (response.Yes){
             this.endTurn();
        }
        return response;
    }
    this.EndGame = function (){
        var response = this.CanIEndGame();
        if (response.Yes){
            //TODO update state , send message to server to reinit all  players to reset
            alert("EndGame - todo");

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
            this.createGame(gameName);
        }
    }
    this.StartGame = function() {
        var response = this.CanIStartGame();
        if (response.Yes){
            
            this.state.Started = true;
            var initialTurnState = this.getInitialTurnState();
            this.state.AddTurnState(initialTurnState);
            //The first tray in first turn is first player
            this.state.SetCurrentPlayerByName(initialTurnState.GetTrayState(0).GetPlayer());
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
            this.joinGame();
        }
    }
    this.Submit = function (){
        var response = this.CanISubmit();
        if (response.Yes){
            this.activePlayerState.Submit();
            this.socket.emit('game_event', {type: 'preview', body: this.board.GetLiveLetters(), sender: this.playerName});
        }
    }
    this.checkValidTurn = function(){
        var letters = this.board.GetLiveLetters();
        var oldLetters = this.board.GetOldLetters();
        var checker = new WordChecker(letters, oldLetters);
        if(!checker.AreLettersStraight()){
            var msg = "Cannot end turn. Letters are not in a straight line."
            return new QuestionResponse(false, msg);
        }
        if(checker.IsFirstLay()){
            
            if(!checker.DoLettersGoThroughMiddleSquare()){
                var msg = "Cannot end turn. A letter must must be placed on centre square"
                return new QuestionResponse(false, msg);
            }else if (!checker.AreLettersContinuous()){
                var msg = "Cannot end turn. Word must have no gaps."
                return new QuestionResponse(false, msg);
            }

        }else{
            //Test whether word intersects or extends an existing word with no gaps
            if(checker.AreThereGapsInWord()){
                var msg = "Cannot end turn. There are gaps. Word must have no gaps."
                return new QuestionResponse(false, msg);
            }else if (!checker.AreThereAdjacentLetters()){
                var msg = "Cannot end turn. Word does not intersect an existing word"
                return new QuestionResponse(false, msg);
            }
        }
       
        return OK_RESPONSE;
    }

    this.createGame = function(gameName){
        var that = this;
        $.ajax({
            url: "rest/scribble",
            type: 'POST',
            data: '{"name":"' +  gameName + '"}',
            contentType: 'application/json',
            success: function(data, ok, response){that.gameSuccessfullyCreated(JSON.parse(data));},
            error: function(error){that.gameFailedToCreate();}});
    }
    this.gameSuccessfullyCreated = function(data) {
        this.state = new GameState()
        this.state.GameOwner = 0;
        this.state.Name = this.gameName;
        var id = data['id'];
        console.log("Got game id: " + id)
        this.initSocket(id);
        this.addPlayer(this.playerName);
    };
    this.gameFailedToCreate = function() {
        this.errorPanel.SetText("Failed to create game. Try another name, or try again later.")
    };
    this.initSocket = function(id){
        //Init socket
        var that = this;
        this.socket = io.connect('http://' + document.domain + ':' + location.port + '/scribble/' + id);
        this.socket.on('game message', function(msg) { that.receiveMessage(msg)});
        this.socket.on('connect', function(msg) { that.errorPanel.SetText("Successfuly connected to game server")});
        this.socket.on('disconnect', function(msg) { that.errorPanel.SetText("Disconnected from game server")});
     }
    this.joinGame = function(){
        var that = this;
        $.ajax({
            url: "rest/scribble/" + this.gameName,
            type: 'PATCH',
            data: '{"name":"' +  this.playerName + '"}',
            contentType: 'application/json',
            success: function(data, ok, response){that.gameSuccessfullyJoined(JSON.parse(data));},
            error: function(error){that.gameFailedToJoin();}});
    }
    this.gameSuccessfullyJoined = function(data) {
        var id = data['id']
        console.log("Got game id: " + id)
        this.initSocket(id);
        this.addPlayer(this.playerName);
    };
    this.gameFailedToJoin = function() {
        this.errorPanel.SetText("Failed to join game. Perhaps game name wrong, or too many players.")
    };
    this.changeLetters = function(){
        var lettersOut = this.dropBox.GetLiveLetters();
        var newTurnState = this.getNewTurnState(0, "change", lettersOut);
        newTurnState.ReturnLetters(lettersOut);
        this.dropBox.DeleteLiveLetters();
        this.state.AddTurnState(newTurnState);
        //Update everybody's state
        this.sendUpdateGameMessage();
    }
    this.endTurn = function(){
       var lettersOut = this.board.GetLiveLetters();
       var oldLetters = this.board.GetOldLetters();
       var checker = new WordChecker(lettersOut, oldLetters);
       var newPoints =checker.GetScore();
       newTurnState = this.getNewTurnState(newPoints, "word", lettersOut);
       newTurnState.UpdateBoardState(lettersOut);
       this.board.EndTurn(); //This deletes live letters and moves then to old
       this.state.AddTurnState(newTurnState);
       //Update everybody's state
       this.sendUpdateGameMessage();
    }
    this.getNewTurnState = function(newPoints, type, lettersOut){
       var me = this.GetMyPlayerName();
       //Create a new turn state
       //Take a copy of last turn then start updating it
       var newTurnState = this.state.CloneLastTurnState();
       var count = this.tray.GetNumberOfLetters();
       var lettersIn = [];
       for (var i=0;i<7-count;i++){
            var letter = newTurnState.GetLetter();
            if (letter) lettersIn.push(letter);
       }
       this.tray.AddLetters(lettersIn);
       var trayState = this.tray.GetTrayState(me);
       trayState.SetScore(newTurnState.GetPlayerScore(me) + newPoints);
       var nextPlayer = this.state.GetNextPlayer();
       this.state.SetCurrentPlayer(nextPlayer);
       console.log("Next player is " + nextPlayer.toString());
       
       //Increment local turnnumber
       this.incrementTurnNumber()
       var turn = new Turn(type, lettersIn, lettersOut, this.turnNumber, me, nextPlayer)
       newTurnState.SetTrayState(trayState)
       newTurnState.SetTurn(turn);
       return newTurnState
    }
    this.incrementTurnNumber = function(){
        this.turnNumber = this.turnNumber+1;
        console.log("My turn number is " + this.turnNumber.toString());
    }
    this.amIGameOwner = function() {
        return (this.playerName != "" && this.state && this.state.GetGameOwner() == this.playerName );
    }
    //updateFromLastTurn called at end of each turn (non-active players only)
    //This function changes all state
    this.updateFromLastTurn = function(state, turn){
        this.state = state;
    }

    this.addPlayer = function(name){
        //When this event is received, the server sends stateUpdated message. Normally it is
        //either game owner (on game start) or current player (on turn end) who sends stateUpdated
        this.socket.emit('game_event', {type: 'playerAdd', body: {'name': name}});
        
    }
    this.getStateText =function (){
       if (this.HaveJoinedGame()) return "Joined";
       return "";
    }
    this.getInitialTurnState = function(){
        var bag = new Bag();
        var boardState = new BoardState();
        var trays = bag.GetInitialTrays(this.state.Players);
        this.logTrayStates(trays);
        var turnState = new TurnState(bag, boardState, trays, "", null);
        return turnState;
    }
    this.receiveMessage = function(message) {
        //This is Main Message handler
        if (!message.type) {
            this.errorPanel.SetText("Received message with no type")
            return
        }
        if (!message.sender) {
            this.errorPanel.SetText("Received message with no sender")
            return
        }
        body = message.body;
        switch (message.type){
            case "stateUpdate":
                this.receiveUpdateGameMessage(new GameState(body));
                return;
            case "chat":
                this.messagePanel.UpdateText(body);
                return;
            case "preview":
                this.messagePanel.SetText(message.sender + " placed a word. Press 'Like' or 'Don't Like'\n");
                this.board.ShowPreview(body);
                return;
            case "like":
                txt = "Likes"
                if (body == false)  txt = "Dosn't like"
                this.messagePanel.SetText(message.sender + ": " + txt + "\n");
                if (this.CanIGo()){
                    //Like only gets added if local player is active
                    this.activePlayerState.AddLike(message.sender, body)
                }
                return;
            default:
                this.errorPanel.SetText("Received message with unsupported type: " + message.type)
        };
    }
    this.receiveUpdateGameMessage = function(state){
        //This is callback that receives a game update
        this.state = state;
        this.logState();
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
            if (this.CanIGo()){
                //It is my turn so set my active state
                this.activePlayerState = new ActivePlayerState(this.state.GetNumberOfPlayers());
            }
             this.updateBoardAndTray();
        }
        this.updateGameStateHandler(text, this.state);
    }
    this.updateBoardAndTray = function(){
        var lastTurn = this.state.GetLastTurn()
        if (lastTurn){
            if (this.turnNumber == lastTurn.TurnNumber){
                console.log("Got state update. Nothing to do. Must have been my last go!")
            }else if((this.turnNumber +1) == lastTurn.TurnNumber){
                //Usual case where non active players get update.
                //In this case do not need tro update tray so just update board with last letters added.
                if (lastTurn.DidAddWord()){
                    console.log("Got state update. Adding new letters to board");
                    this.board.UpdateFromLastTurn(lastTurn);
                }else{
                    console.log("Got state update. Last go was either letter change or skip. Nothing to do");
                }

            } else if (this.turnNumber < lastTurn.TurnNumber){
                //Current players has missed more than one state update
                //Need to reconstruct board with multiple turns and reset current tray
                alert("TODO - Need to reconstruct board with multiple turns and reset current tray");
            } else {
                //Current player is ahead of current state. An Undo must have occurred
                //Need to reconstruct board and tray to a past state.
                alert("TODO - Need to reconstruct board and tray to a past state");
            }
            //Set display last turn number so know next time what to do
            this.turnNumber = lastTurn.TurnNumber
        }else{
            //No last turn, so show my initial tray if game has started
            var me = this.GetMyPlayerName();
            var myTray = this.state.GetMyTrayState(me)
            if (myTray){
                console.log("Got state update. Showing initial tray")
                this.tray.AddLetters(myTray.GetLetters());
            }else{
                console.log("Got state update. Game not started. Nothing to display");
            }
        }
    }
    this.sendUpdateGameMessage = function(){
        this.socket.emit('game_event', {type: 'stateUpdate', body: this.state, sender: this.playerName});
    }
    this.logState = function(){
        if (this.state) {
            console.log("************")
            console.log("Started: " + this.state.Started.toString());
            for (var i=0;i<this.state.Players.length;i++){
                console.log("Player:" + this.state.Players[i]);
            }
            console.log("Current player:" + this.state.Players[this.state.CurrentPlayer]);
            console.log("************")
        }
    }
    this.logTrayStates = function (trayStates){
        for (var i=0;i<trayStates.length;i++){
            var line = "";
            for (var j=0;j<trayStates[i].letters.length;j++){
                line += trayStates[i].letters[j].name;
            }
            console.log("Tray for player : " + trayStates[i].player + " " + line);
        }
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


function GameState (state) {
    // Storage class that is passed to all players at end of turn
    this.Players = [] ;//Ordered array of players in game
    this.Name = "" ;// Game name
    this.id = "";
    this.Started = false
    this.GameOwner = 0; //Index into players array of player that owns game
    this.CurrentPlayer = 0; //Index into players array of current player
    // History is array of TurnStates keeping a detailed history of each turn.
    // Note first TurnState is only interesting in terms of initial bag state and each
    //player's tray state
    this.History = [];
    if (state) {
        this.Players = state.Players
        this.Name = state.Name
        this.id = state.id
        this.Started = state.Started 
        if (state.GameOwner) this.GameOwner = state.GameOwner;
        if (state.CurrentPlayer) this.CurrentPlayer = state.CurrentPlayer;
        if (state.History ){
            var history = []
            for(var i=0;i<state.History.length;i++){
                var bag = new Bag(true, state.History[i].Bag.letters)
                var boardState = new BoardState(state.History[i].BoardState.letters)
                var turn = null;
                if (state.History[i].Turn) {
                    turn = new Turn(state.History[i].Turn.Type, state.History[i].Turn.LettersIn, state.History[i].Turn.LettersOut, 
                                    state.History[i].Turn.TurnNumber, state.History[i].Turn.Player, state.History[i].Turn.NextPlayer)
                }
                var trayStates = [];
                for(var j=0;j<state.History[i].TrayStates.length;j++){ 
                    trayStates.push( new TrayState(state.History[i].TrayStates[j].player, state.History[i].TrayStates[j].letters, state.History[i].TrayStates[j].score));
                }
                history.push( new TurnState(bag, boardState, trayStates, "", turn))
            }
            this.History = history ;
        }
    }
    this.GetNextPlayer = function() {
        var next = this.CurrentPlayer +1;
        if (next >= this.Players.length){
            next =0;
        }
        return next;
    }
    this.GetPlayers = function(){
        return this.Players;
    }
    this.GetCurrentPlayerIndex = function(){
        return this.CurrentPlayer
    }
    this.GetNumberOfPlayers = function(){
      return this.Players.length;
    }
    this.IsPlayer = function(playerName){
        for (var i=0;i<Players.length;i++){
            if (playerName == Players[i]) return true;
        }
        return false;
    }
    this.GetBoardState = function(){
        var boardState = null;
        var lastTurn = this.GetLastTurn();
        if (lastTurn){
            boardState = lastTurn.GetBoardState();
        }
        return boardState;
    }
    this.CloneLastTurnState =function(){
        var last = this.GetLastTurnState();
        return last.Clone();
    }
    this.GetLastTurnState = function(){
        var lastTurnState = null;
        if (this.History.length >0 ) {
            lastTurnState =  this.History[this.History.length-1]
        }
        return lastTurnState;
    }
    this.GetLastTurn = function(){
        //Actually only gets last proper turn because there is no turn object in first turnState
        var lastTurn = null;
        if (this.History.length >=1 ) {
            lastTurn =  this.History[this.History.length-1].Turn;
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
    this.SetCurrentPlayerByName = function(playerName){
        this.CurrentPlayer = 0
        for (var i=0;i<this.Players.length;i++){
            if (this.Players[i] == playerName){
                this.CurrentPlayer =  i;
                break;
            }
        }
    }
    this.SetCurrentPlayer = function(index){
        this.CurrentPlayer = index; 
    }
    this.GetCurrentPlayer = function(){
        var player = "";
        if  (this.CurrentPlayer <= (this.Players.length -1) ){
            player = this.Players[this.CurrentPlayer];
        }
        return player
    }
}