function Bag (noInit, letters) {
    //Gets a clone
    this.Clone =function (){
        //Clone letters
        var letters = []
        for (var i=0;i<this.letters.length;i++){
            letters.push(Object.assign({}, this.letters[i]));
        }
        var newBag = new Bag(true);
        newBag.letters = letters;
        return newBag;
    }
    this.GetMaxLettersTurn =function () {
         return 7;
    }
    this.getInitialBag = function(){
        var unmixedBag = [];
        ALPHABET.forEach(letter => {
            for (var i=0;i<letter.total;i++){
              //Take a copy of letter
              let letterCopy = Object.assign({}, letter);
              unmixedBag.push(letterCopy);
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
       //Person with lowest goes first, then second lowest goes second, etc.
       //This is slightly different to real scrabble where you go clockwise from first
       //but there is no seating postion in this online game!
       var finalTrayStates = [];
       for (var i=0;i<playerNames.length;i++){
           var trayState = new TrayState(playerNames[i]);
           var letter = this.GetTrayLetter(0);
           trayState.AddLetter(letter);
           finalTrayStates.push(trayState);
       }
    
       //Now re-arrange array with player with lowest letter first then other players
       //from a clockwise
       finalTrayStates.sort((a, b) => (a.letters[0].order > b.letters[0].order) ? 1 : -1)

       //Finally loop through finalTrays and add another 6 letters to each player in order
       for (var i=0;i<finalTrayStates.length;i++){
            for (var j=1;j<this.GetMaxLettersTurn();j++){
                finalTrayStates[i].AddLetter(this.GetTrayLetter(j))
            }
       }

       
       return finalTrayStates;
    }
    this.GetLetter = function(){
        var letter = this.letters.pop();
        return letter;
    }
    this.ReturnLetters = function(letters){
        for (var i=0;i<letters.length;i++){
           this.letters.push(letters[i]);
        }
        //Now mix bag
        this.letters = this.shuffle(this.letters);
    }
    this.GetTrayLetter = function(x){
        var letter = this.letters.pop();
        letter.positionType="tray";
        letter.y =0;
        letter.x =x;
        return letter;
    }
    if(!noInit)this.letters =  this.getInitialBag()
    if (letters) this.letters = letters;
}