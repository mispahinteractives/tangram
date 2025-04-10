export class Coin extends Phaser.GameObjects.Container {
    constructor(scene, x, y, color, ) {
        super(scene);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.scene.add.existing(this);

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
        this.currentValue = 0;
        this.totalCount = 500;

        this.bg = this.scene.add.sprite(0, 0, "sheet", "Coin");
        this.bg.setScale(1)
        this.add(this.bg);

        this.countTxt = this.scene.add.text(0, -21, this.currentValue, {
            fontFamily: "UberMoveMedium",
            align: "center",
            fontSize: 20,
            fill: "#ffffff",
            fontStyle: "Italic",
        });
        this.countTxt.setOrigin(0);
        this.add(this.countTxt);
        this.countTxt.setPadding(10, 10, 10, 10);

        this.visible = false
            // this.show();
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
            ease: "Power0",
            duration: 100
        })
    }

    updateCount(value) {
        if (this.totalCount <= this.currentValue) return
        let diff = 10;
        let count = 0;

        this.scoreTimer = this.scene.time.addEvent({
            delay: 25,
            loop: true,
            callback: () => {
                count += diff;

                if (count > value) {
                    if (this.scoreTimer) this.scene.time.removeEvent(this.scoreTimer);
                    this.scoreTimer = ""
                } else {
                    this.currentValue += diff
                    this.countTxt.text = this.getValue(this.currentValue).text;
                    this.countTxt.count1 = this.getValue(this.currentValue).count;
                }
            }
        })
    }

    decreaseCount(value) {
        if (this.totalCount <= 0) return
        let diff = 10;

        let count = 0;

        this.scoreTimer = this.scene.time.addEvent({
            delay: 10,
            loop: true,
            callback: () => {
                count += diff;

                if (count > value) {
                    if (this.scoreTimer) this.scene.time.removeEvent(this.scoreTimer);
                    this.scoreTimer = "";
                } else {
                    this.totalCount -= diff;
                    this.countTxt.text = this.getValue(this.totalCount).text;

                }
            }
        })
    }

    getValue(count) {
        let text = `${count}`;
        return {
            text,
            count
        };
    }

    reset() {
        this.currentValue = 0;
        this.countTxt.text = this.currentValue
    }
}