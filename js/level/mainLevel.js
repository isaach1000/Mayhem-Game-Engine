/**
    MainLevel contains all of the logic necessary for the main level of the
    game.

    @class MainLevel
    @extends LevelBase
 */
define([
    'level/levelBase',
    'foundation/shape',
    'foundation/animation',
    'sprite/tileMap'
], function(LevelBase, Shape, Animation, TileMap) {
    "use strict";
    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////

    var QUAD_DELAY = 100;

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
                // Search QuadTree on mousemove with QUAD_DELAY ms delay
                _this.inputHandler.bind('mousemove', function() {
                    _this.quadTree.query(mousePoint).forEach(function(
                        shape) {
                        if (shape.collisionTest(mousePoint)) {
                            shape.drawingSettings.fillStyle =
                                'yellow';
                            shape.update();
                        }
                    });
                }, QUAD_DELAY);
            }

            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////

            this.start = function() {
                var poly = new Shape.Polygon({
                    x: 0,
                    y: 400
                }, [{
                    x: 0,
                    y: 0
                }, {
                    x: 100,
                    y: 0
                }, {
                    x: 0,
                    y: 100
                }], _this.mainDrawer, {
                    fillStyle: 'purple',
                    angle: 0
                }),
                    rect = new Shape.Rectangle(100, 100, 50, 50, _this.mainDrawer, {
                        fillStyle: 'orange',
                        angle: 0
                    }),
                    circle = new Shape.Circle(105, 105, 30, _this.createContext(
                        'circle'), {
                        fillStyle: 'green'
                    }),
                    tileMap = new TileMap.TileMap(0, 0, 70, 70, 20, 10,
                        _this.bgDrawer, [{
                            fillStyle: '#7CF2EC'
                    }]);

                tileMap.draw();
                poly.draw();
                rect.draw();
                circle.draw();

                var speed = 0.1,
                    omega = Math.PI / 2000,
                    omega2 = omega / 2,
                    angleTolerance = Math.PI / 1000;

                var polyAnimation = new Animation.Animation(poly,
                    function(time, timeDiff) {
                        poly.x += timeDiff * speed;
                        poly.rotate(timeDiff * omega);
                        return poly.x >= 500;
                    }, function() {
                        polyAnimation = new Animation.Animation(
                            poly, function(time, timeDiff) {
                                poly.y -= timeDiff * speed;
                                // Readjust
                                if (poly.angle > angleTolerance) {
                                    poly.rotate(-omega2);
                                }
                                return poly.y <= 100;
                            });
                        polyAnimation.start();
                    });

                var rectAnimation = new Animation.Animation(rect,
                    function(time, timeDiff) {
                        rect.rotate(timeDiff * omega);
                    });
                rectAnimation.start();

                this.quadTree.insert(poly).insert(rect);
                hitTest();
                polyAnimation.start();
            };
        }
    };
    return module;
});
