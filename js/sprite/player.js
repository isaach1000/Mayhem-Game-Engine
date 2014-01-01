/**
    The Player class handles the actions and drawing of the main player.

    @class Player
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
             @param {Engine} physicsEngine Engine instance
             @param {CanvasDrawer} CanvasDrawer instance
         */

        Player: function(row, column, maze, inputHandler, physicsEngine,
            drawer) {
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

            // Call init to perform setup
            init();
        }
    };

    return module;
});
