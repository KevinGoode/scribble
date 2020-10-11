//'positionType' is 'bag'/'drop'/'board'/'tray'.
//If 'drop' then position is x,y position in pixels
//If 'bag' then position is not used
//If 'board' position is x, y position on board
//If 'tray' then position is 0, 0-9 (tray has 10 positions)
//'owner' field is username. 'owner' not relevant in 'bag'. Main use is to identify whose tray piece is in
//
//NOTE name of BLANK letter is a space. ASCI code for space < A and since BLANK goes first over A then this is fine.
var LETTER_BLANK = { name: ' ', image:'BLANKLETTER.jpg', size: 36, points: 0, total: 2, positionType: 'bag', x:0, y:0, owner: ''};
var LETTER_A = { name: 'A', image:'A.jpg', size: 36, points: 1, total: 9, positionType: 'bag', x:0, y:0, owner: ''};
var LETTER_B = { name: 'B', image:'B.jpg', size: 36, points: 3, total: 2, positionType: 'bag', x:0, y:0, owner: ''};
var LETTER_C = { name: 'C', image:'C.jpg', size: 36, points: 3, total: 2, positionType: 'bag', x:0, y:0, owner: ''};
var LETTER_D = { name: 'D', image:'D.jpg', size: 36, points: 2, total: 4, positionType: 'bag', x:0, y:0, owner: ''};
var LETTER_E = { name: 'E', image:'E.jpg', size: 36, points: 1, total: 12, positionType: 'bag', x:0, y:0, owner: ''};
var LETTER_F = { name: 'F', image:'F.jpg', size: 36, points: 4, total: 2, positionType: 'bag', x:0, y:0, owner: ''};
var LETTER_G = { name: 'G', image:'G.jpg', size: 36, points: 2, total: 3, positionType: 'bag', x:0, y:0, owner: ''};
var LETTER_H = { name: 'H', image:'H.jpg', size: 36, points: 4, total: 2, positionType: 'bag', x:0, y:0, owner: ''};
var LETTER_I = { name: 'I', image:'I.jpg', size: 36, points: 1, total: 9, positionType: 'bag', x:0, y:0, owner: ''};
var LETTER_J = { name: 'J', image:'J.jpg', size: 36, points: 8, total: 1, positionType: 'bag', x:0, y:0, owner: ''};
var LETTER_K = { name: 'K', image:'K.jpg', size: 36, points: 5, total: 1, positionType: 'bag', x:0, y:0, owner: ''};
var LETTER_L = { name: 'L', image:'L.jpg', size: 36, points: 1, total: 4, positionType: 'bag', x:0, y:0, owner: ''};
var LETTER_M = { name: 'M', image:'M.jpg', size: 36, points: 3, total: 2, positionType: 'bag', x:0, y:0, owner: ''};
var LETTER_N = { name: 'N', image:'N.jpg', size: 36, points: 1, total: 6, positionType: 'bag', x:0, y:0, owner: ''};
var LETTER_O = { name: 'O', image:'O.jpg', size: 36, points: 1, total: 8, positionType: 'bag', x:0, y:0, owner: ''};
var LETTER_P = { name: 'P', image:'P.jpg', size: 36, points: 3, total: 2, positionType: 'bag', x:0, y:0, owner: ''};
var LETTER_Q = { name: 'Q', image:'Q.jpg', size: 36, points: 10, total: 1, positionType: 'bag', x:0, y:0, owner: ''};
var LETTER_R = { name: 'R', image:'R.jpg', size: 36, points: 1, total: 6, positionType: 'bag', x:0, y:0, owner: ''};
var LETTER_S = { name: 'S', image:'S.jpg', size: 36, points: 1, total: 4, positionType: 'bag', x:0, y:0, owner: ''};
var LETTER_T = { name: 'T', image:'T.jpg', size: 36, points: 1, total: 6, positionType: 'bag', x:0, y:0, owner: ''};
var LETTER_U = { name: 'U', image:'U.jpg', size: 36, points: 1, total: 4, positionType: 'bag', x:0, y:0, owner: ''};
var LETTER_V = { name: 'V', image:'V.jpg', size: 36, points: 4, total: 2, positionType: 'bag', x:0, y:0, owner: ''};
var LETTER_W = { name: 'W', image:'W.jpg', size: 36, points: 4, total: 2, positionType: 'bag', x:0, y:0, owner: ''};
var LETTER_X = { name: 'X', image:'X.jpg', size: 36, points: 8, total: 1, positionType: 'bag', x:0, y:0, owner: ''};
var LETTER_Y = { name: 'Y', image:'Y.jpg', size: 36, points: 4, total: 2, positionType: 'bag', x:0, y:0, owner: ''};
var LETTER_Z = { name: 'Z', image:'Z.jpg', size: 36, points: 10, total: 1, positionType: 'bag', x:0, y:0, owner: ''};
var ALPHABET = [LETTER_A, LETTER_B, LETTER_C, LETTER_D, LETTER_E,
                LETTER_F, LETTER_G, LETTER_H, LETTER_I, LETTER_J,
                LETTER_K, LETTER_L, LETTER_M, LETTER_N, LETTER_O,
                LETTER_P, LETTER_Q, LETTER_R, LETTER_S, LETTER_T,
                LETTER_U, LETTER_V, LETTER_W, LETTER_X, LETTER_Y,LETTER_Z, LETTER_BLANK];

function Tiles (game) {

    this.game = game;
    //Load letter images. 
    ALPHABET.forEach(letter => {
        for (var i=0;i<letter.total;i++){
            game.load.image(letter.name, 'assets/' + letter.image);
        }
    });

    this.init = function(){
        
    }
}