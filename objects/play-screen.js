import config from "../config.js";

export class PlayScreen extends Phaser.GameObjects.Container {
    constructor(scene, x, y, gameScene, dimensions) {
        super(scene);
        this.scene = scene;
        this.dimensions = dimensions;
        this.x = x;
        this.y = y;
        this.gameScene = gameScene;
        this.scene.add.existing(this);

        this.init();
    }

    init() {

        this.logo = this.scene.add.sprite(0, -120, "sheet", "logo");
        this.logo.setOrigin(0.5);
        this.add(this.logo);

        this.playBtn = this.scene.add.sprite(0, 170, "sheet", "Play Button");
        this.playBtn.setOrigin(0.5);
        this.add(this.playBtn);

        this.playBtn.on('pointerdown', () => {
            this.scene.tweens.add({
                targets: this.playBtn,
                scale: { from: this.playBtn.scaleX, to: this.playBtn.scaleX - .2 },
                yoyo: true,
                duration: 100,
                ease: 'Linear',
                onComplete: () => {
                    this.playBtn.disableInteractive();
                    this.hide();
                }
            })
        });

        this.logo.visible = false;
        this.playBtn.visible = false;
        this.visible = false;
        // this.show();
    }

    show() {
        this.visible = true;
        this.logo.visible = true;
        this.scene.tweens.add({ targets: this.logo, scale: { from: 0, to: 1 }, x: { from: this.logo.x - 400, to: this.logo.x }, duration: 250, ease: 'Power2', })
        this.playBtn.visible = true;
        this.scene.tweens.add({
            targets: this.playBtn,
            scale: { from: 0, to: 1 },
            x: { from: this.playBtn.x + 400, to: this.playBtn.x },
            duration: 250,
            ease: 'Power2',
            onComplete: () => {
                this.playBtn.setInteractive();
            }
        })
    }

    hide() {
        this.playBtn.disableInteractive();
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 250,
            ease: 'Power2',
            onComplete: () => {
                this.visible = false;
                this.alpha = 1;
                this.scene.intro.show();
                // this.scene.levelScreen.show()
            }
        })
    }

    adjust() {
        this.x = this.dimensions.gameWidth / 2;
        this.y = this.dimensions.gameHeight / 2;
    }
}