import config from "../config.js";

export class LevelScreen extends Phaser.GameObjects.Container {
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
        this.levelArr = [];
        this.row = 5;
        this.column = 3;
        let startX = 0;
        let startY = -275;
        this.txtType = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
        this.pattern = [
            [0, 1],
            [2, 3],
            [4, 5],
            [6, 7],
            [8, 9],
        ]
        let count = 0;
        for (let i = 0; i < this.row; i++) {
            startX = -160;
            for (let j = 0; j < this.column; j++) {
                count++;
                let icon = this.scene.add.sprite(startX, startY, "level", "Locked/" + count);
                icon.setOrigin(0.5);
                this.add(icon);
                icon.visible = false

                let lock = this.scene.add.sprite(startX, startY, "level", "Lock");
                lock.setOrigin(0.5);
                this.add(lock);
                lock.visible = false;

                icon.lock = lock;
                this.levelArr.push(icon);

                icon.on("pointerdown", () => {
                    this.onDown(icon);
                })
                startX += 160;
            }
            startY += 174;
        }

        this.visible = false;
        // this.show();
    }

    onDown(sprite) {
        sprite.disableInteractive();
        this.scene.tweens.add({
            targets: sprite,
            scale: { from: sprite.scale, to: sprite.scale - 0.1 },
            ease: "Lineart",
            duration: 100,
            yoyo: true,
            onComplete: () => {
                this.hide();
                this.scene.topUi.show()
                this.scene.instruction.show();
                this.scene.gamePlay.show();
            }
        });
    }

    show() {
        this.visible = true;
        this.levelArr[this.scene.level - 1].setFrame("Unlock/" + this.scene.level);
        for (let i = 0; i < this.scene.level; i++) {
            this.levelArr[i].lock.alpha = 0
        }
        for (let i = 0; i < this.levelArr.length; i++) {
            setTimeout(() => {
                this.levelArr[i].visible = true;
                this.levelArr[i].lock.visible = true;
                this.scene.add.tween({
                    targets: [this.levelArr[i], this.levelArr[i].lock],
                    scale: { from: 0, to: this.levelArr[i].scale },
                    ease: "Back.easeOut",
                    duration: 200,
                    onComplete: () => {
                        if (i == this.levelArr.length - 1) {
                            this.enable();
                        }
                    }
                })
            }, i * 40);
        }
    }

    enable() {
        this.levelArr[this.scene.level - 1].setInteractive();
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
                this.levelArr.forEach(icon => {
                    icon.visible = false;
                })
            }
        })
    }

    adjust() {
        this.x = this.dimensions.gameWidth / 2;
        this.y = this.dimensions.gameHeight / 2 - 30;
    }
}