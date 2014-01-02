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
    'sprite/player',
    'sprite/enemy',
    'enum/direction'
], function(LevelBase, Shape, Animation, Maze, Player, Enemy, Direction) {
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
                var pos = $('canvas').first().position();
                // Update mousePoint on every mousemove
                _this.inputHandler.bind('mousemove', function(ev) {
                    mousePoint = {
                        x: ev.pageX - pos.left,
                        y: ev.pageY - pos.top
                    };
                });

                // Search QuadTree on mousemove with COLLISION_DELAY ms delay
                _this.inputHandler.bind('mousemove', function() {
                    _this.physicsEngine.collisionQuery(mousePoint)
                        .forEach(function(shape) {
                            console.debug(shape);
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
                    enemy = new Enemy.Enemy(8, 8, maze, this.physicsEngine,
                        this.createContext('enemy')),
                    player = new Player.Player(1, 1, maze, this.inputHandler,
                        this.physicsEngine, this.createContext('player'));

                maze.draw();
                enemy.draw();
                player.draw();
                this.physicsEngine.objects = [enemy, player];
                hitTest();

                enemy.addMoves([Direction.UP, Direction.DOWN, Direction.DOWN]);
                enemy.start();
            };
        }
    };
    return module;
});
