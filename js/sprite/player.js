/**
    The Player class handles the actions and drawing of the main player.

    @class Player
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

    var STEP_DIST = 50;

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
         */

        Player: function(drawer, inputHandler, physicsEngine) {
            var _this = this;

            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////

            var
            drawingSettingsArr = [{
                fillStyle: 'yellow'
            }, {
                fillStyle: 'black'
            }, {
                fillStyle: 'black'
            }],
                center = {
                    x: 0,
                    y: 0
                },
                head = new Shape.Circle(center.x, center.y, 20,
                    drawer, drawingSettingsArr[0]),
                eye = new Shape.Circle(center.x + 10, center.y - 5, 4,
                    drawer, drawingSettingsArr[1]),
                mouth = new Shape.Rectangle(center.x + 5, center.y + 5, 15,
                    5, drawer, drawingSettingsArr[2]),
                shapes = [head, eye, mouth],
                isAnimating = false,
                previousMove;

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

            // Extend Sprite constructor
            Sprite.Sprite.call(this, shapes, drawer, drawingSettingsArr);

            // After constructing shapes around origin, translate to position
            this.x = 75;
            this.y = 75;

            this.move = function(keyCode) {
                if (this.isAnimating) {
                    return;
                }

                var
                dx = 0,
                    dy = 0;

                switch (keyCode) {
                    case Direction.LEFT:
                        dx = -STEP_DIST;
                        this.transformation.angle = 0;
                        this.transformation.sx = -1;
                        break;
                    case Direction.UP:
                        if (previousMove === Direction.LEFT) {
                            this.transformation.sx = 1;
                        }
                        dy = -STEP_DIST;
                        this.transformation.angle = Math.PI / 2;
                        break;
                    case Direction.RIGHT:
                        dx = STEP_DIST;
                        this.transformation.angle = 0;
                        this.transformation.sx = 1;
                        break;
                    case Direction.DOWN:
                        if (previousMove === Direction.LEFT) {
                            this.transformation.sx = 1;
                        }
                        dy = STEP_DIST;
                        this.transformation.angle = -Math.PI / 2;
                        break;
                    default:
                        return;
                }
                previousMove = keyCode;

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
                        _this.x += Math.floor(dx / idealTime *
                            timeDiff);
                        _this.y += Math.floor(dy / idealTime *
                            timeDiff);
                        return dirX * _this.x > dirX * newCenter.x ||
                            dirY * _this.y > dirY * newCenter.y;
                    }, function() {
                        _this.isAnimating = false;
                        _this.x = newCenter.x;
                        _this.y = newCenter.y;
                    });

                this.isAnimating = true;
                animation.start();
            };

            inputHandler.bind('keydown', function(ev) {
                _this.move(ev.keyCode);
            });
        }

    };

    return module;
});
