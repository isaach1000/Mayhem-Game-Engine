/**
    This class handles the AI and drawing of an enemy.

    @class Enemy
    @extends Sprite
 */
define([
    'sprite/sprite',
    'foundation/shape',
    'foundation/animation',
    'enum/direction'
], function(Sprite, Shape, Animation, Direction) {
    'use strict';

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////

    var
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
                isAnimating = false;

            function init() {
                // Extend Sprite constructor
                Sprite.Sprite.call(_this, shapes, drawer);

                // After constructing shapes around origin, translate to
                // position
                _this.x = location.x + location.width / 2;
                _this.y = location.y + location.height / 2;
            }

            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////

            Object.defineProperties(this, {
                x: {
                    get: function() {
                        return center.x;
                    },
                    set: function(newX) {
                        if (center.x !== newX) {
                            center.x = newX;
                            _this.transformation.tx = center.x;
                        }
                    }
                },

                y: {
                    get: function() {
                        return center.y;
                    },
                    set: function(newY) {
                        if (center.y !== newY) {
                            center.y = newY;
                            _this.transformation.ty = center.y;
                        }
                    }
                },

                isAnimating: {
                    get: function() {
                        return isAnimating;
                    },
                    set: function(value) {
                        isAnimating = value;
                    }
                }
            });

            // Call init to perform setup
            init();
        }
    };

    return module;
});
