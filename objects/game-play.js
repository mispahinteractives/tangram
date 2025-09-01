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
        this.level = 2;
        this.dragStartThreshold = 10;


        this.shape = this.scene.add.sprite(0, 0, "level", "shapes/level_" + this.level);
        this.shape.setOrigin(0.5);
        this.add(this.shape);
        this.shape.alpha = .00000001

        const polygonData = this.scene.cache.json.get('level2');
        console.log(polygonData);

        const graphics = this.scene.add.graphics({
            lineStyle: { width: 1, color: 0xff0000 }
        });

        polygonData.level_2.forEach((entry) => {
            const points = entry.shape;

            const polyPoints = [];
            for (let i = 0; i < points.length; i += 2) {
                polyPoints.push(new Phaser.Geom.Point(points[i], points[i + 1]));
            }

            graphics.strokePoints(polyPoints, true);
            this.add(graphics)

            graphics.x = this.shape.x - this.shape.width / 2;
            graphics.y = this.shape.y - this.shape.height / 2;
        });

        this.levelPolygons = polygonData.level_2.map((entry) => {
            return new Phaser.Geom.Polygon(entry.shape);
        });

        let toX = [-210, -159.5, -185.5, -153.5, -39, 32, 181];
        let toY = [-92.05, -92.05, -41.05, 29, 55.5, 71, 120.9];
        let toAngle = [0, 0, 0, 0, 0, 0, 0];

        let xPos = [-194, -221.5, -110.5, -53.9, 25.3, 192, 87];
        let yPos = [229.9, 324.9, 219, 315.6, 236.45, 265, 335.8];
        let angle = [30, 30, 0, 30, 30, 90, 90];

        this.shapesArr = [];

        for (let i = 0; i < xPos.length; i++) {
            let sprite = this.scene.add.sprite(xPos[i], yPos[i], "sheet", "shapes/shape" + (i + 1));
            sprite.setOrigin(0.5, 0.5);
            this.add(sprite);
            this.shapesArr.push(sprite);
            sprite.alpha = .7
            sprite.index = i;
            sprite.angle = angle[i];
            sprite.visible = false;
            sprite.xPos = xPos[i];
            sprite.yPos = yPos[i];

            let target = this.scene.add.sprite(toX[i], toY[i], "sheet", "shapes/shape" + (i + 1));
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

        this.show();
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
            const shape = this.shapesArr[i];
            shape.setInteractive({ pixelPerfect: true, alphaTolerance: 1 });

            shape.on('pointerdown', (pointer) => {
                this.pointerDownX = pointer.x;
                this.pointerDownY = pointer.y;
                this.curentSprite = shape;
                this.clicked = true;
                this.dragging = false;
            });

            shape.on('pointerup', (pointer) => {
                this.onTapUp(pointer, shape);
            });
        }

        this.scene.input.on('pointermove', (pointer) => {
            if (this.clicked && this.curentSprite && !this.dragging) {
                const dist = Phaser.Math.Distance.Between(this.pointerDownX, this.pointerDownY, pointer.x, pointer.y);
                if (dist > this.dragStartThreshold) {
                    this.dragging = true;
                }
            }
        });
    }

    update() {
        if (!this.curentSprite || !this.dragging) return;

        const mouse = this.scene.offsetMouse();
        const xPos = (mouse.x - this.x) / this.scaleX;
        const yPos = (mouse.y - this.y) / this.scaleY;

        this.curentSprite.x = xPos;
        this.curentSprite.y = yPos;
        this.bringToTop(this.curentSprite);

        const testPoint = new Phaser.Geom.Point(xPos, yPos);

        const isInsidePolygon = this.levelPolygons.some(polygon =>
            Phaser.Geom.Polygon.Contains(polygon, testPoint)
        );

        this.curentSprite.alpha = isInsidePolygon ? 1 : 0.7;

        if (this.isValidPosition(this.curentSprite)) {
            this.snapToTarget(this.curentSprite);
            this.checkWin();
            this.curentSprite = null;
        }

        console.log("Inside polygon?", isInsidePolygon);
        console.log("Pointer:", xPos, yPos, "Adjusted:", testPoint);
    }

    onTap(pointer, sprite) {
        this.pointerDownX = pointer.x;
        this.pointerDownY = pointer.y;
        this.clicked = true;
        this.dragging = false;
        this.curentSprite = sprite;
    }

    onTapUp(pointer, sprite) {
        const dist = Phaser.Math.Distance.Between(this.pointerDownX, this.pointerDownY, pointer.x, pointer.y);

        if (dist < this.dragStartThreshold) {
            // Just rotate
            sprite.angle += 15;
            sprite.angle = Phaser.Math.Angle.WrapDegrees(sprite.angle);
            sprite.disableInteractive();
            sprite.setInteractive({ pixelPerfect: true, alphaTolerance: 1 });
        }

        this.clicked = false;
        this.curentSprite = null;
    }

    snapToTarget(sprite) {
        sprite.alpha = 1;
        sprite.disableInteractive();
        sprite.x = sprite.target.x;
        sprite.y = sprite.target.y;
        sprite.angle = sprite.target.angle;
        sprite.placed = true;
    }

    checkWin() {
        let allPlaced = this.shapesArr.every(sprite => sprite.placed);

        if (allPlaced) {
            console.log("Win! All shapes placed correctly!");
        }
    }

    isValidPosition(sprite) {
        const dist = Phaser.Math.Distance.Between(sprite.x, sprite.y, sprite.target.x, sprite.target.y);
        if (dist > 30) return false;

        const spriteAngle = Phaser.Math.Angle.WrapDegrees(sprite.angle);
        const targetAngle = Phaser.Math.Angle.WrapDegrees(sprite.target.angle);

        const angleDiff = Math.abs(Phaser.Math.Angle.ShortestBetween(spriteAngle, targetAngle));

        return angleDiff <= 10;
    }

    getValidAngles(index) {
        switch (index) {
            case 0:
                return [0];
            case 1:
                return [0];
            case 2:
                return [0];
            case 3:
                return [0];
            case 4:
                return [0];
            case 5:
                return [90];
            case 6:
                return [90];
            default:
                return [0];
        }
    }

    adjust() {
        this.x = this.dimensions.gameWidth / 2;
        this.y = this.dimensions.gameHeight / 2;
    }
}