//'positionType' is 'bag'/'drop'/'board'/'tray'.
//If 'drop' then position is x,y position in pixels
//If 'bag' then position is not used
//If 'board' position is x, y position on board
//If 'tray' then position is 0, 0-9 (tray has 10 positions)
//'owner' field is username. 'owner' not relevant in 'bag'. Main use is to identify whose tray piece is in
//
//NOTE order is only used to determine who goes first
var LETTER_SIZE = 36;
var LETTER_BLANK = {name: 'BLANKLETTER', positionType: 'bag', x:0, y:0, square:''};
var LETTER_A = { name: 'A', positionType: 'bag', x:0, y:0, square:''};
var LETTER_B = { name: 'B', positionType: 'bag', x:0, y:0, square:''};
var LETTER_C = { name: 'C', positionType: 'bag', x:0, y:0, square:''};
var LETTER_D = { name: 'D', positionType: 'bag', x:0, y:0, square:''};
var LETTER_E = { name: 'E', positionType: 'bag', x:0, y:0, square:''};
var LETTER_F = { name: 'F', positionType: 'bag', x:0, y:0, square:''};
var LETTER_G = { name: 'G', positionType: 'bag', x:0, y:0, square:''};
var LETTER_H = { name: 'H', positionType: 'bag', x:0, y:0, square:''};
var LETTER_I = { name: 'I', positionType: 'bag', x:0, y:0, square:''};
var LETTER_J = { name: 'J', positionType: 'bag', x:0, y:0, square:''};
var LETTER_K = { name: 'K', positionType: 'bag', x:0, y:0, square:''};
var LETTER_L = { name: 'L', positionType: 'bag', x:0, y:0, square:''};
var LETTER_M = { name: 'M', positionType: 'bag', x:0, y:0, square:''};
var LETTER_N = { name: 'N', positionType: 'bag', x:0, y:0, square:''};
var LETTER_O = { name: 'O', positionType: 'bag', x:0, y:0, square:''};
var LETTER_P = { name: 'P', positionType: 'bag', x:0, y:0, square:''};
var LETTER_Q = { name: 'Q', positionType: 'bag', x:0, y:0, square:''};
var LETTER_R = { name: 'R', positionType: 'bag', x:0, y:0, square:''};
var LETTER_S = { name: 'S', positionType: 'bag', x:0, y:0, square:''};
var LETTER_T = { name: 'T', positionType: 'bag', x:0, y:0, square:''};
var LETTER_U = { name: 'U', positionType: 'bag', x:0, y:0, square:''};
var LETTER_V = { name: 'V', positionType: 'bag', x:0, y:0,  square:''};
var LETTER_W = { name: 'W', positionType: 'bag', x:0, y:0, square:''};
var LETTER_X = { name: 'X', positionType: 'bag', x:0, y:0, square:''};
var LETTER_Y = { name: 'Y', positionType: 'bag', x:0, y:0, square:''};
var LETTER_Z = { name: 'Z', positionType: 'bag', x:0, y:0, square:''};
var ALPHABET = [LETTER_A, LETTER_B, LETTER_C, LETTER_D, LETTER_E,
                LETTER_F, LETTER_G, LETTER_H, LETTER_I, LETTER_J,
                LETTER_K, LETTER_L, LETTER_M, LETTER_N, LETTER_O,
                LETTER_P, LETTER_Q, LETTER_R, LETTER_S, LETTER_T,
                LETTER_U, LETTER_V, LETTER_W, LETTER_X, LETTER_Y,LETTER_Z, LETTER_BLANK];
var ALPHABET_DICTIONARY = {A: LETTER_A, B: LETTER_B, C: LETTER_C, D: LETTER_D, E: LETTER_E,
                           F: LETTER_F, G: LETTER_G, H: LETTER_H, I: LETTER_I, J: LETTER_J,
                           K: LETTER_K, L: LETTER_L, M: LETTER_M, N: LETTER_N, O: LETTER_O,
                           P: LETTER_P, Q: LETTER_Q, R: LETTER_R, S: LETTER_S, T: LETTER_T,
                           U: LETTER_U, V: LETTER_V, W: LETTER_W, X: LETTER_X, Y: LETTER_Y, Z: LETTER_Z, BLANKLETTER: LETTER_BLANK}
//DIST_DICTIONARY only used when initialising bag. DIST_DICTIONARY contains number of each letters in game
var DIST_DICTIONARY = {BLANKLETTER: 2, A: 9, B: 2, C: 2, D: 4, E: 12,
                       F: 2, G: 3, H: 2, I: 9, J: 1,
                       K: 1, L: 4, M: 2, N: 6, O: 8,
                       P: 2, Q: 1, R: 6, S: 4, T: 6,
                       U: 4, V: 2, W: 2, X: 1, Y: 2, Z: 1};

//POINTS_DICTIONARY only used when calculating score
var POINTS_DICTIONARY = {A: 1, B: 3, C: 3, D: 2, E: 1,
                         F: 4, G: 2, H: 4, I: 1, J: 8,
                         K: 5, L: 1, M: 3, N: 1, O: 1,
                         P: 3, Q: 10, R: 1, S: 1, T: 1,
                         U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10, BLANKLETTER: 0};
//ORDER_DICTIONARY only used when calculating who goes first
var ORDER_DICTIONARY =  {BLANKLETTER: 0, A: 1, B: 2, C: 3, D: 4, E: 5,
                         F: 6, G: 7, H: 8, I: 9, J: 10,
                         K: 11, L: 12, M: 13, N: 14, O: 15,
                         P: 16, Q: 17, R: 18, S: 19, T: 20,
                         U: 21, V: 22, W: 23, X: 24, Y: 25, Z: 26};
                    

function Tiles (game) {

    this.game = game;
    //Load letter images. 
    ALPHABET.forEach(letter => {
        game.load.image(letter.name, 'assets/' + letter.name + ".jpg");
    });

    this.init = function(){
        
    }
}