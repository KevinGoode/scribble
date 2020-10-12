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
            //There will always be one letter
            var y = this.letters[0].y;
            for (var i=1;i<this.letters.length;i++){
                if(this.letters[i].y != y) return false;
            }
            return true;
        }
        this.IsWordVertical= function () {
            //Vertical if x is equal everywhere
            //There will always be one letter
            var x = this.letters[0].x;
            for (var i=1;i<this.letters.length;i++){
                if(this.letters[i].x != x) return false
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
                //All x's the same so just get first
                var x = this.letters[0];
                var sorted = yPositions.sort();
                for (var i=1;i< sorted.length;i++){
                    if (sorted[i] != (sorted[i-1] + 1)){
                        //Found gap in new letters
                        if (!this.IsOldLetterHere(x, sorted[i])) return true
                    }
                }

            }else if (this.IsWordHorizontal()){
                var xPositions = []
                for (var i=0;i<this.letters.length;i++){
                    xPositions.push(this.letters[i].x)
                }
                //All y's the same so just get first
                var y = this.letters[0];
                var sorted = xPositions.sort();
                for (var i=1;i< sorted.length;i++){
                    if (sorted[i] != (sorted[i-1] + 1)){
                        //Found gap in new letters
                        if (!this.IsOldLetterHere(sorted[i], y)) return true
                    }
                }
            }
            return false;
        }
        this.IsOldLetterHere = function(x, y) {
            for (var i=0;i<this.oldLetters.length;i++){
                if ((this.oldLetters[i].x == x)  && (this.oldLetters[i].y == y)) return true;
            }
            return false;
        }
        this.IsOldLetterAdjacent = function(x, y) {
            var left, right, up, down = nil;
            if( x > 0) left = {x: this.oldLetters[i].x -1, y: this.oldLetters[i].y}
            if (x < (BOARD_LENGTH-1)) right = {x: this.oldLetters[i].x + 1, y: this.oldLetters[i].y} 
            if( y > 0) up = {x: this.oldLetters[i].x, y: this.oldLetters[i].y - 1}
            if (y < (BOARD_LENGTH-1)) down = {x: this.oldLetters[i].x, y: this.oldLetters[i].y + 1} 
            for (var i=0;i<this.oldLetters.length;i++){
                if (left && left.x == this.oldLetters[i].y && left.y == this.oldLetters[i].y) return true;
                if (right && right.x == this.oldLetters[i].y && right.y == this.oldLetters[i].y) return true;
                if (up && up.x == this.oldLetters[i].y && up.y == this.oldLetters[i].y) return true;
                if (down && down.x == this.oldLetters[i].y && down.y == this.oldLetters[i].y) return true;
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
        this.isIntArrayContinuous = function(array){
            var sorted = array.sort();
            for (var i=1;i< sorted.length;i++){
                if (sorted[i] != (sorted[i-1] + 1)) return false;
            }
            return true;
        }
    }