export class Instruction extends Phaser.GameObjects.Container {
    constructor(scene, x, y, gameScene, dimensions, ) {
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

        this.initialLevel = 1;

        this.text = this.scene.add.text(0, 0, this.scene.text.texts[0].levelTxt + "-" + this.initialLevel, {
            fontFamily: "UberMoveMedium",
            align: "center",
            fontSize: 35,
            fill: "#ffffff",
            fontStyle: "Italic",
        });
        this.text.setOrigin(0.5);
        this.add(this.text);

        this.text1 = this.scene.add.text(0, 65, this.scene.text.texts[0].intro1, {
            fontFamily: "UberMoveMedium",
            align: "center",
            fontSize: 20,
            fill: "#ffffff",
            fontStyle: "Italic",
        });
        this.text1.setOrigin(0.5);
        this.text1.setLineSpacing(2);
        this.add(this.text1);

        this.text.visible = false;
        this.text1.visible = false;

        this.visible = false;
        // this.show();
    }

    show() {
        this.visible = true;
        this.text.visible = true;
        this.scene.tweens.add({ targets: this.text, x: { from: this.text.x + 400, to: this.text.x }, duration: 250, ease: 'Power2', })
        this.text1.visible = true;
        this.scene.tweens.add({ targets: this.text1, x: { from: this.text1.x - 400, to: this.text.x }, duration: 250, ease: 'Power2', })
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
        this.y = this.dimensions.topOffset + 138;

    }
}