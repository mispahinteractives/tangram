export class Tut1 extends Phaser.GameObjects.Container {
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

            if (i == 0) {
                dot.setFrame("tutorial/white")
            } else {
                dot.setFrame("tutorial/brown")
            }
        }

        this.lineInteracted = false;
        this.gameOver = false;

        this.gameBg = this.scene.add.sprite(0, -140, "level", "shapes/level_2");
        this.gameBg.setOrigin(0.5);
        this.gameBg.setScale(0.65);
        this.add(this.gameBg);

        this.shape = this.scene.add.sprite(0, 120, "sheet", 'shapes/shape1');
        this.shape.setOrigin(0.5);
        this.shape.setScale(0.8);
        this.add(this.shape);

        this.lineInteracted = false;

        this.hand = this.scene.add.sprite(this.shape.x + 65, this.shape.y + 50, "sheet", 'hand');
        this.hand.setOrigin(0.5);
        this.hand.setScale(0.6);
        this.hand.angle = 90;
        this.add(this.hand);
        this.hand.visible = false;

        this.tutorialText = this.scene.add.text(0, 310, this.scene.text.texts[0].intro1, {
            fontFamily: "UberMoveMedium",
            fontSize: 30,
            fill: "#ffffff",
            align: "center",
            // stroke: "#c00b00",
            // strokeThickness: 4,
        })
        this.tutorialText.setOrigin(0.5);
        this.add(this.tutorialText);
        this.tutorialText.visible = false;
    }

    showHint() {
        this.hand.visible = true;
        this.handTween();
        this.handloop = this.scene.time.addEvent({
            loop: true,
            delay: 1000,
            callback: () => {
                this.handTween();
            }
        })
    }


    handTween() {
        if (!this) return;
        if (!this.scene) return;
        this.gameOver = false;
        this.scene.tweens.add({
            targets: this.hand,
            alpha: 1,
            ease: "Linear",
            duration: 250,
            onComplete: () => {
                if (!this) return;
                if (!this.scene) return;
                this.handTween1 = this.scene.tweens.add({
                    targets: this.hand,
                    scale: { from: this.hand.scale, to: this.hand.scale - 0.1 },
                    ease: "Linear",
                    duration: 250,
                    yoyo: true,
                    onComplete: () => {
                        this.showTutorial();
                    }
                })
            }
        })
    }

    showTutorial() {
        if (!this) return;
        if (!this.scene) return;
        this.rotateTween = this.scene.tweens.add({
            targets: this.shape,
            angle: { from: this.shape.angle, to: this.shape.angle + 30 },
            ease: "Linear",
            duration: 200,
        });
    }

    startGame() {
        this.visible = true;
        this.scene.time.addEvent({
                delay: 200,
                callback: () => {
                    this.showHint()
                }
            })
            // this.tutorialText.visible = true;
            // this.scene.tweens.add({
            //     targets: this.tutorialText,
            //     scale: { from: 0, to: 1 },
            //     ease: "Linear",
            //     duration: 200,
            // });
    }

    hide() {
        if (!this.visible) return;
        // this.runTween = false;
        this.visible = false;
        if (this.handloop) this.scene.time.removeEvent(this.handloop);
        if (this.rotateTween) this.rotateTween.stop()
        if (this.handTween1) this.handTween1.stop()
    }

    showFail() {
        this.gameOver = true;
        console.log("FAIL! The ball has hit the bottom.");
        this.ballVelocityX = 0;
        this.ballVelocityY = 0;
        if (this.emitter) {
            this.emitter.stop();
        }
        setTimeout(() => {
            this.scene.cta.show();
        }, 500);
    }
}