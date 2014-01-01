/**
    The Player class handles the actions and drawing of the main player.

    @class Player
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
    HEAD_STYLE = 'yellow',
        EYE_STYLE = 'black',
        MOUTH_STYLE = 'black',
        MOUTH_MAX = 2;

    /**
        @module sprite/player
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        /**
             @class Player
             @constructor
             @param {integer} row Row in maze
             @param {integer} column Column in maze
             @param {Maze} maze Maze instance
             @param {InputHandler} InputHandler instance
             @param {Engine} Engine instance
             @param {CanvasDrawer} CanvasDrawer instance
         */

        Player: function(row, column, maze, inputHandler, physicsEngine,
            drawer) {
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
                head = new Shape.Circle(center.x, center.y, 18,
                    drawer, {
                        fillStyle: HEAD_STYLE
                    }),
                eye = new Shape.Circle(center.x + 10, center.y - 5, 4,
                    drawer, {
                        fillStyle: EYE_STYLE
                    }),
                mouth = new Shape.Rectangle(center.x + 5, center.y + 5, 12,
                    3, drawer, {
                        fillStyle: MOUTH_STYLE
                    }),
                shapes = [head, eye, mouth],
                isAnimating = false,
                previousMove;

            function init() {
                // Extend Sprite constructor
                Sprite.Sprite.call(_this, shapes, drawer);

                // After constructing shapes around origin, translate to
                // position
                _this.x = location.x + location.width / 2;
                _this.y = location.y + location.height / 2;

                var
                cycleDuration = 600,
                    mouthAnim = new Animation.Animation(_this, function(
                        time) {
                        mouth.transformation.sy = MOUTH_MAX * Math.sin(
                            time / cycleDuration * Math.PI * 2);
                    });

                mouthAnim.start();
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

            this.move = function(keyCode) {
                if (this.isAnimating) {
                    return;
                }

                var newLocation, dx, dy, sx, angle;

                switch (keyCode) {
                    case Direction.LEFT:
                        newLocation = location.left;
                        angle = 0;
                        sx = -1;
                        break;
                    case Direction.UP:
                        newLocation = location.up;
                        if (previousMove === Direction.LEFT) {
                            sx = 1;
                        }
                        angle = Math.PI / 2;
                        break;
                    case Direction.RIGHT:
                        newLocation = location.right;
                        angle = 0;
                        sx = 1;
                        break;
                    case Direction.DOWN:
                        newLocation = location.down;
                        if (previousMove === Direction.LEFT) {
                            sx = 1;
                        }
                        angle = -Math.PI / 2;
                        break;
                    default:
                        return;
                }

                if (newLocation === null || !location.walls[keyCode]
                    .isPenetrable) {
                    return;
                }

                if (angle !== undefined) {
                    if (keyCode === Direction.UP || keyCode ===
                        Direction.DOWN) {
                        if (sx !== undefined) {
                            this.transformation.sx = sx;
                        }
                    }
                    this.transformation.angle = angle;
                    if (keyCode === Direction.LEFT || keyCode ===
                        Direction.RIGHT) {
                        if (sx !== undefined) {
                            this.transformation.sx = sx;
                        }
                    }
                } else if (sx !== undefined) {
                    this.transformation.sx = sx;
                }

                previousMove = keyCode;
                dx = newLocation.x - location.x;
                dy = newLocation.y - location.y;

                var
                newCenter = {
                    x: this.x + dx,
                    y: this.y + dy
                },
                    dirX = dx > 0 ? 1 : -1,
                    dirY = dy > 0 ? 1 : -1,
                    idealTime = 100,
                    animation = new Animation.Animation(this, function(time,
                        timeDiff) {
                        _this.x += Math.round(dx / idealTime *
                            timeDiff);
                        _this.y += Math.round(dy / idealTime *
                            timeDiff);
                        return dirX * _this.x > dirX * newCenter.x ||
                            dirY * _this.y > dirY * newCenter.y;
                    }, function() {
                        _this.isAnimating = false;
                        _this.x = newCenter.x;
                        _this.y = newCenter.y;
                        location = newLocation;
                    });

                this.isAnimating = true;
                animation.start();
            };

            inputHandler.bind('keydown', function(ev) {
                _this.move(ev.keyCode);
            });

            // Call init to perform setup
            init();
        }
    };

    return module;
});
