var
AbstractPlayer = require('./abstractPlayer'),
    Shape = require('../foundation/shape'),
    Animation = require('../foundation/animation'),
    Hash = require('../util/hash');

/**
    This class handles the AI and drawing of an enemy.

    @class Enemy
    @extends Sprite
 */


//////////////////////////////////
// Private class methods/fields //
//////////////////////////////////

var
MOVE_DELAY = 300,
    FILL_STYLE = '#FF0000',
    RADIUS = 20;

/**
    @module sprite/enemy
 */
module.exports = {
    /////////////////////////////////
    // Public class methods/fields //
    /////////////////////////////////

    /**
         @class Enemy
         @constructor
         @param {integer} row Row in maze
         @param {integer} column Column in maze
         @param {Maze} maze Maze instance
         @param {Player} player Player instance
         @param {Engine} Engine instance
         @param {CanvasDrawer} CanvasDrawer instance
         @param {Worker} [worker=undefined] Worker to calculate route to player
         efficiently
     */
    Enemy: function(row, column, maze, player, physicsEngine, drawer, worker) {
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
                    fillStyle: FILL_STYLE,
                    strokeStyle: 'black'
                }),
            shapes = [head],
            movesQueue = [],
            mazeJson = maze.toJSON(),
            lastPlayerLocation = player.location,
            messageId = 0;

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
                // Change messageId after move to invalidate old messages
                messageId++;
            }
            if (movesQueue.length === 0 ||
                player.location !== lastPlayerLocation) {
                lastPlayerLocation = player.location;
                this.calculateRoute();
            }
        };

        this.calculateRoute = function() {
            if (worker === undefined) {
                return; // TODO: calculate route without Worker
            }

            worker.addEventListener('message', function(ev) {
                var data = ev.data,
                    moves = data.moves,
                    responseId = data.responseId;

                // Make sure the enemy has not moved since the request
                if (responseId !== messageId) {
                    return;
                }

                _this.clearMoves();
                _this.addMoves(moves);
            });

            worker.postMessage({
                graph: mazeJson,
                source: Hash.hashcode(this.location),
                destination: Hash.hashcode(player.location),
                messageId: messageId
            });
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
