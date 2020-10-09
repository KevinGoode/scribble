function Tray (game, imagePath) {
    var numberPositions
    var trayCharWidth = 44;
    var trayCharHeight = 44;
    this.NumberPositions = 8;
    this.game = game;
    this.imagePath = imagePath;
    this.tray = []
    this.width = this.NumberPositions * trayCharWidth;
    this.height = trayCharHeight
    game.load.image("Tray", imagePath );
 
    this.init = function(x, y){
        
        var offset = 0;
        for (var i=0;i<10;i+=1){
            this.tray.push( {'position': i, 'sprite':this.game.add.sprite(x  + offset, y, 'Tray')});
            offset += trayCharWidth;
        }
    }
}