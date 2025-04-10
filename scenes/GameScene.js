import {
    fullScreen
} from '../utils/screen.js'
import {
    pointerUp
} from '../utils/buttons.js'
import {
    CTA
} from '../objects/cta.js'
import string from "../string.js";
import portrait from '../data/portrait.js';
import landscape from '../data/landscape.js';
import config from '../config.js';
import {
    GamePlay
} from '../objects/game-play.js';
import { PlayScreen } from '../objects/play-screen.js';
import { TopUi } from '../objects/top-ui.js';
import { Instruction } from '../objects/instruction.js';

let dimensions = {}
export default class GameScene extends Phaser.Scene {

    // Vars

    constructor() {
        super('GameScene')
    }

    preload() {

        this.levelIndex = 0;

        if (dimensions.isPortrait != dimensions.fullWidth < dimensions.fullHeight) {
            this.switchMode(!dimensions.isPortrait);
        } else {
            this.switchMode(dimensions.isPortrait);
        }

        let ratio = window.devicePixelRatio;
        dimensions.fullWidth = window.innerWidth * ratio;
        dimensions.fullHeight = window.innerHeight * ratio;

        this.scale.displaySize.setAspectRatio(dimensions.fullWidth / dimensions.fullHeight);
        this.scale.refresh();

        this.scale.lockOrientation(this.game.orientation);
    }

    create() {

        this.setGameScale();

        document.getElementById("loader").style.visibility = 'hidden'

        this.text = string;
        // window.restart = true;

        this.superGroup = this.add.container();
        this.gameGroup = this.add.container();
        this.superGroup.add(this.gameGroup);

        this.bg = this.add.sprite(0, 0, 'bg').setOrigin(0.5);
        this.gameGroup.add(this.bg);

        this.gamePlay = new GamePlay(this, 0, 0, this, dimensions);
        this.gameGroup.add(this.gamePlay);

        this.topUi = new TopUi(this, 0, 0, this, dimensions);
        this.gameGroup.add(this.topUi);

        this.instruction = new Instruction(this, 0, 0, this, dimensions);
        this.gameGroup.add(this.instruction);

        this.playScreen = new PlayScreen(this, 0, 0, this, dimensions);
        this.gameGroup.add(this.playScreen);

        this.logo = this.add.sprite(0, 0, "sheet", 'shape1/shape_1').setOrigin(0.5).setScale(0.4);
        this.gameGroup.add(this.logo);
        this.logo.visible = false

        this.cta = new CTA(this, 0, 0, this, dimensions);
        this.gameGroup.add(this.cta);

        this.gameOver = false;
        this.setPositions();
        try {
            dapi.addEventListener("adResized", this.gameResized.bind(this));
        } catch (error) {
            this.scale.on('resize', this.gameResized, this)
        }
        this.gameResized();

        if (window.restart) {
            this.firstTouchDetected = false;
            // this.gamePlay.startGame()
        }

        this.firstTouch();
    }

    firstTouch() {

        this.input.on('pointerdown', this.firstTouchEvent, this);
    }

    firstTouchEvent() {
        if (this.firstTouchDetected) return
        this.firstTouchDetected = true;
        console.log('First touch detected!');
        // this.bgm = this.sound.add('bgm_loop', {
        //     loop: true,
        //     volume: 1
        // });
        // this.bgm.play();
        // this.intro.hide();
    }

    hideUI() {
        this.tweens.add({
            targets: [this.tutorial, this.gamePlay],
            alpha: 0,
            ease: "Linear",
            duration: 250,
        })
    }
    restart(val) {
        window.restart = true;
        this.scene.restart()
    }

    destroySounds() {
        this.sound.mute = !this.sound.mute;
    }

    update(time, deltaTime) {
        super.update();
        this.gamePlay.update();
    }

    setGameScale() {
        let scaleX = dimensions.fullWidth / dimensions.gameWidth;
        let scaleY = dimensions.fullHeight / dimensions.gameHeight;
        this.gameScale = (scaleX < scaleY) ? scaleX : scaleY;

        dimensions.actualWidth = this.game.canvas.width / this.gameScale;
        dimensions.actualHeight = this.game.canvas.height / this.gameScale;
        dimensions.leftOffset = -(dimensions.actualWidth - dimensions.gameWidth) / 2;
        dimensions.rightOffset = dimensions.gameWidth - dimensions.leftOffset;
        dimensions.topOffset = -(dimensions.actualHeight - dimensions.gameHeight) / 2;
        dimensions.bottomOffset = dimensions.gameHeight - dimensions.topOffset;
    }

    switchMode(isPortrait) {

        dimensions.isPortrait = isPortrait;
        dimensions.isLandscape = !isPortrait;

        let mode = portrait;

        if (dimensions.isLandscape)
            mode = landscape;

        dimensions.gameWidth = mode.gameWidth;
        dimensions.gameHeight = mode.gameHeight;
    }

    gameResized() {
        let ratio = 1;

        try {
            if (`${PLATFORM}` !== "tiktok") {
                try {
                    if (mraid) {
                        var screenSize = mraid.getScreenSize();
                        mraid.setResizeProperties({
                            "width": screenSize.width,
                            "height": screenSize.height,
                            "offsetX": 0,
                            "offsetY": 0
                        });
                        mraid.expand();
                    }
                } catch (e) {

                }
            }
        } catch (e) {

        }


        if (window.screen.systemXDPI !== undefined && window.screen.logicalXDPI !== undefined && window.screen.systemXDPI > window.screen.logicalXDPI)
            ratio = window.screen.systemXDPI / window.screen.logicalXDPI;
        else if (window.devicePixelRatio !== undefined)
            ratio = window.devicePixelRatio;

        try {
            let size = dapi.getScreenSize();

            dimensions.fullWidth = size.width;
            dimensions.fullHeight = size.height;
        } catch (e) {
            dimensions.fullWidth = Math.ceil(window.innerWidth * ratio);
            dimensions.fullHeight = Math.ceil(window.innerHeight * ratio);
        }

        dimensions.ratio = ratio;

        if (this.game.canvas.width === dimensions.fullWidth && this.game.canvas.height === dimensions.fullHeight) {
            return;
        }

        if (dimensions.isPortrait != dimensions.fullWidth < dimensions.fullHeight) {
            this.switchMode(!dimensions.isPortrait);
        } else {
            this.switchMode(dimensions.isPortrait);
        }

        this.game.scale.setGameSize(dimensions.fullWidth, dimensions.fullHeight);

        this.game.canvas.style.width = dimensions.fullWidth + 'px';
        this.game.canvas.style.height = dimensions.fullHeight + 'px';
        this.game.scale.updateBounds();
        this.game.scale.refresh()

        this.setGameScale();
        this.setPositions();
    }

    setPositions() {

        this.superGroup.scale = (this.gameScale);
        this.gameGroup.x = (this.game.canvas.width / this.gameScale - dimensions.gameWidth) / 2;
        this.gameGroup.y = (this.game.canvas.height / this.gameScale - dimensions.gameHeight) / 2;

        this.bg.setScale(1);
        let scaleX = dimensions.actualWidth / this.bg.displayWidth;
        let scaleY = dimensions.actualHeight / this.bg.displayHeight;
        let scale = Math.max(scaleX, scaleY);
        this.bg.setScale(scale);

        this.bg.x = dimensions.gameWidth / 2;
        this.bg.y = dimensions.gameHeight / 2;

        this.logo.x = dimensions.gameWidth / 2 - 200;
        this.logo.y = dimensions.topOffset + 80;

        this.gamePlay.adjust();
        this.cta.adjust();
        this.topUi.adjust();
        this.instruction.adjust();
        this.playScreen.adjust();
    }

    offsetMouse() {

        return {
            x: (this.game.input.activePointer.worldX * dimensions.actualWidth / dimensions.fullWidth) + ((dimensions.gameWidth - dimensions.actualWidth) / 2),
            y: (this.game.input.activePointer.worldY * dimensions.actualHeight / dimensions.fullHeight) + ((dimensions.gameHeight - dimensions.actualHeight) / 2)
        };
    }

    offsetWorld(point) {
        return { x: (point.x * dimensions.actualWidth / dimensions.fullWidth), y: (point.y * dimensions.actualHeight / dimensions.fullHeight) };
    }
}