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
    'sprite/maze',
    'sprite/player'
], function(LevelBase, Shape, Animation, Maze, Player) {
    'use strict';
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
                maze = new Maze.Maze(20, 10, this.createContext('maze')),
                    player = new Player.Player(this.createContext('player'),
                        this.inputHandler, this.physicsEngine, maze);

                maze.draw();
                player.draw();
                this.physicsEngine.objects = [];
                hitTest();
            };
        }
    };
    return module;
});
