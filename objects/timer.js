export class Timer extends Phaser.GameObjects.Container {
    constructor(scene, x, y, dimensions) {
        super(scene);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.scene.add.existing(this);

        this.init();
    }

    init() {

        this.timerCount = 105;
        let formattedTime = this.formatData();
        this.timedOutVale = false

        this.bg = this.scene.add.sprite(0, 0, "sheet", "Timer");
        this.bg.setScale(1)
        this.add(this.bg);

        this.txt = this.scene.add.text(-15, -20, formattedTime, {
            fontFamily: "UberMoveMedium",
            align: "center",
            fontSize: 20,
            fill: "#ffffff",
            fontStyle: "Italic",
        });
        this.txt.setOrigin(0);
        this.add(this.txt);
        this.txt.setPadding(10, 10, 10, 10);

        this.visible = false;
        // this.show()
    }

    formatData() {

        // Calculate hours, minutes, and seconds
        const hours = Math.floor(this.timerCount / 3600);
        const minutes = Math.floor((this.timerCount % 3600) / 60);
        const seconds = this.timerCount % 60;

        // Format time as HH:MM:SS
        const formattedTime =
            // String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0');

        return formattedTime;

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
            // this.start()
    }

    start() {
        if (this.timer) return;
        this.timer = this.scene.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                this.updateTimer();
            }
        })
    }

    restart() {
        this.timerCount = 105;
        this.txt.text = this.formatData()
        this.timer = "";
    }

    stop() {

        if (this.timer) {
            this.scene.time.removeEvent(this.timer);
            this.timer = "";

        }
    }

    updateTimer() {

        if (this.timedOutVale) return
        this.timerCount--;
        if (this.timerCount < 0) this.timerCount = 0;
        let formattedTime = this.formatData();
        this.txt.text = formattedTime;

        if (this.timerCount < 1) {
            this.stop();
            this.scene.time.removeEvent(this.timer);
            this.failTimer = this.scene.time.addEvent({
                delay: 1000,
                callback: () => {

                }
            })
        }
    }
}