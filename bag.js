function Bag () {
    this.getInitialBag = function(){
        var unmixedBag = [];
        ALPHABET.forEach(letter => {
            for (var i=0;i<letter.total;i++){
              unmixedBag.push(letter);
            }
        });
        return this.shuffle(unmixedBag);
    }
    this.shuffle = function(array) {
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
    this.SetLetters = function(letters){
        this.letters=letters;
    }
    this.GetLetters = function(){
        return this.letters;
    }
    this.GetNumberOfLetters = function(){
        return this.letters.length;
    }
    this.GetInitialTrays = function(playerNames){
       //Loop through all playernames and pick a letter
       //Whoever has lowest letter pick first then go around clockwise
       //picking letters until everybody has 7
       var intialTrayStates = [];
       var finalTrayStates = [];
       var lowestLetter = '[' ;//This is ascii character after Z
       var lowestIndex = 0;
       for (var i=0;i<playerNames.length;i++){
           var trayState = new TrayState(playerNames[i]);
           var letter = this.getTrayLetter(0);
           trayState.AddLetter(letter);
           if (letter.name <lowestLetter){
            lowestIndex = i;
           }
           intialTrayStates.push(trayState);
       }
       //Now re-arrange array with player with lowest letter first then other players
       //from a clockwise
       var finalTrayStates = intialTrayStates.slice(lowestIndex)
       for (var i=0;i<lowestIndex;i++){
           finalTrayStates.push(intialTrayStates[i]);
       }
       //Finally loop through finalTrays and add another 6 letters to each player in order
       for (var i=0;i<finalTrayStates.length;i++){
            for (var j=1;j<7;j++){
                finalTrayStates[i].AddLetter(this.getTrayLetter(j))
            }
       }
       return finalTrayStates;
    }
    this.getTrayLetter = function(x){
        var letter = this.letters.pop();
        letter.positionType="tray";
        letter.position.y =0;
        letter.position.x =x;
        return letter;
    }
    this.letters =  this.getInitialBag()
}