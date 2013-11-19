// @formatter:off
define(['level/levelBase', 'foundation/polygon', 'foundation/rectangle',
        'foundation/circle', 'sprite/tileMap', 'foundation/animation',
        'util/boundingBox', 'util/physics'],
    function(LevelBase, Polygon, Rectangle, Circle, TileMap, Animation,
            BoundingBox, Physics) {
    "use strict";
    // @formatter:on

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////

    /**
     * @exports level/mainLevel
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        /**
         * MainLevel, extends [LevelBase]{@link
         * module:level/levelBase.LevelBase}
         * @constructor
         * @extends {LevelBase}
         */
        MainLevel : function() {
            // Extend LevelBase constructor
            LevelBase.LevelBase.call(this);

            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////

            var _this = this, mouseTime = new Date(), MOUSE_WAIT = 50;

            var circleTest = function(drawer, quadTree) {
                // @formatter:off
                var circ = new Circle.Circle(100, 100, 50, drawer, {
                    lineWidth : 4,
                    strokeStyle : 'black',
                    fillStyle : 'green'
                }),
                startY = circ.y,
                vx = 1,
                vy = 0,
                FRAME_DURATION = 1000 / 60,
                MAX_Y = 300,
                circAnim = new Animation.Animation(circ,
                    function(durationElapsed) {
                    // @formatter:on
                    circ.x += vx;

                    vy += Physics.GRAVITY * FRAME_DURATION;
                    if (circ.y > MAX_Y && vy > 0) {
                        vy = -vy * Physics.ENERGY_LOSS_RATIO;
                    }
                    circ.y += vy;

                    return circ.x < 1000;
                });

                quadTree.insert(circ);
                circ.draw();

                circAnim.start();
            }, polyTest = function(drawer, quadTree) {
                var poly = new Polygon.Polygon([{
                    x : 100,
                    y : 200
                }, {
                    x : 300,
                    y : 200
                }, {
                    x : 100,
                    y : 600
                }], drawer, {
                    lineWidth : 4,
                    strokeStyle : 'black',
                    fillStyle : 'blue'
                });
                quadTree.insert(poly);
                poly.draw();
            }, rectTest = function(drawer, quadTree) {
                var rect = new Rectangle.Rectangle(300, 200, 100, 100, drawer, {
                    lineWidth : 4,
                    strokeStyle : 'black',
                    fillStyle : 'red'
                });
                quadTree.insert(rect);
                rect.draw();
            }, tileTest = function(drawer, quadTree) {
                var tileMap = new TileMap.TileMap(100, 100, 50, 75, 3, 4, drawer, [{
                    lineWidth : 3,
                    fillStyle : 'purple'
                }]);
                quadTree.insert(tileMap);
                tileMap.draw();
            }, mouseTest = function(quadTree) {
                var mouseX, mouseY;

                $('body').mousemove(function(e) {
                    mouseX = e.pageX;
                    mouseY = e.pageY;
                });

                var mouseCollision = function() {
                    // Set the current time.
                    var currentTime = new Date(), i, box, hitShapes, numShapes, shape, newSettings;
                    // If the time is greater than MOUSE_WAIT and coordinates
                    // are
                    // set, perform hit testing.
                    if (currentTime - mouseTime >= MOUSE_WAIT && mouseX !== undefined && mouseY !== undefined) {
                        box = new BoundingBox.BoundingBox(mouseX, mouseY, 1, 1);
                        hitShapes = quadTree.queryRange(box);
                        numShapes = hitShapes.length;

                        for ( i = 0; i < numShapes; i += 1) {
                            shape = hitShapes[i];
                            if (shape.collisionTest({
                                x : mouseX,
                                y : mouseY
                            })) {
                                shape.drawingSettings.strokeStyle = 'yellow';
                                shape.update();
                            }
                        }

                        mouseTime = currentTime;
                    }

                    setTimeout(mouseCollision, MOUSE_WAIT);
                };

                mouseCollision();
            };

            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////

            polyTest(_this.bgDrawer, _this.quadTree);
            rectTest(_this.bgDrawer, _this.quadTree);
            circleTest(_this.mainDrawer, _this.quadTree);
            tileTest(_this.bgDrawer, _this.quadTree);
            mouseTest(_this.quadTree);
        }
    };

    return module;
});
