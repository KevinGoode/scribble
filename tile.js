//'positionType' is 'bag'/'drop'/'board'/'tray'.
//If 'drop' then position is x,y position in pixels
//If 'bag' then position is not used
//If 'board' position is x, y position on board
//If 'tray' then position is 0, 0-9 (tray has 10 positions)
//'owner' field is username. 'owner' not relevant in 'bag'. Main use is to identify whose tray piece is in
var LETTER_A = { name: 'A', image:'A.jpg', points: 1, total: 9, positionType: 'bag', position: {x: 0, y:0}, owner: ''};
var LETTER_B = { name: 'B', image:'B.jpg', points: 3, total: 2, positionType: 'bag', position: {x: 0, y:0}, owner: ''};
var LETTER_C = { name: 'C', image:'C.jpg', points: 3, total: 2, positionType: 'bag', position: {x: 0, y:0}, owner: ''};
var LETTER_D = { name: 'D', image:'D.jpg', points: 2, total: 4, positionType: 'bag', position: {x: 0, y:0}, owner: ''};
var LETTER_E = { name: 'E', image:'E.jpg', points: 1, total: 12, positionType: 'bag', position: {x: 0, y:0}, owner: ''};
var LETTER_F = { name: 'F', image:'F.jpg', points: 4, total: 2, positionType: 'bag', position: {x: 0, y:0}, owner: ''};
var LETTER_G = { name: 'G', image:'G.jpg', points: 2, total: 3, positionType: 'bag', position: {x: 0, y:0}, owner: ''};
var LETTER_H = { name: 'H', image:'H.jpg', points: 4, total: 2, positionType: 'bag', position: {x: 0, y:0}, owner: ''};
var LETTER_I = { name: 'I', image:'I.jpg', points: 1, total: 9, positionType: 'bag', position: {x: 0, y:0}, owner: ''};
var LETTER_J = { name: 'J', image:'J.jpg', points: 8, total: 1, positionType: 'bag', position: {x: 0, y:0}, owner: ''};
var LETTER_K = { name: 'K', image:'K.jpg', points: 5, total: 1, positionType: 'bag', position: {x: 0, y:0}, owner: ''};
var LETTER_L = { name: 'L', image:'L.jpg', points: 1, total: 4, positionType: 'bag', position: {x: 0, y:0}, owner: ''};
var LETTER_M = { name: 'M', image:'M.jpg', points: 3, total: 2, positionType: 'bag', position: {x: 0, y:0}, owner: ''};
var LETTER_N = { name: 'N', image:'N.jpg', points: 1, total: 6, positionType: 'bag', position: {x: 0, y:0}, owner: ''};
var LETTER_O = { name: 'O', image:'O.jpg', points: 1, total: 8, positionType: 'bag', position: {x: 0, y:0}, owner: ''};
var LETTER_P = { name: 'P', image:'P.jpg', points: 3, total: 2, positionType: 'bag', position: {x: 0, y:0}, owner: ''};
var LETTER_Q = { name: 'Q', image:'Q.jpg', points: 10, total: 1, positionType: 'bag', position: {x: 0, y:0}, owner: ''};
var LETTER_R = { name: 'R', image:'R.jpg', points: 1, total: 6, positionType: 'bag', position: {x: 0, y:0}, owner: ''};
var LETTER_S = { name: 'S', image:'S.jpg', points: 1, total: 4, positionType: 'bag', position: {x: 0, y:0}, owner: ''};
var LETTER_T = { name: 'T', image:'T.jpg', points: 1, total: 6, positionType: 'bag', position: {x: 0, y:0}, owner: ''};
var LETTER_U = { name: 'U', image:'U.jpg', points: 1, total: 4, positionType: 'bag', position: {x: 0, y:0}, owner: ''};
var LETTER_V = { name: 'V', image:'V.jpg', points: 4, total: 2, positionType: 'bag', position: {x: 0, y:0}, owner: ''};
var LETTER_W = { name: 'W', image:'W.jpg', points: 4, total: 2, positionType: 'bag', position: {x: 0, y:0}, owner: ''};
var LETTER_X = { name: 'X', image:'X.jpg', points: 8, total: 1, positionType: 'bag', position: {x: 0, y:0}, owner: ''};
var LETTER_Y = { name: 'Y', image:'Y.jpg', points: 4, total: 2, positionType: 'bag', position: {x: 0, y:0}, owner: ''};
var LETTER_Z = { name: 'Z', image:'Z.jpg', points: 10, total: 1, positionType: 'bag', position: {x: 0, y:0}, owner: ''};
var ALPHABET = [LETTER_A, LETTER_B, LETTER_C, LETTER_D, LETTER_E,
                LETTER_F, LETTER_G, LETTER_H, LETTER_I, LETTER_J,
                LETTER_K, LETTER_L, LETTER_M, LETTER_N, LETTER_O,
                LETTER_P, LETTER_Q, LETTER_R, LETTER_S, LETTER_T,
                LETTER_U, LETTER_V, LETTER_W, LETTER_X, LETTER_Y,LETTER_Z];

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