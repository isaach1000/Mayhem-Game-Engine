var
Sprite = require('./sprite'),
    Shape = require('../foundation/shape'),
    Animation = require('../foundation/animation'),
    Direction = require('../enum/direction');

/**
    Abstract class for {{#crossLink Player}}{{/crossLink}} and
    {{#crossLink Enemy}}{{/crossLink}} classes.

    @class AbstractPlayer
 */


//////////////////////////////////
// Private class methods/fields //
//////////////////////////////////

/**
    @module sprite/abstractPlayer
 */
module.exports = {
    /////////////////////////////////
    // Public class methods/fields //
    /////////////////////////////////

    /**
         @class AbstractPlayer
         @constructor
         @param {integer} row Row in maze
         @param {integer} column Column in maze
         @param {Maze} maze Maze instance
         @param {Engine} physicsEngine Engine instance
         @param {CanvasDrawer} CanvasDrawer instance
         @param {Array} shapes An array of shapes
     */

    AbstractPlayer: function(row, column, maze, physicsEngine, drawer,
        shapes) {
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
            isAnimating = false,
            isFrozen = false,
            previousMove;

        /**
            Initialization method

            @method init
            @private
            @return {void}
         */
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
            /**
                Location of AbstractPlayer instance in Maze

                @property location
                @type {MazeLocation}
             */
            location: {
                get: function() {
                    return location;
                },
                set: function(newLocation) {
                    location = newLocation;
                }
            },

            /**
                Whether or not the AbstractPlayer instance currently being
                animated

                @property isAnimating
                @type {boolean}
             */
            isAnimating: {
                get: function() {
                    return isAnimating;
                },
                set: function(value) {
                    isAnimating = value;
                }
            },

            /**
                Whether or not the AbstractPlayer instance currently frozen

                @property isFrozen
                @type {boolean}
             */
            isFrozen: {
                get: function() {
                    return isFrozen;
                },
                set: function(value) {
                    isFrozen = value;
                }
            },
        });

        /**
            Get whether or not the AbstractPlayer instance can move based
            on the isAnimating and isFrozen properties

            @method canMove
            @return {boolean} Whether or not the AbstractPlayer can move
         */
        this.canMove = function() {
            return !this.isAnimating && !this.isFrozen;
        };

        /**
            Move AbstractPlayer instance

            @method move
            @param  {Direction} direction Direction to move
            @return {void}
         */
        this.move = function(direction) {
            if (!this.canMove()) {
                return;
            }

            var newLocation, dx, dy, sx, angle;

            switch (direction) {
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

            if (newLocation === null || !location.walls[direction]
                .isPenetrable) {
                return;
            }

            if (angle !== undefined) {
                if (direction === Direction.UP || direction ===
                    Direction.DOWN) {
                    if (sx !== undefined) {
                        this.transformation.sx = sx;
                    }
                }
                this.transformation.angle = angle;
                if (direction === Direction.LEFT || direction ===
                    Direction.RIGHT) {
                    if (sx !== undefined) {
                        this.transformation.sx = sx;
                    }
                }
            } else if (sx !== undefined) {
                this.transformation.sx = sx;
            }

            previousMove = direction;
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

                    // Notify the physics engine that a change occurred
                    physicsEngine.updatePositions();
                });

            this.isAnimating = true;
            animation.start();
        };

        // Call init to perform setup
        init();
    }

};
