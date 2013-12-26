/**
    MainLevel contains all of the logic necessary for the main level of the
    game.

    @class MainLevel
    @extends LevelBase
 */
define(['jquery', 'level/levelBase', 'foundation/shape', 'foundation/animation',
    'sprite/human', 'sprite/tileMap'
], function($, LevelBase, Shape, Animation, Human, TileMap) {
    "use strict";
    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////

    /**
       @module level/mainLevel
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////
        /**
            @class MainLevel
            @constructor
        */
        MainLevel: function() {
            var _this = this;

            // Extend LevelBase constructor
            LevelBase.LevelBase.call(this);

            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////

            // mousePoint to keep track of cursor
            var mousePoint;

            function hitTest() {
                // Update mousePoint on every mousemove
                _this.inputHandler.bind('mousemove', function(ev) {
                    mousePoint = {
                        x: ev.pageX,
                        y: ev.pageY
                    };
                });
                // QuadTree on mousemove with 50 ms delay
                _this.inputHandler.bind('mousemove', function() {
                    _this.quadTree.query(mousePoint).forEach(function(
                        shape) {
                        if (shape.collisionTest(mousePoint)) {
                            shape.clear();
                            shape.drawingSettings.fillStyle =
                                'yellow';
                            shape.draw();
                        }
                    });
                }, 50);
            }

            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////

            this.start = function() {
                var poly = new Shape.Polygon({
                    x: 100,
                    y: 400
                }, [{
                    x: 100,
                    y: 0
                }, {
                    x: -100,
                    y: 0
                }, {
                    x: 0,
                    y: 100
                }], _this.mainDrawer, {
                    fillStyle: 'purple',
                    angle: 0
                });
                var rect = new Shape.Rectangle(100, 100, 50, 50, _this.mainDrawer, {
                    fillStyle: 'orange',
                    angle: 0
                });
                poly.draw();
                rect.draw();

                var
                speed = 0.1,
                    omega = Math.PI / 500,
                    omega2 = omega / 5,
                    angleTolerance = Math.PI / 1000;

                var polyAnimation = new Animation.Animation(poly, function(
                    time, timeDiff) {
                    poly.x += timeDiff * speed;
                    poly.transformation.rotate(timeDiff * omega);
                    return poly.x >= 500;
                }, function() {
                    polyAnimation = new Animation.Animation(poly,
                        function(time, timeDiff) {
                            poly.y -= timeDiff * speed;
                            // Readjust
                            if (poly.angle > angleTolerance) {
                                poly.transformation.rotate(-omega2);
                            }
                            return poly.y <= 100;
                        });
                    polyAnimation.start();
                });

                this.quadTree.insert(poly).insert(rect);
                hitTest();
                polyAnimation.start();
            };
        }
    };
    return module;
});
