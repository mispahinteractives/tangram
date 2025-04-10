import config from "../config.js";

export class Count extends Phaser.GameObjects.Container {
    constructor(scene, x, y, color, ) {
        super(scene);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.scene.add.existing(this);
        this.color = color;
        // this.totalValue = value;

        this.init();
    }

    show() {

        if (this.visible) return;
        this.visible = true;
        this.scene.add.tween({
            targets: this,
            alpha: {
                from: 0,
                to: 1,
            },
            ease: "Linear",
            duration: 200,
            onComplete: () => {}
        })
    }
    init() {
        this.currentValue = 10;

        this.bg = this.scene.add.sprite(0, 0, "sheet", "Magnifying Glass");
        this.bg.setScale(1)
        this.add(this.bg);

        this.text = this.scene.add.text(5, -15, this.currentValue, {
            fontFamily: "UberMoveMedium",
            align: "center",
            fontSize: 20,
            fill: "#ffffff",
            fontStyle: "Italic",
        });
        this.text.setOrigin(0);
        this.add(this.text);

        this.visible = false;
        // this.show()
    }
    updateCount(val) {
        this.currentValue += val;
        this.text.text = this.currentValue

        if (this.currentValue <= 0) {
            this.currentValue = 0;
            this.text.text = this.currentValue;

        }
    }

    decreaseCount(val) {

        this.currentValue -= val;
        if (this.currentValue <= 0) {
            this.currentValue = 0;
        }
        this.text.text = this.currentValue

    }

    reset() {
        this.currentValue = 0;
        this.text.text = this.currentValue
    }
}