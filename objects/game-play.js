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

        this.shape = this.scene.add.sprite(0, 0, "shape2");
        this.shape.setOrigin(0.5);
        this.add(this.shape);

        let toX = [-210, -159.5, -185.5, -153.5, -39, 32, 181];
        let toY = [-92.05, -92.05, -41.05, 29, 55.5, 71, 120.9];
        let toAngle = [0, 0, 0, 0, 0, 0, 0];

        let xPos = [-194, -221.5, -110.5, -53.9, 25.3, 192, 87];
        let yPos = [229.9, 324.9, 219, 315.6, 236.45, 265, 335.8];
        let angle = [45, 30, 0, 45, 45, 90, 90];

        this.shapesArr = [];

        for (let i = 0; i < xPos.length; i++) {
            let sprite = this.scene.add.sprite(xPos[i], yPos[i], "sheet", "shape2/shape" + (i + 1));
            sprite.setOrigin(0.5, 0.5);
            this.add(sprite);
            this.shapesArr.push(sprite);
            sprite.index = i;
            sprite.angle = angle[i];
            sprite.visible = false;
            sprite.xPos = xPos[i];
            sprite.yPos = yPos[i];

            let target = this.scene.add.sprite(toX[i], toY[i], "sheet", "shape2/shape" + (i + 1));
            target.setOrigin(0.5, 0.5);
            target.alpha = 0.00000001
            this.add(target);
            target.angle = toAngle[i];
            sprite.target = target;

            sprite.on('pointerdown', (pointer) => {
                this.onTap(pointer, sprite);
            });

            sprite.on('pointerup', (pointer) => {
                this.onTapUp(pointer, sprite);
            });
        }

        this.visible = false;
        this.shape.visible = false;
    }

    show() {
        this.visible = true;
        this.shape.visible = true;
        this.scene.tweens.add({
            targets: this.shape,
            scale: { from: 0, to: this.shape.scaleX },
            duration: 250,
            ease: 'Power2',
            onComplete: () => {
                for (let i = 0; i < this.shapesArr.length; i++) {
                    this.scene.time.addEvent({
                        delay: 100 * i,
                        callback: () => {
                            this.shapesArr[i].visible = true;
                            this.scene.tweens.add({
                                targets: this.shapesArr[i],
                                scale: { from: 2, to: this.shapesArr[i].scaleX },
                                duration: 250,
                                ease: 'Power2',
                                onComplete: () => {
                                    if (i == this.shapesArr.length - 1) {
                                        this.enable();
                                    }
                                }
                            })
                        }
                    })
                }

            }
        })
    }

    enable() {
        for (let i = 0; i < this.shapesArr.length; i++) {
            this.shapesArr[i].setInteractive({ pixelPerfect: true, alphaTolerance: 1 });
        }
        this.scene.input.setDraggable(this.shapesArr);
    }
    update() {
        if (!this.curentSprite) return;

        let pointer = this.scene.input.activePointer;
        let movedDistance = Phaser.Math.Distance.Between(this.pointerDownX, this.pointerDownY, pointer.x, pointer.y);
        if (this.curentSprite && !this.dragging && movedDistance > this.dragStartThreshold) {
            this.dragging = true;
        }
        if (this.curentSprite && this.dragging && this.clicked) {
            let mouse = this.scene.offsetMouse();
            let xPos = (mouse.x - this.x) / this.scaleX;
            let yPos = (mouse.y - this.y) / this.scaleY;
            let leftX = this.dimensions.leftOffset - this.x + 30;
            let rightX = this.dimensions.rightOffset - this.x - 30;
            let topY = this.dimensions.topOffset - this.y + 30;
            let bottomY = this.dimensions.bottomOffset - this.y - 30;

            this.curentSprite.x = xPos;
            this.curentSprite.y = yPos;
            this.bringToTop(this.curentSprite);
            if (this.curentSprite.x < leftX || this.curentSprite.x > rightX || this.curentSprite.y < topY || this.curentSprite.y > bottomY) {
                this.scene.tweens.add({
                    targets: this.curentSprite,
                    x: this.shapesArr[this.curentSprite.index].xPos,
                    y: this.shapesArr[this.curentSprite.index].yPos,
                    duration: 300,
                    ease: 'Back.easeOut',
                    onComplete: () => {
                        this.clicked = false;
                        this.curentSprite = null;
                    }
                });
            }
        }
    }

    onTap(pointer, sprite) {
        this.pointerDownX = pointer.x;
        this.pointerDownY = pointer.y;
        this.clicked = true;
        this.dragging = false;
        this.curentSprite = sprite;
    }

    onTapUp(pointer, sprite) {
        let dist = Phaser.Math.Distance.Between(this.pointerDownX, this.pointerDownY, pointer.x, pointer.y);

        if (dist < this.dragStartThreshold) {
            sprite.angle += 15;
            sprite.angle = Phaser.Math.Angle.WrapDegrees(sprite.angle);
            sprite.disableInteractive();
            sprite.setInteractive({ pixelPerfect: true, alphaTolerance: 1 });
        } else {
            if (this.isValidPosition(sprite)) {
                sprite.disableInteractive();
                sprite.x = sprite.target.x;
                sprite.y = sprite.target.y;
                sprite.placed = true;
            } else {
                this.scene.tweens.add({
                    targets: sprite,
                    x: this.shapesArr[sprite.index].xPos,
                    y: this.shapesArr[sprite.index].yPos,
                    duration: 300,
                    ease: 'Back.easeOut'
                });
            }
            this.checkWin();
        }

        this.clicked = false;
        this.curentSprite = null;
    }

    checkWin() {
        let allPlaced = this.shapesArr.every(sprite => sprite.placed);

        if (allPlaced) {
            console.log("Win! All shapes placed correctly!");
        }
    }

    isValidPosition() {
        const sprite = this.curentSprite;
        if (!sprite) return false;

        const dist = Phaser.Math.Distance.Between(sprite.x, sprite.y, sprite.target.x, sprite.target.y);
        if (dist >= 30) return false;

        const validAngles = this.getValidAngles(sprite.index);
        const spriteAngle = Phaser.Math.Angle.WrapDegrees(sprite.angle);

        return validAngles.some(targetAngle =>
            Math.abs(Phaser.Math.Angle.ShortestBetween(spriteAngle, targetAngle)) <= 10
        );
    }

    getValidAngles(index) {
        switch (index) {
            case 0:
                return [0];
            case 1:
                return [0];
            case 2:
                return [0, 90];
            case 3:
                return [0];
            case 4:
                return [0];
            case 5:
                return [0];
            case 6:
                return [0, 180];
            default:
                return [0];
        }
    }

    adjust() {
        this.x = this.dimensions.gameWidth / 2;
        this.y = this.dimensions.gameHeight / 2 + 50;
    }
}