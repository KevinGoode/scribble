
function Messenger(type, body, players, activePlayer, myName){
    this.type = type
    this.body = body
    this.players = players
    this.activePlayer = activePlayer
    this.myName = myName
    this.SendToAll = function() {
        for (var i=0;i<this.players.length;i++){
            this.send(this.players[i])
        }
    }
    this.SendToActive = function() {
        this.send(this.players[this.activePlayer]);
    }
    this.SendToNonActive = function() {
        for (var i=0;i<this.players.length;i++){
            if (i != this.activePlayer) {
                this.send(this.players[i])
            }
        }
    }
    this.send = function(player){
       console.log("Sending message type: " +this.type + " to " + player);
    }
}