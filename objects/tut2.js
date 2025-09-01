export class Tut2 extends Phaser.GameObjects.Container {
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
        this.frame = this.scene.add.sprite(0, -50, "sheet", "frame");
        this.frame.setOrigin(0.5);
        this.add(this.frame);

        let xPos = [-10, 10];
        let yPos = [0, 0.3];

        for (let i = 0; i < xPos.length; i++) {
            let dot = this.scene.add.sprite(xPos[i], yPos[i] + 200, "sheet", "tutorial/white")
                .setOrigin(0.5)
            this.add(dot);

            if (i == 1) {
                dot.setFrame("tutorial/white")
            } else {
                dot.setFrame("tutorial/brown")
            }
        }

        this.gameOver = false;

        this.gameBg = this.scene.add.sprite(0, -140, "level", "shapes/level_2");
        this.gameBg.setOrigin(0.5);
        this.gameBg.setScale(0.65);
        this.add(this.gameBg);

        this.shape = this.scene.add.sprite(0, 120, "sheet", 'shapes/shape1');
        this.shape.setOrigin(0.5);
        this.shape.setScale(0.8);
        this.shape.angle = -45
        this.add(this.shape);

        this.hand = this.scene.add.sprite(this.shape.x + 75, this.shape.y + 40, "sheet", 'hand');
        this.hand.setOrigin(0.5);
        this.hand.setScale(0.6);
        this.hand.angle = 90;
        this.add(this.hand);
        this.hand.visible = false;

        // this.tutorialText = this.scene.add.text(0, 310, this.scene.text.texts[0].intro2, {
        //     fontFamily: "UberMoveMedium",
        //     fontSize: 30,
        //     fill: "#ffffff",
        //     align: "center",
        //     // stroke: "#c00b00",
        //     // strokeThickness: 4,
        // })
        // this.tutorialText.setOrigin(0.5);
        // this.add(this.tutorialText);
        // this.tutorialText.visible = false;

        this.visible = false;
    }

    showHint() {
        this.hand.visible = true;

        this.tween1 = this.scene.tweens.add({
            targets: this.shape,
            x: { from: this.shape.x, to: this.gameBg.x - 64 },
            y: { from: this.shape.y, to: this.gameBg.y - 73 },
            ease: "Linear",
            duration: 700,
        });
        this.tween1 = this.scene.tweens.add({
            targets: this.hand,
            x: { from: this.hand.x, to: this.gameBg.x + 15 },
            y: { from: this.hand.y, to: this.gameBg.y - 25 },
            ease: "Linear",
            duration: 700,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.hand,
                    alpha: 0,
                    ease: "Linear",
                    duration: 200,
                })
            }
        });
    }

    startGame() {
        this.visible = true;
        this.scene.time.addEvent({
            delay: 350,
            callback: () => {
                this.showHint()
            }
        })
    }

    hide() {
        if (!this.visible) return;
        this.runTween = false;
        this.visible = false;
        if (this.tween1) this.tween1.stop()

    }
}