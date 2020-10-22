//State of active player. This state never needs to be passed around to other players
//but rather it is a state to manage when is it possible to send state to other players IE
//it signals when player has finished his go IE approved
function ActivePlayerState(numberOfPlayers){
    this.ACTIVE_STATE = "Active";
    this.WAITING_STATE = "Waiting for approval"
    this.APPROVED_STATE = "Approved"
    this.state = "Active";
    this.likes = []
    this.numPlayers = numberOfPlayers
    this.AddLike = function(playerName, like){
        if (this.GetState() != this.ACTIVE_STATE){
            for (var i=0;i<this.likes.length;i++){
                if (this.likes[i].name = playerName){
                    this.likes[i].like = like; //like is true or false
                    return
                }
            }
            //Like dosn't exist so add
            this.likes.append({name: playerName, like: like});
            if (this.amIApproved()){
                this.state = this.APPROVED_STATE;
            }else{
                this.state = this.WAITING_STATE;
            }
        }
    }
    this.GetState = function() {
        return this.state;
    }
    this.Active = function(){
        //State is active at start of go but if current player starts
        //to move letters again then his state must be reset to active
        //by calling this method.
        //This can be called everytime a board letter is dropped
        this.likes = []
        this.state = this.ACTIVE_STATE
    }
    this.Submit = function(){
        //Clear likes on every submit
        this.likes = [];
        //Will only be approved if 1 player in game
        if  (this.amIApproved()){
            this.state = this.APPROVED_STATE;
        }else{
            this.state = this.WAITING_STATE;
        }
       
    }
    this.amIApproved = function(){
       var count =0;
       if  ((this.likes.length + 1) <  this.numPlayers) return false;
       for (var i=0;i<this.likes.length;i++){
           if (likes[i].like){
               count++;
           }
       }
       //Since active player cannot like then need likes of all other players
       return ((count + 1) >= this.numPlayers);
    }
}