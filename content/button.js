function Button (game, name, imagePath, width, height, onclick) {
    // https://phaser.io/examples/v2/buttons/action-on-click
    // https://phaser.io/docs/2.6.2/Phaser.Button.html
    //Width and height are sizer of individual button images
    //This component assumes there are 3 images with image 0: normal, 1: lighter, 2: flatter
    this.game = game;
    this.imagePath = imagePath;
    this.name = name;
    this.onclick = onclick;
    game.load.spritesheet(name, imagePath, width, height);
    this.actionOnClick = function(button) {
        this.onclick(button);
    }
    this.init = function(x, y){
        this.button = this.game.add.button(x, y, this.name, this.actionOnClick, this, 1, 0, 2, 1);
    }
}