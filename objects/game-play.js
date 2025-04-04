import config from "../config.js";

export class GamePlay extends Phaser.GameObjects.Container {
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
        this.level = 1;
        this.dragStartThreshold = 10;

        this.shape = this.scene.add.sprite(0, -260, "shape1");
        this.shape.setOrigin(0.5);
        this.add(this.shape);

        let xPos = [-150, 160, 190, -30, -150, 150, 0];
        let yPos = [350, 110, 230, 200, 100, 320, 90];
        let angle = [30, 60, 90, 120, 150, 180, 210];

        let toX = [-0.5, -127.5, -43.5, 81.5, -88, -1.5, 84.5];
        let toY = [-87.45, -41.45, 0.5, -0.45, 88, 85.5, 127.5];
        let toAngle = [0, 0, 0, 0, 0, 0, 0];

        this.shapesArr = [];

        for (let i = 0; i < xPos.length; i++) {
            let sprite = this.scene.add.sprite(xPos[i], yPos[i], "sheet", "shape1/shape_" + (i + 1));
            sprite.setOrigin(0.5, 0.5);
            this.add(sprite);
            this.shapesArr.push(sprite);
            sprite.index = i;
            sprite.angle = angle[i];

            let target = this.scene.add.sprite(toX[i], this.shape.y + toY[i], "sheet", "shape1/shape_" + (i + 1));
            target.setOrigin(0.5, 0.5);
            target.alpha = 0.00000001
            this.add(target);
            target.angle = toAngle[i];
            sprite.target = target;

            sprite.setInteractive({ pixelPerfect: true, alphaTolerance: 1 });

            sprite.on('pointerup', () => {
                sprite.angle += 30;
                sprite.angle = Phaser.Math.Angle.WrapDegrees(sprite.angle);
            });

            this.scene.input.setDraggable(sprite);
            sprite.on('dragstart', function(pointer) {
                this.onTap(pointer, sprite);
            }.bind(this));
            this.scene.input.on('dragend', function(pointer) {
                this.onTapUp();
            }.bind(this));

        }
    }
    update() {
        if (!this.curentSprite) return;

        let pointer = this.scene.input.activePointer;
        let movedDistance = Phaser.Math.Distance.Between(this.pointerDownX, this.pointerDownY, pointer.x, pointer.y);

        if (!this.dragging && movedDistance > this.dragStartThreshold) {
            this.dragging = true;
        }
        if (this.dragging && this.clicked) {
            let mouse = this.scene.offsetMouse();
            let xPos = (mouse.x - this.x) / this.scaleX;
            let yPos = (mouse.y - this.y) / this.scaleY;
            this.curentSprite.x = xPos;
            this.curentSprite.y = yPos;
            this.bringToTop(this.curentSprite);
        }
    }

    onTap(pointer, sprite) {
        this.pointerDownX = pointer.downX;
        this.pointerDownY = pointer.downY;
        this.dragging = false;
        this.clicked = true;
        this.curentSprite = sprite;
        this.curentSprite.startX = this.curentSprite.x;
        this.curentSprite.startY = this.curentSprite.y;
    }

    onTapUp() {
        if (!this.curentSprite || !this.dragging) return;
        this.clicked = false;
        this.dragging = false;
        if (this.isValidPosition(this.curentSprite)) {
            this.curentSprite.disableInteractive();
            this.curentSprite.x = this.curentSprite.target.x;
            this.curentSprite.y = this.curentSprite.target.y;
            this.curentSprite.placed = true;
        } else {
            this.curentSprite.x = this.curentSprite.startX;
            this.curentSprite.y = this.curentSprite.startY;
        }
        this.checkWin();
    }

    checkWin() {
        let allPlaced = this.shapesArr.every(sprite => sprite.placed);

        if (allPlaced) {
            console.log("Win! All shapes placed correctly!");
        }
    }

    isValidPosition() {
        let sprite = this.curentSprite;
        let dist = Phaser.Math.Distance.Between(sprite.x, sprite.y, sprite.target.x, sprite.target.y);
        let angleDiff = Phaser.Math.Angle.ShortestBetween(sprite.angle, sprite.target.angle);

        return dist < 30 && Math.abs(angleDiff) < 10; // 10° tolerance
    }

    adjust() {
        this.x = this.dimensions.gameWidth / 2;
        this.y = this.dimensions.gameHeight / 2 + 50;
    }
}