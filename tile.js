//'positionType' is 'bag'/'drop'/'board'/'tray'.
//If 'drop' then position is x,y position in pixels
//If 'bag' then position is not used
//If 'board' position is x, y position on board
//If 'tray' then position is 0, 0-9 (tray has 10 positions)
//'owner' field is username. 'owner' not relevant in 'bag'. Main use is to identify whose tray piece is in
//
//NOTE order is only used to determine who goes first
var LETTER_BLANK = {order: 0, name: 'BLANKLETTER', image:'BLANKLETTER.jpg', size: 36, points: 0, total: 2, positionType: 'bag', x:0, y:0, owner: '', square:''};
var LETTER_A = { order: 1, name: 'A', image:'A.jpg', size: 36, points: 1, total: 9, positionType: 'bag', x:0, y:0, owner: '', square:''};
var LETTER_B = { order: 2, name: 'B', image:'B.jpg', size: 36, points: 3, total: 2, positionType: 'bag', x:0, y:0, owner: '', square:''};
var LETTER_C = { order: 3, name: 'C', image:'C.jpg', size: 36, points: 3, total: 2, positionType: 'bag', x:0, y:0, owner: '', square:''};
var LETTER_D = { order: 4, name: 'D', image:'D.jpg', size: 36, points: 2, total: 4, positionType: 'bag', x:0, y:0, owner: '', square:''};
var LETTER_E = { order: 5, name: 'E', image:'E.jpg', size: 36, points: 1, total: 12, positionType: 'bag', x:0, y:0, owner: '', square:''};
var LETTER_F = { order: 6, name: 'F', image:'F.jpg', size: 36, points: 4, total: 2, positionType: 'bag', x:0, y:0, owner: '', square:''};
var LETTER_G = { order: 7, name: 'G', image:'G.jpg', size: 36, points: 2, total: 3, positionType: 'bag', x:0, y:0, owner: '', square:''};
var LETTER_H = { order: 8, name: 'H', image:'H.jpg', size: 36, points: 4, total: 2, positionType: 'bag', x:0, y:0, owner: '', square:''};
var LETTER_I = { order: 9, name: 'I', image:'I.jpg', size: 36, points: 1, total: 9, positionType: 'bag', x:0, y:0, owner: '', square:''};
var LETTER_J = { order: 10, name: 'J', image:'J.jpg', size: 36, points: 8, total: 1, positionType: 'bag', x:0, y:0, owner: '', square:''};
var LETTER_K = { order: 11, name: 'K', image:'K.jpg', size: 36, points: 5, total: 1, positionType: 'bag', x:0, y:0, owner: '', square:''};
var LETTER_L = { order: 12, name: 'L', image:'L.jpg', size: 36, points: 1, total: 4, positionType: 'bag', x:0, y:0, owner: '', square:''};
var LETTER_M = { order: 13, name: 'M', image:'M.jpg', size: 36, points: 3, total: 2, positionType: 'bag', x:0, y:0, owner: '', square:''};
var LETTER_N = { order: 14, name: 'N', image:'N.jpg', size: 36, points: 1, total: 6, positionType: 'bag', x:0, y:0, owner: '', square:''};
var LETTER_O = { order: 15, name: 'O', image:'O.jpg', size: 36, points: 1, total: 8, positionType: 'bag', x:0, y:0, owner: '', square:''};
var LETTER_P = { order: 16, name: 'P', image:'P.jpg', size: 36, points: 3, total: 2, positionType: 'bag', x:0, y:0, owner: '', square:''};
var LETTER_Q = { order: 17, name: 'Q', image:'Q.jpg', size: 36, points: 10, total: 1, positionType: 'bag', x:0, y:0, owner: '', square:''};
var LETTER_R = { order: 18, name: 'R', image:'R.jpg', size: 36, points: 1, total: 6, positionType: 'bag', x:0, y:0, owner: '', square:''};
var LETTER_S = { order: 19,name: 'S', image:'S.jpg', size: 36, points: 1, total: 4, positionType: 'bag', x:0, y:0, owner: '', square:''};
var LETTER_T = { order: 20, name: 'T', image:'T.jpg', size: 36, points: 1, total: 6, positionType: 'bag', x:0, y:0, owner: '', square:''};
var LETTER_U = { order: 21, name: 'U', image:'U.jpg', size: 36, points: 1, total: 4, positionType: 'bag', x:0, y:0, owner: '', square:''};
var LETTER_V = { order: 22, name: 'V', image:'V.jpg', size: 36, points: 4, total: 2, positionType: 'bag', x:0, y:0, owner: '', square:''};
var LETTER_W = { order: 23, name: 'W', image:'W.jpg', size: 36, points: 4, total: 2, positionType: 'bag', x:0, y:0, owner: '', square:''};
var LETTER_X = { order: 24, name: 'X', image:'X.jpg', size: 36, points: 8, total: 1, positionType: 'bag', x:0, y:0, owner: '', square:''};
var LETTER_Y = { order: 25, name: 'Y', image:'Y.jpg', size: 36, points: 4, total: 2, positionType: 'bag', x:0, y:0, owner: '', square:''};
var LETTER_Z = { order: 26, name: 'Z', image:'Z.jpg', size: 36, points: 10, total: 1, positionType: 'bag', x:0, y:0, owner: '', square:''};
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