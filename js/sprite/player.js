var AbstractPlayer = require('./abstractPlayer'),
    Shape = require('../foundation/shape'),
    Prize = require('./prize'),
    Enemy = require('./enemy'),
    Animation = require('../foundation/animation');

/**
    The Player class handles the actions and drawing of the main player.

    @class Player
    @extends Sprite
 */


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
module.exports = {
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
         @param {Engine} physicsEngine Engine instance
         @param {CanvasDrawer} CanvasDrawer instance
         @param {Function} onWin Function to perform on winning
         @param {Function} onDeath Function to perform on death
     */

    Player: function(row, column, maze, inputHandler, physicsEngine,
        drawer, onWin, onDeath) {
        var _this = this;

        /////////////////////////////////////
        // Private instance methods/fields //
        /////////////////////////////////////

        var
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
            shapes = [head, eye, mouth];

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

            var
            cycleDuration = 600,
                mouthAnim = new Animation.Animation(_this, function(
                    time) {
                    mouth.transformation.sy = MOUTH_MAX * Math.sin(
                        time / cycleDuration * Math.PI * 2);
                });

            mouthAnim.start();

            inputHandler.bind('keydown', function(ev) {
                _this.move(ev.keyCode);
            });
        }

        ///////////////////////////
        // Public methods/fields //
        ///////////////////////////

        /**
            Check whether a given array of candidate Sprites contains a
            Sprite that collides with this one. This method is called by
            the physics engine. If a collision occurs with an enemy, the
            player dies.

            @method checkCollision
            @param  {Array} candidates An arrau of Sprites that have
            bounding boxes that intersect with this Sprite's bounding box.
            @return {void}
         */
        this.checkCollision = function(candidates) {
            var
            prizes = candidates.filter(function(candidate) {
                return candidate instanceof Prize.Prize;
            }),
                enemies = candidates.filter(function(candidate) {
                    return candidate instanceof Enemy.Enemy;
                });

            if (prizes.length > 0) {
                onWin();
            } else if (enemies.length > 0) {
                onDeath();
            }
        };

        // Call init to perform setup
        init();
    }
};
