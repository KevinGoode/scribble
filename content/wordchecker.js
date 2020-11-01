function WordChecker (letters, oldLetters) {
        this.letters = letters;
        this.oldLetters = oldLetters;

        //Tests whether new letters are in a straight line
        this.AreLettersStraight = function(){
            var XEqual = this.IsWordHorizontal();
            var YEqual = this.IsWordVertical();
            return (XEqual || YEqual)
        }
        this.IsWordHorizontal  = function () {
            //Horizontal if y is equal everywhere
            if (this.letters.length > 0){
                var y = this.letters[0].y;
                for (var i=1;i<this.letters.length;i++){
                    if(this.letters[i].y != y) return false;
                }
            }
            return true;
        }
        this.IsWordVertical= function () {
            //Vertical if x is equal everywhere
            if (this.letters.length > 0){
                var x = this.letters[0].x;
                for (var i=1;i<this.letters.length;i++){
                    if(this.letters[i].x != x) return false
                }
            }
            return true;
        }

        this.AreLettersContinuous = function() {
            if (this.IsWordVertical()){
                var yPositions = []
                for (var i=0;i<this.letters.length;i++){
                    yPositions.push(this.letters[i].y)
                }
                return this.isIntArrayContinuous(yPositions);
            }else if (this.IsWordHorizontal()){
                var xPositions = []
                for (var i=0;i<this.letters.length;i++){
                    xPositions.push(this.letters[i].x)
                }
                return this.isIntArrayContinuous(xPositions);
            }
            return false;
        }
        this.AreThereGapsInWord = function(){
            if (this.IsWordVertical()){
                var yPositions = []
                for (var i=0;i<this.letters.length;i++){
                    yPositions.push(this.letters[i].y)
                }
                if (this.letters.length > 0){
                    //All x's the same so just get first
                    var x = this.letters[0].x;
                    var sorted = yPositions.sort();
                    for (var i=1;i< sorted.length;i++){
                        if (sorted[i] != (sorted[i-1] + 1)){
                            //Found gap in new letters
                            for (var j=sorted[i-1]+1;j<sorted[i]; j++) {
                                if (!this.IsOldLetterHere(x, j)) return true
                            }
                        }
                    }
                }

            }else if (this.IsWordHorizontal()){
                var xPositions = []
                for (var i=0;i<this.letters.length;i++){
                    xPositions.push(this.letters[i].x)
                }
                if (this.letters.length > 0){
                    //All y's the same so just get first
                    var y = this.letters[0].y;
                    var sorted = xPositions.sort();
                    for (var i=1;i< sorted.length;i++){
                        if (sorted[i] != (sorted[i-1] + 1)){
                            //Found gap in new letters
                            for (var j=sorted[i-1]+1;j<sorted[i]; j++) {
                                if (!this.IsOldLetterHere(j, y)) return true
                            }
                        }
                    }
                }
            }
            return false;
        }
        this.IsOldLetterHere = function(x, y) {
            for (var i=0;i<this.oldLetters.length;i++){
                if ((this.oldLetters[i].x == x)  && (this.oldLetters[i].y == y)) return this.oldLetters[i];
            }
            return null;
        }
        this.IsOldLetterAdjacent = function(x, y) {
            var nb = this.getNeighbours(x, y);
            for (var i=0;i<this.oldLetters.length;i++){
                if (nb.left && nb.left.x == this.oldLetters[i].x && nb.left.y == this.oldLetters[i].y) return true;
                if (nb.right && nb.right.x == this.oldLetters[i].x && nb.right.y == this.oldLetters[i].y) return true;
                if (nb.up && nb.up.x == this.oldLetters[i].x && nb.up.y == this.oldLetters[i].y) return true;
                if (nb.down && nb.down.x == this.oldLetters[i].x && nb.down.y == this.oldLetters[i].y) return true;
            }
            return false;
        }
        this.AreThereAdjacentLetters =function (){
            //Checks if any new letters are next to any old letters
            for (var i=0;i<this.letters.length;i++){
                if(this.IsOldLetterAdjacent(this.letters[i].x, this.letters[i].y)) return true;
            }
            return false;
        }

        //It is possible somebody skips or changes letters on first turn so only way to check first lay
        // is to look at existing letters
        this.IsFirstLay = function(){
            return (this.oldLetters.length == 0);
        }
        this.DoLettersGoThroughMiddleSquare =function (){
            for (var i=0;i<this.letters.length;i++){
            if ((this.letters[i].x == 7)  && (this.letters[i].y == 7)) return true;
            }
            return false;
        }
        this.GetScore = function() {
            var mainWord = this.getScoreOfMainWord();
            var score =mainWord.score;
            var scores = this.getScoresOfOtherWords(mainWord);
            for (var i=0;i<scores.length;i++){
                score +=scores[i].score;
            }
            return score;
        }
        this.isIntArrayContinuous = function(array){
            var sorted = array.sort();
            for (var i=1;i< sorted.length;i++){
                if (sorted[i] != (sorted[i-1] + 1)) return false;
            }
            return true;
        }
        this.getScoreOfMainWord = function(){
            var isVertical = true;
            var word = this.getLettersClone();
            var insertions = [] ; //used if word criss-crosses another
            
            if (this.IsWordVertical()){
                //Sort word from top to bottom
                this.sortTopToBottom(word);
                //All x's the same so just get first
                var x = word[0].x;
                var above = this.IsOldLetterHere(x, word[0].y-1)
                var below = this.IsOldLetterHere(x, word[word.length-1].y+1)
                if (above)  this.insertLettersAbove(word,above);
                if (below)  this.insertLettersBelow(word,below);
                //Grab inserted characters and insert later
                var insertions = []
                for (var i=1;i<word.length;i++){
                    if (word[i].y != (word[i-1].y + 1)){
                        //Found gap in new letters
                        for (var j=word[i-1].y+1;j<word[i].y; j++) {
                            //Should have already validated word so we know there is an old letter here
                            insertions.push({old: this.IsOldLetterHere(x, j), index: i});
                        }
                    }
                }

            }else if (this.IsWordHorizontal()){
                isVertical = false;
                //Sort word from left to right
                this.sortLeftToRight(word);
                //All x's the same so just get first
                var y = word[0].y;
                var left = this.IsOldLetterHere(word[0].x-1, y)
                var right = this.IsOldLetterHere(word[word.length-1].x+1, y)
                if (left)  this.insertLettersLeft(word,left);
                if (right) this.insertLettersRight(word,right);
                for (var i=1;i<word.length;i++){
                    if (word[i].x != (word[i-1].x + 1)){
                        //Found gap in new letters
                        for (var j=word[i-1].x+1;j<word[i].x; j++) {
                            //Should have already validated word so we know there is an old letter here
                            insertions.push({old: this.IsOldLetterHere(j, y), index: i});
                        }
                    }
                }
            }
            //Go through and insert insertions to form complete word
            for (var i=0;i<insertions.length;i++){
                word.splice(insertions[i].index, 0 , insertions[i].old)
            }
            //We have word now calculate score
            return this.getScoreOfWord(word, isVertical);
            
        }
        this.getNeighbours = function(x,y){
            var left, right, up, down = null;
            if( x > 0) left = {x: x -1, y: y}
            if (x < (BOARD_LENGTH-1)) right = {x: x + 1, y: y} 
            if( y > 0) up = {x: x, y: y - 1}
            if (y < (BOARD_LENGTH-1)) down = {x: x, y: y + 1} 
            return {left: left, right: right, up: up, down:down}
        }
        this.getScoreOfWord= function(word, isVertical){
            var wordScore = 0;
            var doubleWord =false;
            var tripleWord = false;
            var name = "";
            //word is an ordered array of old and new letters
            for (var i=0;i<word.length;i++){
                name += word[i].name;
                var letterScore = POINTS_DICTIONARY[word[i].name];
                if (word[i].new && (word[i].square == "DoubleLetter")) letterScore=letterScore*2;
                if (word[i].new && (word[i].square == "TripleLetter")) letterScore=letterScore*3;
                if (word[i].new && (word[i].square == "DoubleWord")) doubleWord = true;
                if (word[i].new && (word[i].square == "TripleWord")) tripleWord = true;
                wordScore+=letterScore;
            }
            if (doubleWord) wordScore = wordScore*2;
            if (tripleWord) wordScore = wordScore*3;
            console.log("Word "+ name + " has score " + wordScore.toString());
            return {score: wordScore, name: name, isVertical:isVertical, letters: word}
        }
        this.getScoresOfOtherWords = function(mainWord){
            var scores = [];
            for (var i=0;i<mainWord.letters.length;i++){
                var nb = this.getAdjacentLetters(mainWord.letters[i].x, mainWord.letters[i].y);
                //The main word may contain old letters.
                //These must be ignored when considering other
                //perpendicular words 
                //Single new word to left
                var word = [];
                if (mainWord.letters[i].new){
                   if(mainWord.isVertical){
                      //Get left and right characters and calculate the score of horizontal words
                      if (nb.left || nb.right){
                            word.push(mainWord.letters[i]);
                            //This should also work in unlikely scenario where a vertical word comes between
                            //two hozizontal making a single new word. IE letters to left and to right
                        if (nb.left){  
                            this.insertLettersLeft(word, nb.left);
                        }//Left
                        if (nb.right){
                           this.insertLettersRight(word, nb.right);
                        }//Right
                        //Add a new horizontal word
                        if (word.length>0) scores.push(this.getScoreOfWord(word,false));
                      } //Left or rigth
                   }else {
                       //Get left and right characters and calculate the score of horizontal words
                      if (nb.up || nb.down){
                        word.push(mainWord.letters[i]);
                        //This should also work in unlikely scenario where a horizontal word comes between
                        //two vertical making a single new word. IE letters up and down
                        if (nb.up){  
                            this.insertLettersAbove(word,nb.up)
                        }//Up
                        if (nb.down){
                            this.insertLettersBelow(word, nb.down)
                        }//Down
                        //Add a new vertical word
                        if (word.length>0) scores.push(this.getScoreOfWord(word,true));
                      }//up or down
                   }// else If verttical
                }//If new
              } //End of for
           return scores;
        }
        this.getAdjacentLetters = function(x, y) {
            var adjacent = {}
            var nb = this.getNeighbours(x, y);
            for (var i=0;i<this.oldLetters.length;i++){
                if (nb.left && nb.left.x == this.oldLetters[i].x && nb.left.y == this.oldLetters[i].y){
                    adjacent.left = this.oldLetters[i];
                }
                else if (nb.right && nb.right.x == this.oldLetters[i].x && nb.right.y == this.oldLetters[i].y){
                    adjacent.right = this.oldLetters[i];
                }
                else if (nb.up && nb.up.x == this.oldLetters[i].x && nb.up.y == this.oldLetters[i].y){
                    adjacent.up = this.oldLetters[i];
                }
                else if (nb.down && nb.down.x == this.oldLetters[i].x && nb.down.y == this.oldLetters[i].y){
                    adjacent.down = this.oldLetters[i];
                }
            }
            return adjacent;
        }
        this.getLettersClone = function(){
           //Clones array and inserts a 'new' flag to distinguish betweeen
           //old letters we might insert
           var cloneArray = [];
           for (var i=0;i<this.letters.length;i++){
               var clone =  Object.assign({}, this.letters[i]);
               clone.new = true;
               cloneArray.push(clone);
           }
           return cloneArray;
        }
        this.insertLettersRight =function(word, letterRight){
            if(letterRight){
                word.push(letterRight);
                var x = letterRight.x +1;
                var y = letterRight.y;
                old=this.IsOldLetterHere(x, y)
                while (old){
                    word.push(old)
                    x++;
                    old=this.IsOldLetterHere(x, y)
                }
            }
        }
        this.insertLettersLeft = function (word, leftLetter){
            if(leftLetter){
                word.push(leftLetter);
                var x = leftLetter.x -1;
                var y = leftLetter.y;
                old=this.IsOldLetterHere(x, y)
                while (old){
                    word.push(old)
                    x--;
                    old=this.IsOldLetterHere(x, y)
                }
                this.sortLeftToRight(word);
            }
        }
        this.insertLettersAbove = function(word, aboveLetter){
            if(aboveLetter){
                word.push(aboveLetter);
                var y = aboveLetter.y -1;
                var x = aboveLetter.x;
                old=this.IsOldLetterHere(x, y)
                while (old){
                    word.push(old)
                    y--;
                    old=this.IsOldLetterHere(x, y)
                }
                this.sortTopToBottom(word)
            }
        }
        this.insertLettersBelow = function(word, belowLetter){
            if(belowLetter){
                word.push(belowLetter);
                var y = belowLetter.y + 1;
                var x = belowLetter.x;
                old=this.IsOldLetterHere(x, y)
                while (old){
                    word.push(old)
                    y++;
                    old=this.IsOldLetterHere(x, y)
                }
            }
        }
        this.sortLeftToRight = function(arrayWithPos){
            arrayWithPos.sort((a, b) => (a.x > b.x) ? 1 : -1)
        }
        this.sortTopToBottom= function(arrayWithPos){
            arrayWithPos.sort((a, b) => (a.y > b.y) ? 1 : -1)
        }
    }