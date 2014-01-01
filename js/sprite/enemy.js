/**
    This class handles the AI and drawing of an enemy.

    @class Enemy
    @extends Sprite
 */
define([
    'sprite/abstractPlayer',
    'foundation/shape',
    'foundation/animation'
], function(AbstractPlayer, Shape, Animation) {
    'use strict';

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////

    var
    MOVE_DELAY = 1000,
        FILL_STYLE = '#7CF2EC',
        RADIUS = 20,
        MARGIN = 1;

    /**
        @module sprite/enemy
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        /**
             @class Enemy
             @constructor
             @param {integer} row Row in maze
             @param {integer} column Column in maze
             @param {Maze} maze Maze instance
             @param {Engine} Engine instance
             @param {CanvasDrawer} CanvasDrawer instance
             @param {string} Fill style of enemy
         */
        Enemy: function(row, column, maze, physicsEngine, drawer,
            fillStyle) {
            var _this = this;

            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////

            var
            location = maze.get(row, column),
                center = {
                    x: 0,
                    y: 0
                },
                head = new Shape.Circle(center.x, center.y,
                    RADIUS, drawer, {
                        fillStyle: fillStyle || FILL_STYLE,
                        strokeStyle: 'black'
                    }),
                shapes = [head],
                movesQueue = [];

            /**
                Initialization method

                @method init
                @private
                @return {void}
             */
            function init() {
                // Extend AbstractPlayer constructor
                AbstractPlayer.AbstractPlayer.call(_this, row, column, maze,
                    physicsEngine, drawer, shapes);
            }

            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////

            /**
                Perform an action if possible

                @method act
                @return {void}
             */
            this.act = function() {
                if (!this.isAnimating && movesQueue.length > 0) {
                    this.move(movesQueue.pop());
                }
            };

            /**
                Add moves to the moves queue

                @method addMoves
                @param  {Array} moves An array of directions to move in
             */
            this.addMoves = function(moves) {
                movesQueue = moves.reverse().concat(movesQueue);
            };

            /**
                Clear moves from the moves queue

                @method clearMoves
                @return {void}
             */
            this.clearMoves = function() {
                movesQueue = [];
            };

            this.start = function() {
                function recursiveAct() {
                    if (_this.canMove()) {
                        _this.act();
                        setTimeout(function() {
                            recursiveAct();
                        }, MOVE_DELAY);
                    }
                }
                recursiveAct();
            };

            // Call init to perform setup
            init();
        }
    };

    return module;
});
