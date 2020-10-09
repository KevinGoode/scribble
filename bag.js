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
    this.letters =  this.getInitialBag()
}