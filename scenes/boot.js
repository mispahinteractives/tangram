export default class Boot extends Phaser.Scene {

    width = null
    height = null
    handlerScene = null
    sceneStopped = false

    constructor() {
        super({ key: 'boot' })
    }

    init() {}

    preload() {
        this.load.image('bg', 'assets/bg.jpg');
        this.load.image('loading_bar_unfilled', 'assets/loading_bar_unfilled.png');
        this.load.image('loading_bar_filled', 'assets/loading_bar_filled.png');
        this.load.image('shape1', 'assets/shape1.png');
        this.load.atlas('sheet', 'assets/sheet.png', 'assets/sheet.json');

        this.load.script('webfont', 'lib/webfont.js');
        this.load.plugin('rextagtextplugin', 'lib/rextagtextplugin.min.js', true);
        // this.load.audio('bgm_loop', 'sounds/bgm_loop.mp3');
        // this.load.audio('bonus', 'sounds/bonus.mp3');
        // this.load.audio('bounce', 'sounds/bounce.mp3');
        // this.load.audio('fail', 'sounds/fail.mp3');
        // this.load.audio('win', 'sounds/win.mp3');

    }

    create() {


        this.scene.stop('boot');
        this.scene.launch('preload');
    }
}