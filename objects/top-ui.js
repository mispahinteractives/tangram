import { Coin } from "./coin.js";
import { Count } from "./count.js";
import { Timer } from "./timer.js";

export class TopUi extends Phaser.GameObjects.Container {
    constructor(scene, x, y, gameScene, dimensions) {

        super(scene);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.gameScene = gameScene;
        this.dimensions = dimensions;
        this.scene.add.existing(this);
        this.init();
    }

    init() {
        this.timer = new Timer(this.scene, 0, 0);
        this.add(this.timer);

        this.coin = new Coin(this.scene, 0, 0);
        this.add(this.coin);

        this.countBar = new Count(this.scene, 0, 0);
        this.add(this.countBar);

        this.backBtn = this.scene.add.sprite(-220, 0, "sheet", "Back button");
        this.backBtn.setScale(1)
        this.backBtn.setOrigin(0.5);
        this.add(this.backBtn);
        this.backBtn.visible = false;

        this.backBtn.on('pointerdown', () => {
            this.scene.tweens.add({
                targets: this.backBtn,
                scale: { from: this.backBtn.scaleX, to: this.backBtn.scaleX - .2 },
                yoyo: true,
                duration: 100,
                ease: 'Linear',
                onComplete: () => {
                    this.backBtn.disableInteractive();
                    this.hide();
                    // this.scene.instruction.hide();
                    // this.scene.playScreen.show();
                }
            })
        })
        this.visible = false;
        // this.show()
    }

    show() {
        this.visible = true;
        this.timer.show();
        this.coin.show();
        this.countBar.show();
        this.backBtn.visible = true;
        this.scene.add.tween({
                targets: this.backBtn,
                alpha: { from: 0, to: 1, },
                ease: "Linear",
                duration: 200,
                onComplete: () => {
                    this.backBtn.setInteractive();
                }
            })
            // this.timer.start()
    }

    hide() {
        if (!this.visible) return;
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 250,
            ease: 'Power2',
            onComplete: () => {
                this.visible = false;
                this.alpha = 1;
            }
        })
    }

    adjust() {
        this.x = this.dimensions.gameWidth / 2;
        this.y = this.dimensions.topOffset + 40;

        this.timer.x = 180;
        this.timer.y = 0;

        this.coin.x = 35;
        this.coin.y = 0;

        this.countBar.x = -115;
        this.countBar.y = 0;
    }
}