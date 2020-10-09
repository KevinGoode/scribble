//A Turn can have type : 'skip', 'change', 'word'
//If 'skip' then lettersIn and lettersOut are not used
//If 'change' then lettersIn are those from bag and lettersOut are those returned
//If 'word' then lettersIn are those from bag and lettersOut are those placed on board
function Turn (type, lettersIn, lettersOut, turnNumber, player,nextPlayer) {
    // Storage class for a turn. Used by game 
    this.Type = type; //  'skip', 'change', 'word'
    this.LettersIn = lettersIn; //array of tiles
    this.LettersOut = lettersOut; //array of tiles
    this.TurnNumber = turnNumber; //number
    this.Player = player ; //string containing player name
    this.NextPlayer = nextPlayer ; //string containing player name
    this.DidAddWord = function (){
        if (this.Type == 'word') return true;
        return false
    }

}
//A TurnState copy of game state at end of a turn
//Note the first turn is a null turn whereby the turn and board objects are empty
//and the messageBuffer is blank since it just records state of bag and 
//initial state of each player's tray
function TurnState (bag, board, trays, messageBuffer,turn) {
    // Storage class for a turnState. Instantiated by game at end of each turn
    this.Bag = bag; 
    this.BoardState = board; //BoardState
    this.TrayStates = trays; //Array of TrayStates
    this.MessageBuffer = messageBuffer ; //String
    this.Turn = turn ; //Turn
}