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

    var COLLISION_DELAY = 50;

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

                // Search QuadTree on mousemove with COLLISION_DELAY ms delay
                _this.inputHandler.bind('mousemove', function() {
                    _this.physicsEngine.collisionQuery(
                        mousePoint).forEach(
                        function(shape) {
                            if (shape.collisionTest(mousePoint)) {
                                shape.drawingSettings.fillStyle =
                                    'yellow';
                                shape.update();
                            }
                        });
                }, COLLISION_DELAY);
            }

            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////

            this.start = function() {
                var
                rect = new Shape.Rectangle(300, 300, 100, 100,
                    _this.mainDrawer, {
                        fillStyle: 'orange',
                        angle: 0
                    }),
                    tileMap = new TileMap.TileMap(0, 0, 70, 70, 20, 10,
                        _this.bgDrawer, [{
                            fillStyle: '#7CF2EC'
                    }]);

                tileMap.draw();
                rect.draw();

                var
                omega = Math.PI / 2000,
                    angleTolerance = Math.PI / 1000,
                    rectAnimation = new Animation.Animation(rect,
                        function(time, timeDiff) {
                            rect.rotate(timeDiff * omega);
                        });

                rectAnimation.start();

                this.physicsEngine.objects = [rect];
                hitTest();
            };
        }
    };
    return module;
});
