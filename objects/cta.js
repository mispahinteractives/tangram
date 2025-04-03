import config from "../config.js";

export class CTA extends Phaser.GameObjects.Container {
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

        this.countValue = 0;

        this.bg = this.scene.add.sprite(0, 0, 'game_bg').setOrigin(0.5);
        this.add(this.bg);

        // this.logo = this.scene.add.sprite(0, -250, "sheet", 'logo').setOrigin(0.5).setScale(.8);
        // this.add(this.logo);

        // this.bestText = this.scene.add.text(0, 190, this.scene.text.texts[0].best, {
        //     fontFamily: "UberMoveMedium",
        //     fontSize: 50,
        //     fill: "#000000",
        //     align: "center",
        // });
        // this.bestText.setOrigin(0.5);
        // this.add(this.bestText);

        // this.playBtn = this.scene.add.sprite(0, 320, "sheet", 'play');
        // this.playBtn.setOrigin(0.5);
        // this.add(this.playBtn);

        // this.playBtn.setInteractive();
        // this.playBtn.on("pointerdown", () => {
        //     this.ctaClick(this.playBtn)
        // });

        this.visible = false;
    }

    ctaClick(sprite) {
        if (this.done) return;
        sprite.disableInteractive();
        this.scene.restart();
        this.done = true;
        this.scene.time.addEvent({
            delay: 10000,
            callback: () => {
                this.done = false;
                sprite.setInteractive();
            }
        })
    }
    show() {
        if (this.visible) return;
        this.visible = true;
        // this.scene.hideUI();

        this.alpha = 0;

        this.scene.tweens.add({
            targets: this,
            alpha: { from: 0, to: 1 },
            ease: "Linear",
            duration: 200,
            onComplete: () => {

            }
        })
    }

    adjust() {
        this.x = this.dimensions.gameWidth / 2;
        this.y = this.dimensions.gameHeight / 2;

        this.bg.setScale(1);
        let scaleX = this.dimensions.actualWidth / this.bg.displayWidth;
        let scaleY = this.dimensions.actualHeight / this.bg.displayHeight;
        let scale = Math.max(scaleX, scaleY);
        this.bg.setScale(scale);

        this.bg.x = this.dimensions.gameWidth / 2 - this.x;
        this.bg.y = this.dimensions.gameHeight / 2 - this.y;
    }

    hide() {
        this.scene.tweens.add({
            targets: this,
            alpha: {
                from: 1,
                to: 0
            },
            ease: "Linear",
            duration: 100,
            onComplete: () => {
                this.alpha = 1;
                this.visible = false;
            }
        });
    }
}